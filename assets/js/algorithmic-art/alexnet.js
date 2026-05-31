/**
 * AlexNet — Fully Connected Layers (flow-style 3D)
 *
 * Renders the three Linear layers of AlexNet's classifier as a left-to-right
 * flow diagram with smooth bezier connections between successive neuron
 * columns. The full sampled network is drawn faintly in the background; on
 * hover or click of any node, only the connections of that node are
 * highlighted, with the top-magnitude weights labeled in place.
 *
 * Mouse interaction:
 *   - Drag             orbit the model
 *   - Wheel            zoom
 *   - Right / shift +
 *     drag             pan
 *   - Hover a sphere   temporarily highlights its connections
 *   - Click a sphere   pins the highlight (click again or click empty space
 *                      to release)
 *
 * Data is sampled offline by scripts/extract_alexnet.py and committed to
 * assets/data/alexnet/fc_sample.json.
 */

import * as THREE from './vendor/three.module.min.js';

const DATA_FILE = '../assets/data/alexnet/fc_sample.json';

initAlexNetFlow();

function initAlexNetFlow() {
  const canvas = document.getElementById('alexnetCanvas');
  if (!canvas) return;
  const infoEl = document.getElementById('alexnetInfo');

  setInfo(infoEl, '<span class="info-placeholder">Loading fully connected weights…</span>');

  fetch(DATA_FILE)
    .then(r => r.json())
    .then(data => buildScene(canvas, infoEl, data))
    .catch(err => {
      setInfo(infoEl, '<span class="info-placeholder">Failed to load model data: ' +
        escapeHtml(String(err)) + '</span>');
    });
}

