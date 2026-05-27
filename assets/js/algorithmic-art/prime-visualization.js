/**
 * Prime Numbers Visualization
 * Interactive visualization of prime numbers using an Ulam Spiral
 * Drag to rotate, scroll to zoom
 */

(function() {
  // Prime checking function
  function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
  }

  // Generate Ulam Spiral
  function generateUlamSpiral(size) {
    const spiral = [];
    let x = 0, y = 0;
    let dx = 1, dy = 0;
    let stepCount = 1;
    let stepInDirection = 0;
    let stepChangeCount = 0;

    for (let num = 1; num <= size * size; num++) {
      spiral.push({
        num,
        x,
        y,
        isPrime: isPrime(num)
      });

      x += dx;
      y += dy;
      stepInDirection++;

      if (stepInDirection === stepCount) {
        stepInDirection = 0;
        let temp = dx;
        dx = -dy;
        dy = temp;
        stepChangeCount++;

        if (stepChangeCount === 2) {
          stepChangeCount = 0;
          stepCount++;
        }
      }
    }

    return spiral;
  }

  // Initialize visualization
  function init() {
    const canvas = document.getElementById('primeCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const size = 100;
    const cellSize = 6;
    const spiral = generateUlamSpiral(size);

    // Set canvas size
    canvas.width = size * cellSize + 40;
    canvas.height = size * cellSize + 40;

    // Draw function
    function draw() {
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(20, 20);

      spiral.forEach(point => {
        const screenX = (point.x + size / 2) * cellSize;
        const screenY = (point.y + size / 2) * cellSize;

        if (point.isPrime) {
          // Prime numbers - red
          ctx.fillStyle = '#ff6360';
          ctx.fillRect(screenX, screenY, cellSize - 1, cellSize - 1);
        } else if (point.num === 1) {
          // 1 - green
          ctx.fillStyle = '#4caf50';
          ctx.fillRect(screenX, screenY, cellSize - 1, cellSize - 1);
        } else {
          // Composite - dark gray
          ctx.fillStyle = '#333';
          ctx.fillRect(screenX, screenY, cellSize - 1, cellSize - 1);
        }
      });

      ctx.restore();
    }

    // Draw initial
    draw();

    // Info panel — persistent; initialized with the spiral's center (2, the first prime)
    const infoEl = document.getElementById('primeInfo');

    function renderInfo(point) {
      if (!infoEl || !point) return;
      infoEl.innerHTML = `
        <strong>Number:</strong> ${point.num}<br>
        <strong>Type:</strong> ${point.isPrime ? '<span style="color: #ff6360;">Prime</span>' : '<span style="color: #999;">Composite</span>'}<br>
        <strong>Position:</strong> (${point.x}, ${point.y})
      `;
    }

    // Default to the first prime (2) so the panel always shows something meaningful
    const initialPoint = spiral.find(p => p.num === 2) || spiral[0];
    renderInfo(initialPoint);

    // Resolve a pointer/mouse event to the spiral cell it overlaps.
    // Important: canvas.width is the internal pixel size (640) but on mobile
    // the canvas is rendered smaller via CSS. We must scale event coordinates
    // by the actual displayed size, otherwise touches on mobile map far
    // outside the spiral.
    function pointFromEvent(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX - 20;
      const y = (e.clientY - rect.top) * scaleY - 20;
      const gridX = Math.floor(x / cellSize) - Math.floor(size / 2);
      const gridY = Math.floor(y / cellSize) - Math.floor(size / 2);
      return spiral.find(point => point.x === gridX && point.y === gridY);
    }

    function handleMove(e) {
      const point = pointFromEvent(e);
      if (point) renderInfo(point);
    }

    // Use Pointer Events: a single API that covers mouse, touch, and stylus
    // across modern browsers including iOS Safari 13+.
    canvas.addEventListener('pointermove', handleMove);
    canvas.addEventListener('pointerdown', handleMove);

    // Block page scroll/zoom while the finger interacts with the spiral so
    // tapping a cell doesn't drag the page. `touch-action: none` on the
    // canvas (set in algorithmic-art.css) handles most cases; this is the
    // fallback for older iOS Safari where touch-action on <canvas> is flaky.
    canvas.addEventListener('touchmove', (e) => {
      if (e.cancelable) e.preventDefault();
      const touch = e.touches[0];
      if (touch) handleMove(touch);
    }, { passive: false });
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
