"""Extract AlexNet architecture, first-layer filters, and per-layer weight
statistics from the official torchvision pretrained model and save them as
compact JSON files for the static AlexNet visualization page.

Run once locally:

    python3 scripts/extract_alexnet.py

Outputs to assets/data/alexnet/:
    architecture.json   - layer list with shapes and parameter counts
    conv1_filters.json  - 96 x 11 x 11 x 3 first conv filters as uint8 RGB
    weight_stats.json   - per-layer histograms and summary statistics
"""

from __future__ import annotations

import json
from pathlib import Path

import torch
from torchvision.models import alexnet, AlexNet_Weights


REPO_ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = REPO_ROOT / "assets" / "data" / "alexnet"


def layer_label(module: torch.nn.Module, idx: int, section: str) -> str:
    kind = type(module).__name__
    return f"{section}.{idx}.{kind}"


def describe_layer(module: torch.nn.Module) -> dict:
    info: dict = {"type": type(module).__name__}
    if isinstance(module, torch.nn.Conv2d):
        info.update(
            in_channels=module.in_channels,
            out_channels=module.out_channels,
            kernel_size=list(module.kernel_size),
            stride=list(module.stride),
            padding=list(module.padding),
        )
    elif isinstance(module, torch.nn.MaxPool2d):
        info.update(
            kernel_size=module.kernel_size,
            stride=module.stride,
        )
    elif isinstance(module, torch.nn.Linear):
        info.update(
            in_features=module.in_features,
            out_features=module.out_features,
        )
    elif isinstance(module, torch.nn.Dropout):
        info.update(p=module.p)
    elif isinstance(module, torch.nn.AdaptiveAvgPool2d):
        info.update(output_size=list(module.output_size))
    params = sum(p.numel() for p in module.parameters())
    info["params"] = int(params)
    return info


def trace_shapes(model: torch.nn.Module) -> list[dict]:
    """Run a dummy 3x224x224 tensor through the model and record per-module
    output shapes."""
    records: list[dict] = []

    def hook_factory(label: str, module: torch.nn.Module):
        def hook(_m, _inp, out):
            shape = list(out.shape)
            records.append({"label": label, **describe_layer(module), "out_shape": shape})

        return hook

    handles = []
    for idx, m in enumerate(model.features):
        handles.append(m.register_forward_hook(hook_factory(layer_label(m, idx, "features"), m)))
    handles.append(model.avgpool.register_forward_hook(hook_factory("avgpool.AdaptiveAvgPool2d", model.avgpool)))
    for idx, m in enumerate(model.classifier):
        handles.append(m.register_forward_hook(hook_factory(layer_label(m, idx, "classifier"), m)))

    with torch.no_grad():
        model.eval()
        x = torch.zeros(1, 3, 224, 224)
        model(x)

    for h in handles:
        h.remove()
    return records


def filters_to_uint8(weights: torch.Tensor) -> list[list[list[list[int]]]]:
    """Normalize each filter independently to 0..255 and return nested lists
    shaped (N, H, W, 3)."""
    out = []
    w = weights.detach().cpu()
    for i in range(w.shape[0]):
        f = w[i]  # (3, H, W)
        fmin = f.min()
        fmax = f.max()
        scale = (f - fmin) / (fmax - fmin + 1e-8)
        rgb = (scale * 255.0).clamp(0, 255).to(torch.uint8)
        # to HxWx3
        rgb = rgb.permute(1, 2, 0).tolist()
        out.append(rgb)
    return out


def histogram(values: torch.Tensor, bins: int = 40) -> dict:
    flat = values.detach().cpu().flatten().float()
    lo = float(flat.min())
    hi = float(flat.max())
    counts = torch.histc(flat, bins=bins, min=lo, max=hi).to(torch.int64).tolist()
    return {"min": lo, "max": hi, "bins": bins, "counts": counts}