function buildScene(canvas, infoEl, data) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  // Use the same background as other algorithmic-art items (CSS var fallback)
  // Try to read the CSS variable, fallback to a subtle gray if not found
  let bg = getComputedStyle(document.body).getPropertyValue('--surface-subtle').trim();
  if (!bg) bg = '#f6f8fa';
  // Convert CSS color to THREE.Color if needed
  renderer.setClearColor(bg);
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    40,
    canvas.clientWidth / (canvas.clientHeight || 1),
    0.1,
    5000
  );

  // Studio-style three-point lighting so spheres feel rounded and crisp.
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 0.75);
  key.position.set(40, 80, 100);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xdbe6ff, 0.35);
  fill.position.set(-60, -20, 40);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.25);
  rim.position.set(0, 0, -120);
  scene.add(rim);

  const root = new THREE.Group();
  scene.add(root);

  // ---------- Layout ----------

  // Interactive samples per stage. Every stage (image, conv, FC) renders the
  // same number of translucent "resting" neuron spheres; hovering one "fires"
  // it (full opacity, strong emissive, scaled up).
  const SAMPLES = 128;

  // Full AlexNet pipeline. Each stage is rendered as a free-floating cluster
  // of solid spheres sized from its real tensor shape — no bounding box, no
  // labels. FC stages additionally carry the sign-colored weight flow drawn
  // from the extracted weight submatrices.
  const STAGES = [
    { name: 'Image',      type: 'img',  shape3: [3, 16, 16],   theme: 0xb0bec5, kernel: '3 × 224 × 224' },
    { name: 'Conv1+Pool', type: 'conv', shape3: [64, 27, 27],  theme: 0x26a69a, kernel: '11×11, s4 → pool' },
    { name: 'Conv2+Pool', type: 'conv', shape3: [192, 13, 13], theme: 0x00897b, kernel: '5×5 → pool' },
    { name: 'Conv3',      type: 'conv', shape3: [384, 13, 13], theme: 0x00796b, kernel: '3×3' },
    { name: 'Conv4',      type: 'conv', shape3: [256, 13, 13], theme: 0x00695c, kernel: '3×3' },
    { name: 'Conv5+Pool', type: 'conv', shape3: [256, 6, 6],   theme: 0x004d40, kernel: '3×3 → pool' },
    { name: 'Flatten',    type: 'fc',   shape3: [24, 24, 16],  flat: 9216, theme: 0x7e57c2, fcSlot: 0 },
    { name: 'FC1',        type: 'fc',   shape3: [16, 16, 16],  flat: 4096, theme: 0xff9800, fcSlot: 1 },
    { name: 'FC2',        type: 'fc',   shape3: [16, 16, 16],  flat: 4096, theme: 0xfb8c00, fcSlot: 2 },
    { name: 'Output',     type: 'fc',   shape3: [10, 10, 10],  flat: 1000, theme: 0xe53935, fcSlot: 3 },
  ];

  // All cubes are scaled so their largest axis matches this world-space length.
  const TARGET_CUBE_SIZE = 14;
  const COLUMN_SPACING = 22;
  const CURVE_SEGMENTS = 24;
  const TUBE_MIN_R = 0.04;
  const TUBE_MAX_R = 0.28;

  // Sphere style: deep blue/cyan base, strong blue glow, blurred halo. On fire: white/yellow core, blue glow, larger scale, bright halo.
  const NEURON_BASE_COLOR = 0x00bcd4; // cyan/blue
  const NEURON_EMISSIVE = 0x00bcd4;
  const REST_OPACITY = 0.38;
  const REST_EMISSIVE = 0.22;
  const FIRE_OPACITY = 1.0;
  const FIRE_EMISSIVE = 2.2;
  const FIRE_SCALE = 1.85;
  const FIRE_COLOR = 0xfffbe6; // white/yellow core
  const HALO_COLOR = 0x00bcd4;
  const HALO_OPACITY = 0.32;
  const HALO_OPACITY_FIRE = 0.72;

  // Shared geometry.
  const sampledGeo = new THREE.SphereGeometry(1, 18, 14);
  const tmpMatrix = new THREE.Matrix4();
  const tmpPos = new THREE.Vector3();

  // Stable per-stage PRNG so the random conv positions are deterministic.
  function mulberry32(seed) {
    let t = seed >>> 0;
    return function () {
      t = (t + 0x6D2B79F5) >>> 0;
      let x = t;
      x = Math.imul(x ^ (x >>> 15), x | 1);
      x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Blurred halo sprite for glow effect
  function makeHalo(radius, opacity) {
    const map = makeBlurredCircleTexture();
    const mat = new THREE.SpriteMaterial({
      map,
      color: HALO_COLOR,
      transparent: true,
      opacity,
      depthWrite: false,
      depthTest: true,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(radius * 3.2, radius * 3.2, 1);
    sprite.renderOrder = -10;
    return sprite;
  }

  // Generate a blurred circle texture for the halo
  function makeBlurredCircleTexture() {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(size/2, size/2, size*0.18, size/2, size/2, size*0.48);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.25, 'rgba(0,188,212,0.45)');
    grad.addColorStop(0.7, 'rgba(0,188,212,0.08)');
    grad.addColorStop(1, 'rgba(0,188,212,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,size,size);
    return new THREE.CanvasTexture(canvas);
  }

  function makeNeuronMesh(radius) {
    const mesh = new THREE.Mesh(
      sampledGeo,
      new THREE.MeshStandardMaterial({
        color: NEURON_BASE_COLOR,
        roughness: 0.38,
        metalness: 0.18,
        emissive: NEURON_EMISSIVE,
        emissiveIntensity: REST_EMISSIVE,
        transparent: true,
        opacity: REST_OPACITY,
        depthWrite: false,
      })
    );
    mesh.scale.setScalar(radius);
    // Add blurred halo sprite as child
    const halo = makeHalo(radius, HALO_OPACITY);
    mesh.add(halo);
    mesh.userData.halo = halo;
    return mesh;
  }

  // `columns` holds only the four FC cubes (indexed by fcSlot 0..3) since the
  // weight-flow logic operates over FC weight data only. Conv/image spheres
  // are still interactive but show no outgoing weight tubes.
  const columns = [];
  // `stageMeta` records cube extents per stage for streamline routing.
  const stageMeta = [];

  for (let s = 0; s < STAGES.length; s++) {
    const stage = STAGES[s];
    const cx = s * COLUMN_SPACING - ((STAGES.length - 1) * COLUMN_SPACING) / 2;
    const [a, b, c2] = stage.shape3;
    const maxSide = Math.max(a, b, c2);
    const unit = TARGET_CUBE_SIZE / maxSide;
    // Container axes: x = width, y = height, z = channels/depth.
    // shape3 is (channels, height, width) → map to (z, y, x).
    const boxW = c2 * unit;
    const boxH = b * unit;
    const boxD = a * unit;

    stageMeta.push({ cx, boxW, boxH, boxD, theme: stage.theme, type: stage.type });

    // ---- Non-FC stages: 128 randomly placed interactive translucent spheres ----
    if (stage.type !== 'fc') {
      const rnd = mulberry32(0x9E37 + s * 1013);
      const r = Math.min(boxW, boxH, boxD) * 0.045;
      for (let i = 0; i < SAMPLES; i++) {
        const px = (rnd() - 0.5) * boxW * 0.92;
        const py = (rnd() - 0.5) * boxH * 0.92;
        const pz = (rnd() - 0.5) * boxD * 0.92;
        const mesh = makeNeuronMesh(r);
        mesh.position.set(cx + px, py, pz);
        mesh.userData = {
          kind: 'neuron',
          column: -1,
          stageIndex: s,
          stageName: stage.name,
          stageKernel: stage.kernel || '',
          rowInSample: i,
          baseColor: stage.theme,
          themeAccent: '#' + stage.theme.toString(16).padStart(6, '0'),
          sampledR: r,
        };
        root.add(mesh);
      }
      continue;
    }

    // ---- FC stages: 128 interactive spheres laid out on the cube lattice ----
    const dims3 = stage.shape3;
    const cell = TARGET_CUBE_SIZE / Math.max(dims3[0], dims3[1], dims3[2]);
    const sampledSphereR = cell * 0.50;

    const slot = stage.fcSlot;
    const layer = slot === 0 ? null : data.layers[slot - 1];
    const neurons = layer ? layer.out_neurons : null;
    const allIndices = slot === 0
      ? data.layers[0].in_sample_indices
      : data.layers[slot - 1].out_sample_indices;
    const sampledIndices = allIndices.slice(0, SAMPLES);

    let biasMin = 0, biasMax = 0;
    if (neurons) {
      const bs = neurons.slice(0, SAMPLES).map(n => n.bias).filter(v => v != null);
      if (bs.length) { biasMin = Math.min(...bs); biasMax = Math.max(...bs); }
    }

    const spheres = [];
    for (let r = 0; r < SAMPLES; r++) {
      const realIdx = sampledIndices[r];
      cubePosLocal(realIdx, dims3, cell, tmpPos);
      const stat = neurons ? neurons[r] : null;
      const color = stat && stat.bias != null
        ? shadeByBias(stage.theme, stat.bias, biasMin, biasMax)
        : tintColor(stage.theme, -0.05);
      const mesh = makeNeuronMesh(sampledSphereR);
      mesh.position.set(cx + tmpPos.x, tmpPos.y, tmpPos.z);
      mesh.userData = {
        kind: 'neuron',
        column: slot,
        stageIndex: s,
        stageName: stage.name,
        rowInSample: r,
        realIndex: realIdx,
        stat,
        baseColor: color,
        themeAccent: '#' + stage.theme.toString(16).padStart(6, '0'),
        sampledR: sampledSphereR,
      };
      root.add(mesh);
      spheres.push(mesh);
    }

    columns[slot] = { x: cx, dim: stage.flat, spheres, neurons, theme: { base: stage.theme }, sampledR: sampledSphereR, cubeH: boxH };
  }

  // ---------- Inter-FC weight flow (full sign-colored bezier) ----------

  const BG_SEGMENTS = 4;
  const BG_OPACITY = 0.16;
  data.layers.forEach((L, li) => {
    const fromSpheres = columns[li].spheres;
    const toSpheres = columns[li + 1].spheres;
    const W = L.weight_sub;
    const absMax = Math.max(Math.abs(L.weight_min || 0), Math.abs(L.weight_max || 0), 1e-6);

    const positions = [];
    const colors = [];
    for (let o = 0; o < toSpheres.length; o++) {
      const dst = toSpheres[o].position;
      const row = W[o];
      for (let i = 0; i < fromSpheres.length; i++) {
        const src = fromSpheres[i].position;
        const w = row[i];
        const intensity = Math.min(1, Math.abs(w) / absMax);
        const rgb = weightToRGB(w, intensity);
        appendBezier(positions, colors, src, dst, BG_SEGMENTS, rgb);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const mat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: BG_OPACITY,
      depthWrite: false,
    });
    const seg = new THREE.LineSegments(geo, mat);
    seg.renderOrder = 1;
    root.add(seg);
  });

  // ---------- Schematic stream lines between non-FC stages ----------

  // For consecutive stages where one or both are not FC, we cannot draw the
  // real (conv) weights, so a handful of curved streamlines indicates the
  // direction of data flow without overpromising connectivity.
  const STREAMS_PER_PAIR = 18;
  const STREAM_OPACITY = 0.22;
  for (let s = 0; s < STAGES.length - 1; s++) {
    const a = STAGES[s], b = STAGES[s + 1];
    if (a.type === 'fc' && b.type === 'fc') continue;
    const ma = stageMeta[s], mb = stageMeta[s + 1];
    const positions = [];
    const color = new THREE.Color(mixColors(a.theme, b.theme, 0.5));
    const colors = [];
    for (let k = 0; k < STREAMS_PER_PAIR; k++) {
      const py = (Math.random() - 0.5) * ma.boxH * 0.85;
      const pz = (Math.random() - 0.5) * ma.boxD * 0.85;
      const qy = (Math.random() - 0.5) * mb.boxH * 0.85;
      const qz = (Math.random() - 0.5) * mb.boxD * 0.85;
      const p = new THREE.Vector3(ma.cx + ma.boxW / 2, py, pz);
      const q = new THREE.Vector3(mb.cx - mb.boxW / 2, qy, qz);
      appendBezier(positions, colors, p, q, BG_SEGMENTS, { r: color.r, g: color.g, b: color.b });
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const mat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: STREAM_OPACITY,
      depthWrite: false,
    });
    const seg = new THREE.LineSegments(geo, mat);
    seg.renderOrder = 1;
    root.add(seg);
  }

  // ---------- Intra-FC scaffolding lines ----------

  // Straight lines between every pair of sampled spheres inside the same FC
  // cube — visual scaffolding only (FC neurons share no learned weights with
  // siblings in the same layer).
  const INTRA_OPACITY = 0.06;
  columns.forEach((col) => {
    if (!col) return;
    const spheres = col.spheres;
    const n = spheres.length;
    if (n < 2) return;
    const positions = [];
    for (let i = 0; i < n; i++) {
      const a = spheres[i].position;
      for (let j = i + 1; j < n; j++) {
        const b = spheres[j].position;
        positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const mat = new THREE.LineBasicMaterial({
      color: shiftLightness(col.theme.base, -0.1),
      transparent: true,
      opacity: INTRA_OPACITY,
      depthWrite: false,
    });
    const seg = new THREE.LineSegments(geo, mat);
    seg.renderOrder = 1;
    root.add(seg);
  });

  // Expose count of FC slots for highlight bookkeeping.
  const NCOL = columns.length;

  // ---------- Highlight layer (dynamic) ----------

  // Group cleared/rebuilt whenever the focused neuron changes.
  const highlightGroup = new THREE.Group();
  highlightGroup.renderOrder = 2;
  root.add(highlightGroup);

  // ---------- Fit camera ----------

  const allBounds = new THREE.Box3();
  allBounds.expandByObject(root);
  const fit = fitCameraToBox(camera, allBounds, canvas);
  const initialCameraPos = camera.position.clone();
  const initialTarget = fit.target.clone();
  const controls = createControls(canvas, camera, initialTarget);

  // ---------- Selection ----------

  let hovered = null;
  let pinned = null;
  let focused = null;   // sphere object that is currently driving the highlight

  function setFocused(mesh) {
    if (focused === mesh) return;
    if (focused) {
      const u = focused.userData;
      focused.material.color.setHex(NEURON_BASE_COLOR);
      focused.material.emissive.setHex(NEURON_EMISSIVE);
      focused.material.emissiveIntensity = REST_EMISSIVE;
      focused.material.opacity = REST_OPACITY;
      focused.scale.setScalar(u.sampledR || 1);
      if (focused.userData.halo) focused.userData.halo.material.opacity = HALO_OPACITY;
    }
    focused = mesh;
    clearHighlights();
    if (mesh) {
      const u = mesh.userData;
      // Fire the neuron: white/yellow core, strong blue glow, scaled up, bright halo.
      mesh.material.color.setHex(FIRE_COLOR);
      mesh.material.emissive.setHex(NEURON_EMISSIVE);
      mesh.material.emissiveIntensity = FIRE_EMISSIVE;
      mesh.material.opacity = FIRE_OPACITY;
      mesh.scale.setScalar((u.sampledR || 1) * FIRE_SCALE);
      if (u.halo) u.halo.material.opacity = HALO_OPACITY_FIRE;
      buildHighlightsFor(mesh);
      setInfo(infoEl, describeNeuron(u, data, pinned === mesh));
    } else {
      setInfo(infoEl, defaultInfo(data));
    }
  }

  function clearHighlights() {
    while (highlightGroup.children.length) {
      const obj = highlightGroup.children.pop();
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    }
  }

  function buildHighlightsFor(mesh) {
    const u = mesh.userData;
    const col = u.column;
    // Conv/image neurons have no extracted weight data; firing alone is the
    // entire highlight.
    if (col < 0) return;
    const row = u.rowInSample;

    // Outgoing: from this neuron in column `col` to all neurons in col+1.
    if (col < NCOL - 1) {
      const layer = data.layers[col];
      const fromPos = columns[col].spheres[row].position;
      const targets = columns[col + 1].spheres;
      const weights = targets.map((s, o) => ({
        target: s, o, w: layer.weight_sub[o][row],
      }));
      addHighlightSet(layer, weights, fromPos, true);
    }

    // Incoming: from all neurons in col-1 to this neuron in col.
    if (col > 0) {
      const layer = data.layers[col - 1];
      const toPos = columns[col].spheres[row].position;
      const sources = columns[col - 1].spheres;
      const weights = sources.map((s, i) => ({
        target: s, o: i, w: layer.weight_sub[row][i],
      }));
      addHighlightSet(layer, weights, toPos, false);
    }
  }

  function addHighlightSet(layer, items, pivotPos, outgoing) {
    const absMax = Math.max(Math.abs(layer.weight_min || 0), Math.abs(layer.weight_max || 0), 1e-6);

    // Tubes whose radius scales with |w|: stronger weights = thicker pipes.
    // Sign drives color: blue positive, red negative.
    items.forEach(it => {
      const a = outgoing ? pivotPos : it.target.position;
      const b = outgoing ? it.target.position : pivotPos;
      const curve = bezierCurve(a, b);
      const mag = Math.min(1, Math.abs(it.w) / absMax);
      const radius = TUBE_MIN_R + (TUBE_MAX_R - TUBE_MIN_R) * mag;
      const colorHex = it.w >= 0 ? 0x1976d2 : 0xd32f2f;
      const tubeGeo = new THREE.TubeGeometry(curve, CURVE_SEGMENTS, radius, 8, false);
      const tubeMat = new THREE.MeshLambertMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.55 + 0.4 * mag,
        depthWrite: false,
      });
      highlightGroup.add(new THREE.Mesh(tubeGeo, tubeMat));
    });

    // Soft halo around each connected target sphere (sized to that column).
    items.forEach(it => {
      const haloR = (it.target.userData.sampledR || 0.55) * 1.6;
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(haloR, 18, 14),
        new THREE.MeshBasicMaterial({
          color: it.w >= 0 ? 0x1976d2 : 0xd32f2f,
          transparent: true,
          opacity: 0.22,
          depthWrite: false,
        })
      );
      halo.position.copy(it.target.position);
      highlightGroup.add(halo);
    });
  }

  // ---------- Picking ----------

  const raycaster = new THREE.Raycaster();
  const mouseNDC = new THREE.Vector2();
  const sphereList = [];
  root.traverse(o => {
    if (o.isMesh && o.userData && o.userData.kind === 'neuron') sphereList.push(o);
  });

  let dragMoved = 0;
  let dragStart = null;

  function pickSphere(ev) {
    const rect = canvas.getBoundingClientRect();
    mouseNDC.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    mouseNDC.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouseNDC, camera);
    const hit = raycaster.intersectObjects(sphereList, false)[0];
    return hit ? hit.object : null;
  }

  function onPointerMove(ev) {
    if (dragStart) {
      dragMoved += Math.abs(ev.clientX - dragStart.x) + Math.abs(ev.clientY - dragStart.y);
      dragStart = { x: ev.clientX, y: ev.clientY };
    }
    if (pinned) return; // when pinned, hover does nothing
    const hit = pickSphere(ev);
    if (hit !== hovered) {
      hovered = hit;
      setFocused(hovered);
    }
  }

  function onPointerLeave() {
    if (pinned) return;
    if (hovered) {
      hovered = null;
      setFocused(null);
    }
  }

  function onPointerDown(ev) {
    dragStart = { x: ev.clientX, y: ev.clientY };
    dragMoved = 0;
  }

  function onPointerUp(ev) {
    const wasClick = dragMoved < 5;
    dragStart = null;
    if (!wasClick) return;
    const hit = pickSphere(ev);
    if (hit) {
      // Toggle pin on the clicked node.
      pinned = pinned === hit ? null : hit;
      hovered = null;
      setFocused(pinned);
    } else if (pinned) {
      pinned = null;
      setFocused(null);
    }
  }

  canvas.addEventListener('pointermove', onPointerMove, { passive: true });
  canvas.addEventListener('pointerleave', onPointerLeave);
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointerup', onPointerUp);

  // ---------- UI buttons ----------

  const vizPage = canvas.closest('.viz-page');
  let expandBtnRef = null;

  function setExpanded(on) {
    if (!vizPage) return;
    vizPage.classList.toggle('viz-expanded', !!on);
    document.body.classList.toggle('viz-expanded-lock', !!on);
    if (expandBtnRef) {
      expandBtnRef.textContent = on ? 'Collapse' : 'Expand';
      expandBtnRef.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    // Defer to next frame so layout settles before resizing the renderer.
    requestAnimationFrame(() => { resize(); });
  }

  addButtons(infoEl, [
    {
      label: 'Expand',
      onClick: (ev) => {
        expandBtnRef = ev && ev.currentTarget ? ev.currentTarget : expandBtnRef;
        const isOn = vizPage && vizPage.classList.contains('viz-expanded');
        setExpanded(!isOn);
      },
    },
    {
      label: 'Reset view',
      onClick: () => {
        camera.position.copy(initialCameraPos);
        controls.setTarget(initialTarget);
      },
    },
    {
      label: 'Clear selection',
      onClick: () => {
        pinned = null;
        hovered = null;
        setFocused(null);
      },
    },
  ]);

  // Capture a reference to the Expand button so we can flip its label.
  if (vizPage) {
    const btns = infoEl.querySelectorAll('button');
    btns.forEach(b => { if (b.textContent.trim() === 'Expand') expandBtnRef = b; });
  }

  // Escape exits expanded mode.
  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && vizPage && vizPage.classList.contains('viz-expanded')) {
      setExpanded(false);
    }
  });

  setInfo(infoEl, defaultInfo(data));

  // ---------- Resize / loop ----------

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight || w;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(() => resize()).observe(canvas);
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

