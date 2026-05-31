/**
 * Nested Polygon Layers
 * Draws a parametric pattern of nested regular polygons that shrink and
 * rotate layer by layer. Consecutive layers are joined vertex-to-vertex
 * with straight chords, and the apparent curved petals emerge purely
 * from those straight lines.
 *
 * Interaction:
 *   - Hover or tap a layer to highlight it
 *   - "Sides +/-"  change polygon sides
 *   - "Layers +/-" change the number of nested layers
 *   - "Twist +/-"  change per-layer rotation
 *   - "Shrink +/-" change per-layer radius ratio
 *   - "Reset"      restore defaults
 */

(function () {
  function init() {
    const canvas = document.getElementById('nestedPolygonLayersCanvas');
    if (!canvas) return;
    const infoEl = document.getElementById('nestedPolygonLayersInfo');
    const ctx = canvas.getContext('2d');

    const SIZE = 640;
    canvas.width = SIZE;
    canvas.height = SIZE;

    const DEFAULTS = {
      sides: 7,
      layers: 24,
      twistDeg: 8,
      shrink: 0.94,
    };

    const state = { ...DEFAULTS, hoverLayer: null };

    // ---------- Geometry ----------

    function polygonPoints(sides, radius, rotation) {
      const pts = [];
      for (let i = 0; i < sides; i++) {
        const a = rotation + (i / sides) * Math.PI * 2 - Math.PI / 2;
        pts.push({ x: Math.cos(a) * radius, y: Math.sin(a) * radius });
      }
      return pts;
    }

    function buildLayers() {
      const layers = [];
      const baseRadius = SIZE / 2 - 24;
      let radius = baseRadius;
      let rotation = 0;
      const twist = (state.twistDeg * Math.PI) / 180;
      for (let i = 0; i < state.layers; i++) {
        layers.push({
          index: i,
          radius,
          rotation,
          points: polygonPoints(state.sides, radius, rotation),
        });
        radius *= state.shrink;
        rotation += twist;
      }
      return layers;
    }

    // ---------- Colors ----------

    function colorForLayer(i, total, alpha) {
      const t = total <= 1 ? 1 : i / (total - 1);
      let r, g, b;
      if (t < 0.5) {
        const k = t / 0.5;
        [r, g, b] = mix([110, 110, 110], [76, 175, 80], k);
      } else {
        const k = (t - 0.5) / 0.5;
        [r, g, b] = mix([76, 175, 80], [255, 99, 96], k);
      }
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function mix(a, b, t) {
      return [0, 1, 2].map(i => Math.round(a[i] + (b[i] - a[i]) * t));
    }

    // ---------- Draw ----------

    function draw() {
      const layers = buildLayers();

      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);

      const total = layers.length;
      const hover = state.hoverLayer;

      // Chords between consecutive layers
      ctx.lineWidth = 1;
      for (let i = 0; i < layers.length - 1; i++) {
        const a = layers[i].points;
        const b = layers[i + 1].points;
        const highlighted = hover === i || hover === i + 1;
        ctx.strokeStyle = colorForLayer(i, total, highlighted ? 0.95 : 0.45);
        ctx.lineWidth = highlighted ? 1.6 : 0.9;
        for (let k = 0; k < a.length; k++) {
          ctx.beginPath();
          ctx.moveTo(a[k].x, a[k].y);
          ctx.lineTo(b[k].x, b[k].y);
          ctx.stroke();
        }
      }

      // Polygon outlines
      for (let i = 0; i < layers.length; i++) {
        const pts = layers[i].points;
        const highlighted = hover === i;
        ctx.strokeStyle = colorForLayer(i, total, highlighted ? 1 : 0.85);
        ctx.lineWidth = highlighted ? 2.2 : 1.1;
        ctx.beginPath();
        pts.forEach((p, k) => {
          if (k === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.stroke();
      }

      // Center dot
      ctx.fillStyle = '#ff6360';
      ctx.beginPath();
      ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // ---------- Info ----------

    function renderInfo() {
      if (!infoEl) return;
      if (state.hoverLayer === null) {
        infoEl.innerHTML = `
          <strong>Sides:</strong> ${state.sides}<br>
          <strong>Layers:</strong> ${state.layers}<br>
          <strong>Twist:</strong> ${state.twistDeg}&deg; / layer<br>
          <strong>Shrink:</strong> ${state.shrink.toFixed(2)}x / layer
        `;
      } else {
        const i = state.hoverLayer;
        const total = state.layers;
        const role = i === 0
          ? '<span style="color:#aaa;">Outer layer</span>'
          : i === total - 1
            ? '<span style="color:#ff6360;">Inner layer</span>'
            : '<span style="color:#4caf50;">Middle layer</span>';
        const radius = (SIZE / 2 - 24) * Math.pow(state.shrink, i);
        const rotation = i * state.twistDeg;
        infoEl.innerHTML = `
          <strong>Layer:</strong> ${i + 1} / ${total}<br>
          <strong>Radius:</strong> ${radius.toFixed(1)} px<br>
          <strong>Rotation:</strong> ${rotation.toFixed(1)}&deg;<br>
          <strong>Role:</strong> ${role}
        `;
      }
    }

    // ---------- Hover ----------

    function layerFromEvent(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX - canvas.width / 2;
      const y = (e.clientY - rect.top) * scaleY - canvas.height / 2;
      const dist = Math.sqrt(x * x + y * y);
      const baseRadius = SIZE / 2 - 24;
      if (dist > baseRadius * 1.02) return null;
      // Find closest layer by radius.
      let best = null, bestDelta = Infinity;
      for (let i = 0; i < state.layers; i++) {
        const r = baseRadius * Math.pow(state.shrink, i);
        const d = Math.abs(r - dist);
        if (d < bestDelta) { bestDelta = d; best = i; }
      }
      return best;
    }

    function handleMove(e) {
      const i = layerFromEvent(e);
      if (i !== state.hoverLayer) {
        state.hoverLayer = i;
        renderInfo();
        draw();
      }
    }

    canvas.addEventListener('pointermove', handleMove);
    canvas.addEventListener('pointerdown', handleMove);
    canvas.addEventListener('pointerleave', () => {
      state.hoverLayer = null;
      renderInfo();
      draw();
    });
    canvas.addEventListener('touchmove', (e) => {
      if (e.cancelable) e.preventDefault();
      const t = e.touches[0];
      if (t) handleMove(t);
    }, { passive: false });

    // ---------- Controls ----------

    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

    function makeButton(label, onClick) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.style.cssText = 'margin:4px 6px 0 0;padding:6px 10px;border:1px solid var(--border-strong);background:transparent;color:inherit;cursor:pointer;border-radius:3px;font-size:0.85em;';
      b.addEventListener('click', onClick);
      return b;
    }

    function stepShrink(delta) {
      state.shrink = clamp(Number((state.shrink + delta).toFixed(2)), 0.86, 0.99);
    }

    function refresh() { renderInfo(); draw(); }

    if (infoEl && infoEl.parentElement) {
      const controls = document.createElement('div');
      controls.style.cssText = 'margin-top:10px;display:flex;flex-wrap:wrap;';
      controls.appendChild(makeButton('Sides -', () => { state.sides = clamp(state.sides - 1, 3, 24); refresh(); }));
      controls.appendChild(makeButton('Sides +', () => { state.sides = clamp(state.sides + 1, 3, 24); refresh(); }));
      controls.appendChild(makeButton('Layers -', () => { state.layers = clamp(state.layers - 2, 2, 80); refresh(); }));
      controls.appendChild(makeButton('Layers +', () => { state.layers = clamp(state.layers + 2, 2, 80); refresh(); }));
      controls.appendChild(makeButton('Twist -', () => { state.twistDeg = clamp(state.twistDeg - 2, -45, 45); refresh(); }));
      controls.appendChild(makeButton('Twist +', () => { state.twistDeg = clamp(state.twistDeg + 2, -45, 45); refresh(); }));
      controls.appendChild(makeButton('Shrink -', () => { stepShrink(-0.01); refresh(); }));
      controls.appendChild(makeButton('Shrink +', () => { stepShrink(0.01); refresh(); }));
      controls.appendChild(makeButton('Reset', () => { Object.assign(state, DEFAULTS, { hoverLayer: null }); refresh(); }));
      infoEl.parentElement.insertBefore(controls, infoEl.nextSibling);
    }

    refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();