def weight_stats(model: torch.nn.Module) -> list[dict]:
    stats = []
    for name, p in model.named_parameters():
        t = p.detach().cpu().float()
        stats.append(
            {
                "name": name,
                "shape": list(t.shape),
                "numel": int(t.numel()),
                "mean": float(t.mean()),
                "std": float(t.std()),
                "min": float(t.min()),
                "max": float(t.max()),
                "histogram": histogram(t),
            }
        )
    return stats


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    print("Loading pretrained AlexNet (IMAGENET1K_V1)...")
    weights = AlexNet_Weights.IMAGENET1K_V1
    model = alexnet(weights=weights)
    model.eval()

    print("Tracing layer shapes...")
    arch = trace_shapes(model)
    total_params = sum(p.numel() for p in model.parameters())
    arch_doc = {
        "name": "AlexNet",
        "source": "torchvision.models.alexnet (IMAGENET1K_V1)",
        "input_shape": [1, 3, 224, 224],
        "total_params": int(total_params),
        "layers": arch,
    }
    (OUT_DIR / "architecture.json").write_text(json.dumps(arch_doc, indent=2))
    print(f"  -> architecture.json ({len(arch)} modules, {total_params:,} params)")

    print("Extracting conv1 filters...")
    conv1 = model.features[0]
    assert isinstance(conv1, torch.nn.Conv2d)
    filters = filters_to_uint8(conv1.weight)
    conv1_doc = {
        "shape": list(conv1.weight.shape),  # [96, 3, 11, 11]
        "count": conv1.weight.shape[0],
        "kernel": conv1.weight.shape[2],
        "channels": conv1.weight.shape[1],
        "filters_rgb_uint8": filters,
        "bias": conv1.bias.detach().cpu().tolist() if conv1.bias is not None else None,
    }
    (OUT_DIR / "conv1_filters.json").write_text(json.dumps(conv1_doc))
    print(f"  -> conv1_filters.json ({len(filters)} filters)")

    print("Computing per-parameter weight statistics...")
    stats = weight_stats(model)
    (OUT_DIR / "weight_stats.json").write_text(json.dumps({"parameters": stats}))
    print(f"  -> weight_stats.json ({len(stats)} tensors)")

    print("Sampling fully connected layers...")
    fc_doc = sample_fc_layers(model, samples_per_layer=256)
    (OUT_DIR / "fc_sample.json").write_text(json.dumps(fc_doc))
    print(
        f"  -> fc_sample.json ({len(fc_doc['layers'])} FC layers, "
        f"{fc_doc['samples_per_layer']} sampled neurons each)"
    )

    print("Done.")


def sample_fc_layers(model: torch.nn.Module, samples_per_layer: int = 32) -> dict:
    """For each Linear layer in the classifier, pick a fixed-size set of input
    and output neuron indices and dump the corresponding submatrix of weights
    plus the sampled biases and per-neuron weight statistics."""

    linears: list[tuple[str, torch.nn.Linear]] = []
    for idx, m in enumerate(model.classifier):
        if isinstance(m, torch.nn.Linear):
            linears.append((f"classifier.{idx}", m))

    # Build a coherent chain of sample indices: layer L's output sample matches
    # layer L+1's input sample so connections line up across layers.
    dims: list[int] = [linears[0][1].in_features] + [m.out_features for _, m in linears]
    sample_indices: list[list[int]] = [
        random_sampled_indices(d, samples_per_layer, seed=42 + i) for i, d in enumerate(dims)
    ]

    layers_out: list[dict] = []
    for li, (name, m) in enumerate(linears):
        w = m.weight.detach().cpu()  # [out, in]
        b = m.bias.detach().cpu() if m.bias is not None else None

        in_idx = sample_indices[li]
        out_idx = sample_indices[li + 1]
        sub = w[out_idx][:, in_idx]  # [S, S]

        # Per-output-neuron stats over the full input row (not just sampled).
        rows = w[out_idx]
        neuron_stats = [
            {
                "index": int(out_idx[k]),
                "mean": float(rows[k].mean()),
                "std": float(rows[k].std()),
                "min": float(rows[k].min()),
                "max": float(rows[k].max()),
                "bias": float(b[out_idx[k]]) if b is not None else None,
            }
            for k in range(len(out_idx))
        ]

        layers_out.append(
            {
                "name": name,
                "in_features": int(m.in_features),
                "out_features": int(m.out_features),
                "in_sample_indices": [int(i) for i in in_idx],
                "out_sample_indices": [int(i) for i in out_idx],
                "weight_sub": sub.tolist(),  # [S][S]
                "weight_min": float(w.min()),
                "weight_max": float(w.max()),
                "weight_mean": float(w.mean()),
                "weight_std": float(w.std()),
                "bias_min": float(b.min()) if b is not None else None,
                "bias_max": float(b.max()) if b is not None else None,
                "out_neurons": neuron_stats,
            }
        )

    return {
        "samples_per_layer": samples_per_layer,
        "dims": dims,
        "layers": layers_out,
    }


def evenly_sampled_indices(total: int, count: int) -> list[int]:
    if count >= total:
        return list(range(total))
    # Evenly spaced, inclusive of endpoints when possible.
    step = total / count
    return [min(total - 1, int(round(i * step + step / 2 - 0.5))) for i in range(count)]


def random_sampled_indices(total: int, count: int, seed: int = 0) -> list[int]:
    if count >= total:
        return list(range(total))
    import random as _random
    rng = _random.Random(seed)
    return sorted(rng.sample(range(total), count))


if __name__ == "__main__":
    main()