// ============================================================
// Bezier flow helpers
// ============================================================

function bezierCurve(a, b) {
  // Cubic bezier with horizontal-flow control points so curves arc smoothly
  // between successive columns.
  const mx = (a.x + b.x) / 2;
  const c1 = new THREE.Vector3(mx, a.y, a.z);
  const c2 = new THREE.Vector3(mx, b.y, b.z);
  return new THREE.CubicBezierCurve3(a, c1, c2, b);
}

function appendBezier(positions, colors, a, b, segments, rgb) {
  const pts = bezierCurve(a, b).getPoints(segments);
  for (let s = 0; s < pts.length - 1; s++) {
    const p0 = pts[s];
    const p1 = pts[s + 1];
    positions.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z);
    colors.push(rgb.r, rgb.g, rgb.b, rgb.r, rgb.g, rgb.b);
  }
}

function bezierMidpoint(a, b) {
  return bezierCurve(a, b).getPoint(0.5);
}

function cubePosLocal(i, dims3, cell, out) {
  const nx = dims3[0], ny = dims3[1], nz = dims3[2];
  const gx = i % nx;
  const gy = Math.floor(i / nx) % ny;
  const gz = Math.floor(i / (nx * ny));
  out.set(
    (gx - (nx - 1) / 2) * cell,
    ((ny - 1) / 2 - gy) * cell,
    (gz - (nz - 1) / 2) * cell,
  );
  return out;
}

