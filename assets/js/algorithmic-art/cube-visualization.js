import * as THREE from './vendor/three.module.min.js';

function initCube() {
  const canvas = document.getElementById('cubeCanvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
  renderer.setClearColor(0x111111);
  renderer.setPixelRatio(window.devicePixelRatio || 1);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / (canvas.clientHeight || 1), 0.1, 1000);
  camera.position.z = 4.5;

  const geometry = new THREE.BoxGeometry(1.6, 1.6, 1.6);
  const material = new THREE.MeshNormalMaterial();
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // Resize helper
  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight || width;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  // Initial resize
  resize();

  // Pointer interactions for drag-to-rotate
  let isDragging = false;
  let prev = { x: 0, y: 0 };

  function onPointerDown(e) {
    isDragging = true;
    prev = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }

  function onPointerUp() {
    isDragging = false;
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    cube.rotation.y += dx * 0.01;
    cube.rotation.x += dy * 0.01;
    prev = { x: e.clientX, y: e.clientY };
    if (e.cancelable) e.preventDefault();
  }

  canvas.addEventListener('pointerdown', onPointerDown, { passive: false });
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointermove', onPointerMove, { passive: false });

  // Capture the pointer so moves keep targeting the canvas even if the finger
  // strays outside it during a drag.
  canvas.addEventListener('pointerdown', (e) => {
    try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
  });

  // Belt-and-suspenders: on iOS Safari, `touch-action: none` may still let the
  // page scroll if a touchmove escapes pointer handling. Block it explicitly
  // while a drag is active.
  canvas.addEventListener('touchmove', (e) => {
    if (isDragging && e.cancelable) e.preventDefault();
  }, { passive: false });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();

  // Resize on window
  window.addEventListener('resize', resize);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCube);
} else {
  initCube();
}
