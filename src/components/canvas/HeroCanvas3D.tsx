import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HeroCanvas3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x04060d, 0.025);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- Custom GLSL Shaders for Morphing Quantum Core ---
    const vertexShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vDisplacement;

      // Classic Perlin 3D Noise
      vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
      
      float snoise(vec3 v){
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
        i = mod(i, 289.0 );
        vec4 p = permute( permute( permute(
                   i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        float n_ = 0.142857142857;
        vec3  ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
      }

      void main() {
        vNormal = normal;
        vPosition = position;
        
        // Multi-frequency vertex displacement
        float noise = snoise(position * 1.5 + vec3(uTime * 0.45));
        noise += 0.5 * snoise(position * 3.0 - vec3(uTime * 0.3));
        
        // Influence by mouse distance
        float mouseDist = length(position.xy - uMouse * 2.0);
        float mouseInfluence = smoothstep(2.5, 0.0, mouseDist) * 0.4;
        
        vDisplacement = noise + mouseInfluence;
        vec3 newPosition = position + normal * (vDisplacement * 0.38);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vDisplacement;

      void main() {
        // Fresnel glow computation
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = dot(viewDir, vNormal);
        fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
        fresnel = pow(fresnel, 2.5);

        // Holographic Iridescent Colors: Cyan (#00f0ff) -> Purple (#a855f7) -> Pink (#f43f5e)
        vec3 colCyan = vec3(0.0, 0.94, 1.0);
        vec3 colPurple = vec3(0.66, 0.33, 0.97);
        vec3 colPink = vec3(0.96, 0.25, 0.37);

        float t = sin(uTime * 0.8 + vDisplacement * 2.5) * 0.5 + 0.5;
        vec3 baseColor = mix(colCyan, colPurple, t);
        baseColor = mix(baseColor, colPink, fresnel * 0.8);

        vec3 finalColor = baseColor * (0.45 + fresnel * 1.2 + vDisplacement * 0.25);
        gl_FragColor = vec4(finalColor, 0.88);
      }
    `;

    // Core Geometry & Shader Material
    const coreGeometry = new THREE.IcosahedronGeometry(1.6, 64);
    const coreUniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    };

    const coreMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: coreUniforms,
      wireframe: false,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Outer Geometric Wireframe Cage
    const cageGeometry = new THREE.IcosahedronGeometry(2.1, 2);
    const cageMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const cageMesh = new THREE.Mesh(cageGeometry, cageMaterial);
    scene.add(cageMesh);

    // Inner Luminous Core
    const innerLightGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const innerLightMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.45,
    });
    const innerLight = new THREE.Mesh(innerLightGeo, innerLightMat);
    scene.add(innerLight);

    // Gyroscopic Orbital Rings
    const ringGroup = new THREE.Group();
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.35,
      wireframe: true,
    });
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.28,
      wireframe: true,
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.015, 16, 100), ringMat1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.015, 16, 100), ringMat2);
    ring2.rotation.x = Math.PI / 3;
    ringGroup.add(ring1);
    ringGroup.add(ring2);
    scene.add(ringGroup);

    // --- 3D Particle Starfield with Repulsion Physics ---
    const particleCount = 2200;
    const particlePositions = new Float32Array(particleCount * 3);
    const initialPositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0x00f0ff);
    const c2 = new THREE.Color(0xa855f7);
    const c3 = new THREE.Color(0x38bdf8);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      // Spherical shell + galaxy distribution
      const r = 2.8 + Math.random() * 9.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      particlePositions[idx] = x;
      particlePositions[idx + 1] = y;
      particlePositions[idx + 2] = z;

      initialPositions[idx] = x;
      initialPositions[idx + 1] = y;
      initialPositions[idx + 2] = z;

      particleVelocities[idx] = 0;
      particleVelocities[idx + 1] = 0;
      particleVelocities[idx + 2] = 0;

      // Color variation
      const mixRatio = Math.random();
      const col = mixRatio > 0.6 ? c1 : mixRatio > 0.3 ? c2 : c3;
      particleColors[idx] = col.r;
      particleColors[idx + 1] = col.g;
      particleColors[idx + 2] = col.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Particle sprite texture generated programmatically
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(0,240,255,0.7)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // --- Interactive Mouse & Motion Physics ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const rect = container.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);

      mouse.targetX = nx;
      mouse.targetY = ny;

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        dragVelocityX = deltaX * 0.005;
        dragVelocityY = deltaY * 0.005;
        coreMesh.rotation.y += dragVelocityX;
        coreMesh.rotation.x += dragVelocityY;
        prevMouseX = clientX;
        prevMouseY = clientY;
      }
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // --- Window Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    // --- Animation Loop ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Lerp mouse
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Update shader uniforms
      coreUniforms.uTime.value = elapsedTime;
      coreUniforms.uMouse.value.set(mouse.x, mouse.y);

      // Core rotations
      if (!isDragging) {
        coreMesh.rotation.y += 0.006 + dragVelocityX * 0.8;
        coreMesh.rotation.x += 0.003 + dragVelocityY * 0.8;
        dragVelocityX *= 0.94;
        dragVelocityY *= 0.94;
      }

      cageMesh.rotation.y = -coreMesh.rotation.y * 0.8;
      cageMesh.rotation.z += 0.004;

      // Rings gyroscopic rotation
      ring1.rotation.z += 0.01;
      ring1.rotation.y += 0.005;
      ring2.rotation.z -= 0.008;
      ring2.rotation.x += 0.007;

      // Camera parallax lerping
      camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.04;
      camera.position.y += (mouse.y * 1.2 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Particle physics update
      const positions = particleGeometry.attributes.position.array as Float32Array;
      const mouseWorldX = mouse.x * 4.5;
      const mouseWorldY = mouse.y * 3.5;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const ix = initialPositions[idx];
        const iy = initialPositions[idx + 1];
        const iz = initialPositions[idx + 2];

        // Orbit rotation around center
        const cosAngle = Math.cos(0.001);
        const sinAngle = Math.sin(0.001);
        const curX = positions[idx];
        const curZ = positions[idx + 2];
        positions[idx] = curX * cosAngle - curZ * sinAngle;
        positions[idx + 2] = curX * sinAngle + curZ * cosAngle;

        // Mouse repulsion
        const dx = positions[idx] - mouseWorldX;
        const dy = positions[idx + 1] - mouseWorldY;
        const distSq = dx * dx + dy * dy;

        if (distSq < 3.5) {
          const force = (3.5 - distSq) * 0.02;
          particleVelocities[idx] += dx * force;
          particleVelocities[idx + 1] += dy * force;
        }

        // Apply velocity & spring back to orbit
        positions[idx] += particleVelocities[idx];
        positions[idx + 1] += particleVelocities[idx + 1];
        positions[idx + 2] += particleVelocities[idx + 2];

        particleVelocities[idx] *= 0.92;
        particleVelocities[idx + 1] *= 0.92;
        particleVelocities[idx + 2] *= 0.92;

        // Subtle spring to origin
        positions[idx] += (ix - positions[idx]) * 0.01;
        positions[idx + 1] += (iy - positions[idx + 1]) * 0.01;
        positions[idx + 2] += (iz - positions[idx + 2]) * 0.01;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', handleResize);

      coreGeometry.dispose();
      coreMaterial.dispose();
      cageGeometry.dispose();
      cageMaterial.dispose();
      innerLightGeo.dispose();
      innerLightMat.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
      renderer.dispose();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-auto cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none' }}
    />
  );
};