// ============================================================
// Info panel
// ============================================================

function defaultInfo(data) {
  const layers = data.layers;
  const totalParams = layers.reduce(
    (acc, L) => acc + L.in_features * L.out_features + L.out_features, 0
  );
  return `<strong>AlexNet — full pipeline</strong><br>` +
    `5 conv stages + flatten + ${layers.length} Linear layers · ${data.dims.join(' → ')}<br>` +
    `FC parameters: ${totalParams.toLocaleString()} (≈ 96% of the model)<br>` +
    `Each stage renders <strong>128 translucent interactive neurons</strong>. ` +
    `Hover one to <em>fire</em> it — it lights up and (for FC stages) reveals its connection weights.<br>` +
    `<em>Click a neuron to pin it.</em>`;
}

function describeNeuron(u, data, isPinned) {
  const tag = isPinned ? ' <span style="color:#ffc107">(pinned · firing)</span>'
                       : ' <span style="color:#ffc107">(firing)</span>';
  if (u.column < 0) {
    return `<strong>${escapeHtml(u.stageName)} activation #${u.rowInSample}</strong>${tag}<br>` +
      (u.stageKernel ? `Kernel: ${escapeHtml(u.stageKernel)}<br>` : '') +
      `Convolutional / image stage — no per-neuron weight row is extracted here, so ` +
      `firing only lights up the node itself.`;
  }
  if (u.column === 0) {
    return `<strong>Flatten · input feature #${u.rowInSample}</strong>${tag}<br>` +
      `Column: input activations to FC1 (${data.dims[0].toLocaleString()} features)<br>` +
      `Outgoing weights: ${data.layers[0].out_features.toLocaleString()} into classifier[1].`;
  }
  const layer = data.layers[u.column - 1];
  const s = u.stat;
  const incoming = layer.in_features.toLocaleString();
  const outgoing = u.column < data.dims.length - 1
    ? data.layers[u.column].out_features.toLocaleString()
    : '— (output layer)';
  return `<strong>${escapeHtml(layer.name)} neuron ${s.index}</strong>${tag}<br>` +
    `Sampled position: #${u.rowInSample} of 128<br>` +
    `Layer shape: ${layer.in_features.toLocaleString()} → ${layer.out_features.toLocaleString()}<br>` +
    `Bias: <strong>${s.bias != null ? s.bias.toFixed(4) : 'n/a'}</strong><br>` +
    `Incoming weight row: mean ${s.mean.toFixed(4)}, std ${s.std.toFixed(4)}, ` +
    `range [${s.min.toFixed(3)}, ${s.max.toFixed(3)}] across ${incoming} weights.<br>` +
    `Outgoing: ${outgoing}`;
}

