
// Manhattan Distance Visualization — interactive 2D demo
// Draws two draggable points, axis-aligned L1 path, and L1 neighborhood.

document.addEventListener('DOMContentLoaded', () => {
	const canvas = document.getElementById('manhattanCanvas');
	const infoEl = document.getElementById('manhattanInfo');
	const resetBtn = document.getElementById('resetManhattan');
	if (!canvas) return;
	const dpr = window.devicePixelRatio || 1;
	let W = 480, H = 480;
	function resize() {
		W = canvas.clientWidth || 480;
		H = canvas.clientHeight || 480;
		canvas.width = W * dpr;
		canvas.height = H * dpr;
	}
	resize();
	window.addEventListener('resize', resize);

	// Initial points
	const defaultA = () => ({ x: W * 0.3, y: H * 0.5 });
	const defaultB = () => ({ x: W * 0.7, y: H * 0.3 });
	let ptA = defaultA();
	let ptB = defaultB();
	let dragging = null;
	let snapToGrid = false;
	let animProgress = 1; // 0..1
	let animating = false;
	let lastAnimTime = 0;

	function l1(a, b) {
		return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
	}

	function draw() {
		const ctx = canvas.getContext('2d');
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		ctx.scale(dpr, dpr);

		// Draw grid
		drawGrid(ctx);

		// Draw L1 neighborhood (diamond) around ptA
		const dist = l1(ptA, ptB);
		ctx.save();
		ctx.globalAlpha = 0.13;
		ctx.beginPath();
		ctx.moveTo(ptA.x, ptA.y - dist);
		ctx.lineTo(ptA.x + dist, ptA.y);
		ctx.lineTo(ptA.x, ptA.y + dist);
		ctx.lineTo(ptA.x - dist, ptA.y);
		ctx.closePath();
		ctx.fillStyle = '#43a047';
		ctx.fill();
		ctx.restore();

		// Draw Δx and Δy lines
		ctx.save();
		ctx.strokeStyle = '#888';
		ctx.setLineDash([6, 6]);
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(ptA.x, ptA.y);
		ctx.lineTo(ptB.x, ptA.y);
		ctx.moveTo(ptB.x, ptA.y);
		ctx.lineTo(ptB.x, ptB.y);
		ctx.stroke();
		ctx.setLineDash([]);
		ctx.restore();

				// Animate axis-aligned L1 path as a single animated line
				ctx.save();
				ctx.strokeStyle = '#ffb300';
				ctx.lineWidth = 5;
				ctx.lineJoin = 'round';
				ctx.beginPath();
				ctx.moveTo(ptA.x, ptA.y);
				let px = ptA.x, py = ptA.y;
				const dx = ptB.x - ptA.x, dy = ptB.y - ptA.y;
				const absDx = Math.abs(dx), absDy = Math.abs(dy);
				const total = absDx + absDy;
				let prog = animProgress;
				let len = total * prog;
				let signX = Math.sign(dx), signY = Math.sign(dy);
				if (len <= absDx) {
					px = ptA.x + signX * len;
					py = ptA.y;
					ctx.lineTo(px, py);
				} else {
					px = ptA.x + dx;
					py = ptA.y + signY * (len - absDx);
					ctx.lineTo(ptA.x + dx, ptA.y);
					ctx.lineTo(px, py);
				}
				ctx.stroke();
				ctx.restore();

		// Draw points
		drawPoint(ctx, ptA, '#1976d2');
		drawPoint(ctx, ptB, '#e53935');

		// Draw Δx, Δy labels
		ctx.save();
		ctx.font = 'bold 14px system-ui, sans-serif';
		ctx.fillStyle = '#888';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'bottom';
		ctx.fillText(`Δx = ${Math.abs(dx).toFixed(1)}`, (ptA.x + ptB.x) / 2, ptA.y - 8);
		ctx.textBaseline = 'top';
		ctx.fillText(`Δy = ${Math.abs(dy).toFixed(1)}`, ptB.x + 36 * Math.sign(dx || 1), (ptA.y + ptB.y) / 2);
		ctx.restore();

		// Draw distance label
		ctx.save();
		ctx.font = 'bold 16px system-ui, sans-serif';
		ctx.fillStyle = '#222';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		const mx = (ptA.x + ptB.x) / 2;
		const my = (ptA.y + ptB.y) / 2;
		ctx.fillText(`L1 distance: ${dist.toFixed(1)}`, mx, my + 12);
		ctx.restore();
	}

	function drawGrid(ctx) {
				ctx.save();
				// Draw city grid: thicker main avenues, glowing intersections
				for (let x = 0; x < W; x += 40) {
					ctx.beginPath();
					ctx.strokeStyle = (x % 160 === 0) ? '#1976d2' : '#222a3a';
					ctx.globalAlpha = (x % 160 === 0) ? 0.25 : 0.13;
					ctx.lineWidth = (x % 160 === 0) ? 3 : 1.2;
					ctx.moveTo(x, 0);
					ctx.lineTo(x, H);
					ctx.shadowColor = (x % 160 === 0) ? '#1976d2' : 'transparent';
					ctx.shadowBlur = (x % 160 === 0) ? 8 : 0;
					ctx.stroke();
					ctx.shadowBlur = 0;
				}
				for (let y = 0; y < H; y += 40) {
					ctx.beginPath();
					ctx.strokeStyle = (y % 160 === 0) ? '#ffd600' : '#222a3a';
					ctx.globalAlpha = (y % 160 === 0) ? 0.22 : 0.13;
					ctx.lineWidth = (y % 160 === 0) ? 3 : 1.2;
					ctx.moveTo(0, y);
					ctx.lineTo(W, y);
					ctx.shadowColor = (y % 160 === 0) ? '#ffd600' : 'transparent';
					ctx.shadowBlur = (y % 160 === 0) ? 8 : 0;
					ctx.stroke();
					ctx.shadowBlur = 0;
				}
				// Draw glowing intersections
				for (let x = 0; x < W; x += 40) {
					for (let y = 0; y < H; y += 40) {
						ctx.save();
						ctx.globalAlpha = 0.18;
						ctx.beginPath();
						ctx.arc(x, y, (x % 160 === 0 && y % 160 === 0) ? 10 : 4, 0, 2 * Math.PI);
						ctx.fillStyle = (x % 160 === 0 && y % 160 === 0) ? '#ffd600' : '#fff';
						ctx.shadowColor = (x % 160 === 0 && y % 160 === 0) ? '#ffd600' : '#fff';
						ctx.shadowBlur = (x % 160 === 0 && y % 160 === 0) ? 16 : 4;
						ctx.fill();
						ctx.restore();
					}
				}
				ctx.globalAlpha = 1.0;
				ctx.restore();
	}

	function drawPoint(ctx, pt, color) {
		ctx.save();
		ctx.beginPath();
		ctx.arc(pt.x, pt.y, 14, 0, 2 * Math.PI);
		ctx.shadowColor = color;
		ctx.shadowBlur = 16;
		ctx.fillStyle = color;
		ctx.globalAlpha = 0.95;
		ctx.fill();
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#fff';
		ctx.globalAlpha = 1.0;
		ctx.stroke();
		ctx.restore();
	}

	function pick(pt, x, y) {
		return Math.hypot(pt.x - x, pt.y - y) < 18;
	}

	canvas.addEventListener('pointerdown', (e) => {
		const rect = canvas.getBoundingClientRect();
		const x = (e.clientX - rect.left) * (W / rect.width);
		const y = (e.clientY - rect.top) * (H / rect.height);
		if (pick(ptA, x, y)) dragging = 'A';
		else if (pick(ptB, x, y)) dragging = 'B';
	});
	canvas.addEventListener('pointermove', (e) => {
		if (!dragging) return;
		const rect = canvas.getBoundingClientRect();
		let x = (e.clientX - rect.left) * (W / rect.width);
		let y = (e.clientY - rect.top) * (H / rect.height);
		if (snapToGrid) {
			x = Math.round(x / 40) * 40;
			y = Math.round(y / 40) * 40;
		}
		if (dragging === 'A') { ptA.x = x; ptA.y = y; }
		else if (dragging === 'B') { ptB.x = x; ptB.y = y; }
		animProgress = 0;
		animating = true;
		draw();
		updateInfo();
		requestAnimationFrame(animatePath);
	});
	window.addEventListener('pointerup', () => { dragging = null; });

	if (resetBtn) {
		resetBtn.onclick = () => {
			ptA = defaultA();
			ptB = defaultB();
			animProgress = 0;
			animating = true;
			draw();
			updateInfo();
			requestAnimationFrame(animatePath);
		};
	}

	// Snap to grid with G key
	window.addEventListener('keydown', (e) => {
		if (e.key.toLowerCase() === 'g') {
			snapToGrid = !snapToGrid;
			updateInfo();
		}
	});

	function updateInfo() {
		if (!infoEl) return;
		const dist = l1(ptA, ptB);
		const dx = ptB.x - ptA.x, dy = ptB.y - ptA.y;
		infoEl.innerHTML = `<strong>L1 (Manhattan) distance:</strong> ${dist.toFixed(2)}<br>` +
			`<span style="color:#1976d2">A</span> (${ptA.x.toFixed(1)}, ${ptA.y.toFixed(1)}) &mdash; ` +
			`<span style="color:#e53935">B</span> (${ptB.x.toFixed(1)}, ${ptB.y.toFixed(1)})<br>` +
			`Δx = <b>${Math.abs(dx).toFixed(1)}</b>, Δy = <b>${Math.abs(dy).toFixed(1)}</b><br>` +
			`L1 = |Δx| + |Δy| = <b>${Math.abs(dx).toFixed(1)} + ${Math.abs(dy).toFixed(1)} = ${dist.toFixed(1)}</b><br>` +
			`<span style="font-size:12px; color:#888;">${snapToGrid ? 'Grid snapping ON (press G to toggle)' : 'Grid snapping OFF (press G to toggle)'}</span>`;
	}

	// Animate the path
	function animatePath(ts) {
		if (!animating) return;
		if (!lastAnimTime) lastAnimTime = ts;
		const dt = Math.min(1, (ts - lastAnimTime) / 600);
		animProgress += dt * 0.07;
		if (animProgress >= 1) {
			animProgress = 1;
			animating = false;
			lastAnimTime = 0;
		} else {
			lastAnimTime = ts;
		}
		draw();
		if (animating) requestAnimationFrame(animatePath);
	}

	// Initial draw
	draw();
	updateInfo();
	animProgress = 0;
	animating = true;
	requestAnimationFrame(animatePath);

	// Redraw on resize
	window.addEventListener('resize', () => { resize(); draw(); updateInfo(); });
});
