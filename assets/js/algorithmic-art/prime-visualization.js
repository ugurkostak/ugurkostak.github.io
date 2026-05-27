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

    // Hover info
    let hoveredNum = null;
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - 20;
      const y = e.clientY - rect.top - 20;

      const gridX = Math.floor(x / cellSize) - Math.floor(size / 2);
      const gridY = Math.floor(y / cellSize) - Math.floor(size / 2);

      hoveredNum = null;
      spiral.forEach(point => {
        if (point.x === gridX && point.y === gridY) {
          hoveredNum = point;
        }
      });

      // Show info — keep the panel visible at all times with a placeholder
      const infoEl = document.getElementById('primeInfo');
      if (infoEl && hoveredNum) {
        infoEl.innerHTML = `
          <strong>Number:</strong> ${hoveredNum.num}<br>
          <strong>Type:</strong> ${hoveredNum.isPrime ? '<span style="color: #ff6360;">Prime</span>' : '<span style="color: #999;">Composite</span>'}<br>
          <strong>Position:</strong> (${hoveredNum.x}, ${hoveredNum.y})
        `;
      } else if (infoEl) {
        infoEl.innerHTML = '<span class="info-placeholder">Hover the grid to inspect a number.</span>';
      }
    });

    canvas.addEventListener('mouseleave', () => {
      const infoEl = document.getElementById('primeInfo');
      if (infoEl) {
        infoEl.innerHTML = '<span class="info-placeholder">Hover the grid to inspect a number.</span>';
      }
    });
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