// ============================================================
// Colors
// ============================================================

function shadeByBias(baseHex, bias, lo, hi) {
  // Modulate the lightness of `baseHex` from -22% (low bias) to +28% (high
  // bias) so neurons sharing a column theme still read individually.
  const range = Math.max(1e-6, hi - lo);
  const t = Math.max(0, Math.min(1, (bias - lo) / range));
  const delta = -0.22 + t * 0.5;
  return shiftLightness(baseHex, delta);
}

function tintColor(baseHex, lightnessDelta) {
  return shiftLightness(baseHex, lightnessDelta);
}

function shiftLightness(hex, delta) {
  const c = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  hsl.l = Math.max(0, Math.min(1, hsl.l + delta));
  c.setHSL(hsl.h, hsl.s, hsl.l);
  return c.getHex();
}

function weightToRGB(w, intensity) {
  // Positive → blue, negative → red. `intensity` (0..1) modulates contrast.
  const bg = 0.93;
  let r, g, b;
  if (w >= 0) {
    r = bg - intensity * 0.7;
    g = bg - intensity * 0.5;
    b = bg + intensity * 0.05;
  } else {
    r = bg + intensity * 0.05;
    g = bg - intensity * 0.55;
    b = bg - intensity * 0.65;
  }
  return { r: clamp01(r), g: clamp01(g), b: clamp01(b) };
}

