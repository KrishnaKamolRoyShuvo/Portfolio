import * as THREE from 'three';

export function initThreeBackground() {
  const canvas = document.getElementById('webgl-bg');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 400;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particles
  const particleCount = 280;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 800;
    positions[i + 1] = (Math.random() - 0.5) * 600;
    positions[i + 2] = (Math.random() - 0.5) * 500;

    velocities.push({
      x: (Math.random() - 0.5) * 0.4,
      y: (Math.random() - 0.5) * 0.4,
      z: (Math.random() - 0.5) * 0.2
    });
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Texture dot
  const canvasTexture = document.createElement('canvas');
  canvasTexture.width = 16;
  canvasTexture.height = 16;
  const ctx = canvasTexture.getContext('2d');
  const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.3, 'rgba(99,102,241,0.8)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 16, 16);

  const texture = new THREE.CanvasTexture(canvasTexture);

  const material = new THREE.PointsMaterial({
    size: 4,
    map: texture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    color: 0x06b6d4
  });

  const particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  // Line connections
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x6366f1,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending
  });

  const maxConnections = 1200;
  const linePositions = new Float32Array(maxConnections * 6);
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const lineSystem = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lineSystem);

  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.15;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.15;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Check light mode
  function updateThemeColors() {
    const isLight = document.documentElement.classList.contains('light');
    if (isLight) {
      material.color.setHex(0x0284c7);
      lineMaterial.color.setHex(0x6366f1);
      lineMaterial.opacity = 0.12;
      renderer.setClearColor(0x000000, 0);
    } else {
      material.color.setHex(0x06b6d4);
      lineMaterial.color.setHex(0x6366f1);
      lineMaterial.opacity = 0.18;
    }
  }

  // Animation Loop
  let frameId;
  function animate() {
    frameId = requestAnimationFrame(animate);

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    particleSystem.rotation.y = targetX * 0.001 + performance.now() * 0.00008;
    particleSystem.rotation.x = -targetY * 0.001;

    lineSystem.rotation.y = particleSystem.rotation.y;
    lineSystem.rotation.x = particleSystem.rotation.x;

    // Update positions
    const pos = geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      pos[i3] += velocities[i].x;
      pos[i3 + 1] += velocities[i].y;
      pos[i3 + 2] += velocities[i].z;

      if (pos[i3] < -400 || pos[i3] > 400) velocities[i].x *= -1;
      if (pos[i3 + 1] < -300 || pos[i3 + 1] > 300) velocities[i].y *= -1;
      if (pos[i3 + 2] < -250 || pos[i3 + 2] > 250) velocities[i].z *= -1;
    }
    geometry.attributes.position.needsUpdate = true;

    // Connect nearby lines
    let lineIdx = 0;
    const connectDistance = 80;
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < connectDistance && lineIdx < maxConnections * 6) {
          linePositions[lineIdx++] = pos[i * 3];
          linePositions[lineIdx++] = pos[i * 3 + 1];
          linePositions[lineIdx++] = pos[i * 3 + 2];
          linePositions[lineIdx++] = pos[j * 3];
          linePositions[lineIdx++] = pos[j * 3 + 1];
          linePositions[lineIdx++] = pos[j * 3 + 2];
        }
      }
    }
    lineGeometry.setDrawRange(0, lineIdx / 3);
    lineGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();

  return { updateThemeColors };
}
