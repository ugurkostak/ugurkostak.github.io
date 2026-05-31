/**
 * Curve Onion Visualization
 * Plots the family of curves y = x^n and y = x^(1/n) for n = 1..N
 * on the unit square [0,1] x [0,1]. Each pair is symmetric across
 * y = x and together they sweep out the "onion" pattern: tight against
 * the axes for large n on one side, hugging the diagonal on the other.
 *
 * Interaction:
 *   - Hover/tap inside the square to highlight the closest curve
 *   - "N -" / "N +"    change how many curves are drawn
 *   - "Mode" button    cycle: both | power (y=x^n) | root (y=x^1/n)
 *   - "Reset"
 */

(function () {
  function init() {
    const canvas = document.getElementById('curveOnionCanvas');
    if (!canvas) return;
    const infoEl = document.getElementById('curveOnionInfo');
    const ctx = canvas.getContext('2d');

    const SIZE = 640;
    canvas.width = SIZE;
    canvas.height = SIZE;

    const PAD = 40;
    const PLOT = SIZE - PAD * 2;

    const DEFAULTS = { N: 60, mode: 'both' }; // mode: 'both' | 'power' | 'root'
    const state = { ...DEFAULTS, hoverN: null, hoverKind: null };

    // ---------- Math → screen ----------

    function toScreen(x, y) {
      return { sx: PAD + x * PLOT, sy: SIZE - PAD - y * PLOT };
    }

    // Sample y = x^p on [0,1] with denser sampling near the bends.
    function samplePower(p, steps) {
      const pts = [];
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = Math.pow(t, 1.6); // non-uniform: concentrate near 0
        const y = Math.pow(x, p);
        pts.push({ x, y });
      }
      return pts;
    }

    // ---------- Colors ----------

    function colorForN(n, total, alpha) {
      const t = total <= 1 ? 0 : (n - 1) / (total - 1);
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

    function drawCurve(pts, color, width) {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      pts.forEach((p, i) => {
        const s = toScreen(p.x, p.y);
        if (i === 0) ctx.moveTo(s.sx, s.sy);
        else ctx.lineTo(s.sx, s.sy);
      });
      ctx.stroke();
    }

    function drawAxes() {
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(PAD, PAD, PLOT, PLOT);

      // diagonal y = x
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.setLineDash([4, 4]);
      const a = toScreen(0, 0), b = toScreen(1, 1);
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.font = '12px sans-serif';
      ctx.fillText('0', PAD - 12, SIZE - PAD + 14);
      ctx.fillText('1', PAD + PLOT - 4, SIZE - PAD + 14);
      ctx.fillText('1', PAD - 16, PAD + 4);
      ctx.fillText('y = x', toScreen(1, 1).sx - 40, toScreen(1, 1).sy - 6);
    }

    function draw() {
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawAxes();

      const total = state.N;
      const steps = 220;

      for (let n = 1; n <= total; n++) {
        const isHover = state.hoverN === n;
        const baseAlpha = isHover ? 1 : 0.55;
        const baseWidth = isHover ? 2.4 : 1;

        if (state.mode === 'both' || state.mode === 'power') {
          const pts = samplePower(n, steps);
          const highlight = isHover && state.hoverKind === 'power';
          drawCurve(pts, colorForN(n, total, highlight ? 1 : baseAlpha * 0.85), highlight ? 2.6 : baseWidth);
        }
        if (state.mode === 'both' || state.mode === 'root') {
          const pts = samplePower(1 / n, steps);
          const highlight = isHover && state.hoverKind === 'root';
          drawCurve(pts, colorForN(n, total, highlight ? 1 : baseAlpha * 0.85), highlight ? 2.6 : baseWidth);
        }
      }
    }

    // ---------- Info ----------

    function renderInfo() {
      if (!infoEl) return;
      if (state.hoverN === null) {
        const modeLabel = state.mode === 'both'
          ? 'y = x<sup>n</sup> and y = x<sup>1/n</sup>'
          : state.mode === 'power' ? 'y = x<sup>n</sup> only' : 'y = x<sup>1/n</sup> only';
        infoEl.innerHTML = `
          <strong>Curves:</strong> ${modeLabel}<br>
          <strong>N:</strong> 1 … ${state.N}<br>
          <span class="info-placeholder">Hover a curve to inspect it.</span>
        `;
      } else {
        const n = state.hoverN;
        const total = state.N;
        const kindLabel = state.hoverKind === 'power'
          ? `y = x<sup>${n}</sup>` : `y = x<sup>1/${n}</sup>`;
        const role = n === 1
          ? '<span style="color:#aaa;">Outer diagonal (y = x)</span>'
          : n >= total - 2
            ? '<span style="color:#ff6360;">Inner edge (hugs axes)</span>'
            : '<span style="color:#4caf50;">Middle layer</span>';
        infoEl.innerHTML = `
          <strong>Curve:</strong> ${kindLabel}<br>
          <strong>n:</strong> ${n} / ${total}<br>
          <strong>Symmetric pair:</strong> reflects across y = x<br>
          <strong>Role:</strong> ${role}
        `;
      }
    }

    // ---------- Hover ----------

    function findClosestCurve(mx, my) {
      if (mx <= 0 || mx >= 1 || my <= 0 || my >= 1) return null;
      const lx = Math.log(mx);
      const ly = Math.log(my);
      let best = null, bestDist = Infinity;

      if (state.mode === 'both' || state.mode === 'power') {
        const nGuess = ly / lx;
        const n = Math.max(1, Math.min(state.N, Math.round(nGuess)));
        const d = Math.abs(Math.pow(mx, n) - my);
        if (d < bestDist) { bestDist = d; best = { n, kind: 'power' }; }
      }
      if (state.mode === 'both' || state.mode === 'root') {
        const nGuess = lx / ly;
        const n = Math.max(1, Math.min(state.N, Math.round(nGuess)));
        const d = Math.abs(Math.pow(mx, 1 / n) - my);
        if (d < bestDist) { bestDist = d; best = { n, kind: 'root' }; }
      }

      // accept if visually close (~25 px in y)
      if (best && bestDist * PLOT < 25) return best;
      return null;
    }

    function handleMove(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const sx = (e.clientX - rect.left) * scaleX;
      const sy = (e.clientY - rect.top) * scaleY;
      const mx = (sx - PAD) / PLOT;
      const my = (SIZE - PAD - sy) / PLOT;

      const hit = findClosestCurve(mx, my);
      const newN = hit ? hit.n : null;
      const newKind = hit ? hit.kind : null;
      if (newN !== state.hoverN || newKind !== state.hoverKind) {
        state.hoverN = newN;
        state.hoverKind = newKind;
        renderInfo();
        draw();
      }
    }

    canvas.addEventListener('pointermove', handleMove);
    canvas.addEventListener('pointerdown', handleMove);
    canvas.addEventListener('pointerleave', () => {
      state.hoverN = null;
      state.hoverKind = null;
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

    function refresh() { renderInfo(); draw(); }

    if (infoEl && infoEl.parentElement) {
      const controls = document.createElement('div');
      controls.style.cssText = 'margin-top:10px;display:flex;flex-wrap:wrap;';
      controls.appendChild(makeButton('N −', () => { state.N = clamp(state.N - 5, 2, 200); refresh(); }));
      controls.appendChild(makeButton('N +', () => { state.N = clamp(state.N + 5, 2, 200); refresh(); }));
      const modeBtn = makeButton('Mode: both', () => {
        state.mode = state.mode === 'both' ? 'power' : state.mode === 'power' ? 'root' : 'both';
        modeBtn.textContent = `Mode: ${state.mode}`;
        refresh();
      });
      controls.appendChild(modeBtn);
      controls.appendChild(makeButton('Reset', () => {
        Object.assign(state, DEFAULTS, { hoverN: null, hoverKind: null });
        modeBtn.textContent = `Mode: ${state.mode}`;
        refresh();
      }));
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