function mixColors(hexA, hexB, t) {
  const a = new THREE.Color(hexA);
  const b = new THREE.Color(hexB);
  return new THREE.Color(
    a.r * (1 - t) + b.r * t,
    a.g * (1 - t) + b.g * t,
    a.b * (1 - t) + b.b * t,
  ).getHex();
}

function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

function formatWeight(w) {
  return (w >= 0 ? '+' : '') + w.toFixed(3);
}

// ============================================================
// Text sprite
// ============================================================

function pillSprite(text, color, bgFill) {
  // A slightly larger pill sprite used for column titles and subtitles.
  return textSprite(text, color, bgFill, { fontSize: 52, padding: 18, scale: 0.05, radius: 14 });
}

function textSprite(text, color, bgFill, opts) {
  const o = opts || {};
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const fontSize = o.fontSize || 44;
  const padding = o.padding || 12;
  const radius = o.radius != null ? o.radius : 8;
  const scale = o.scale || 0.045;

  ctx.font = `600 ${fontSize}px sans-serif`;
  const textW = ctx.measureText(text).width;
  canvas.width = Math.ceil(textW + padding * 2);
  canvas.height = fontSize + padding * 2;

  if (bgFill) {
    ctx.fillStyle = bgFill;
    roundRect(ctx, 0, 0, canvas.width, canvas.height, radius);
    ctx.fill();
    // Thin border in the same tone as text for the pill style.
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.stroke();
  }

  ctx.font = `600 ${fontSize}px sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color || '#444';
  ctx.fillText(text, padding, canvas.height / 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({ map: tex, depthWrite: false, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(canvas.width * scale, canvas.height * scale, 1);
  return sprite;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y,     x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x,     y + h, r);
  ctx.arcTo(x,     y + h, x,     y,     r);
  ctx.arcTo(x,     y,     x + w, y,     r);
  ctx.closePath();
}

// ============================================================
// Camera + custom orbit controls
// ============================================================

function fitCameraToBox(camera, box, canvas) {
  const size = new THREE.Vector3();
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);

  const fov = camera.fov * (Math.PI / 180);
  const aspect = canvas.clientWidth / (canvas.clientHeight || 1);
  const distV = (size.y / 2) / Math.tan(fov / 2);
  const distH = (size.x / 2) / Math.tan(fov / 2) / Math.max(0.5, aspect);
  const dist = Math.max(distV, distH) * 1.2;

  // Slight 3D angle so cube depth is visible from the start.
  camera.position.set(
    center.x + dist * 0.22,
    center.y + dist * 0.16,
    center.z + dist * 0.96
  );
  camera.lookAt(center);
  camera.near = Math.max(0.1, dist / 100);
  camera.far = dist * 20;
  camera.updateProjectionMatrix();

  return { target: center, distance: dist };
}

function createControls(canvas, camera, initialTarget) {
  const target = initialTarget.clone();
  const spherical = new THREE.Spherical();
  const offset = new THREE.Vector3();
  offset.copy(camera.position).sub(target);
  spherical.setFromVector3(offset);

  const ROTATE_SPEED = 0.005;
  const ZOOM_SPEED = 0.0015;
  const PAN_SPEED = 0.0025;
  const MIN_RADIUS = 5;
  const MAX_RADIUS = 5000;
  const MIN_PHI = 0.05;
  const MAX_PHI = Math.PI - 0.05;

  let dragging = null;
  let last = { x: 0, y: 0 };
  let needsUpdate = true;

  function onPointerDown(ev) {
    if (ev.button === 2 || ev.shiftKey) dragging = 'pan';
    else if (ev.button === 0) dragging = 'rotate';
    else return;
    last = { x: ev.clientX, y: ev.clientY };
    try { canvas.setPointerCapture(ev.pointerId); } catch (e) {}
  }
  function onPointerUp(ev) {
    dragging = null;
    try { canvas.releasePointerCapture(ev.pointerId); } catch (e) {}
  }
  function onPointerMove(ev) {
    if (!dragging) return;
    const dx = ev.clientX - last.x;
    const dy = ev.clientY - last.y;
    last = { x: ev.clientX, y: ev.clientY };
    if (dragging === 'rotate') {
      spherical.theta -= dx * ROTATE_SPEED;
      spherical.phi -= dy * ROTATE_SPEED;
      spherical.phi = Math.max(MIN_PHI, Math.min(MAX_PHI, spherical.phi));
      needsUpdate = true;
    } else {
      const factor = spherical.radius * PAN_SPEED;
      const right = new THREE.Vector3();
      const up = new THREE.Vector3();
      camera.matrixWorld.extractBasis(right, up, new THREE.Vector3());
      target.addScaledVector(right, -dx * factor);
      target.addScaledVector(up, dy * factor);
      needsUpdate = true;
    }
  }
  function onWheel(ev) {
    ev.preventDefault();
    const factor = Math.exp(ev.deltaY * ZOOM_SPEED);
    spherical.radius = Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, spherical.radius * factor));
    needsUpdate = true;
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.addEventListener('wheel', onWheel, { passive: false });
  canvas.addEventListener('contextmenu', ev => ev.preventDefault());

  return {
    update() {
      if (!needsUpdate) return;
      offset.setFromSpherical(spherical);
      camera.position.copy(target).add(offset);
      camera.lookAt(target);
      needsUpdate = false;
    },
    setTarget(t) {
      target.copy(t);
      offset.copy(camera.position).sub(target);
      spherical.setFromVector3(offset);
      needsUpdate = true;
    },
  };
}

// ============================================================
// DOM helpers
// ============================================================

function addButtons(infoEl, buttons) {
  if (!infoEl) return;
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;margin-top:10px';
  buttons.forEach(b => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = b.label;
    btn.style.cssText = 'font-size:12px;padding:4px 8px;border:1px solid var(--border-color);background:var(--surface-muted);color:var(--medium-text);border-radius:3px;cursor:pointer';
    btn.addEventListener('click', b.onClick);
    wrap.appendChild(btn);
  });
  infoEl.parentNode.insertBefore(wrap, infoEl.nextSibling);
}

function setInfo(infoEl, html) { if (infoEl) infoEl.innerHTML = html; }

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
