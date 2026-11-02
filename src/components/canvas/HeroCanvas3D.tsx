import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HeroCanvas3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08070b, 0.015);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // --- Custom GLSL Shaders: Silky Liquid Pearl & Chromatic Glass Core ---
    const vertexShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uMouseSpeed;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldNormal;
      varying vec3 vEyeVector;
      varying float vWave;

      // 3D Simplex Noise
      vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
      
      float snoise(vec3 v){
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
        i = mod(i, 289.0);
        vec4 p = permute( permute( permute(
                   i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
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
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      void main() {
        vNormal = normal;
        vPosition = position;
        
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vEyeVector = normalize(worldPos.xyz - cameraPosition);

        // Gentle, silky harmonic fluid breathing (ultra-clean, not lumpy)
        float wave1 = snoise(position * 1.2 + vec3(uTime * 0.35)) * 0.12;
        float wave2 = snoise(position * 2.4 - vec3(uTime * 0.2)) * 0.06;
        
        // Gentle cursor proximity ripple
        float mouseDist = length(position.xy - uMouse * 2.2);
        float mouseWave = smoothstep(2.5, 0.0, mouseDist) * (0.08 + uMouseSpeed * 0.15);
        
        vWave = wave1 + wave2 + mouseWave;
        vec3 displaced = position + normal * vWave;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldNormal;
      varying vec3 vEyeVector;
      varying float vWave;

      void main() {
        vec3 N = normalize(vWorldNormal);
        vec3 V = normalize(vEyeVector);

        // --- Optical Chromatic Dispersion Refraction ---
        vec3 refrR = refract(V, N, 1.0 / 1.15);
        vec3 refrG = refract(V, N, 1.0 / 1.18);
        vec3 refrB = refract(V, N, 1.0 / 1.22);

        float refrLightR = dot(refrR, vec3(0.5, 0.8, 0.6)) * 0.5 + 0.5;
        float refrLightG = dot(refrG, vec3(-0.6, 0.7, 0.5)) * 0.5 + 0.5;
        float refrLightB = dot(refrB, vec3(0.7, -0.4, 0.8)) * 0.5 + 0.5;

        // Elegant Fresnel Rim Reflection
        float fresnel = dot(-V, N);
        fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
        float fresnelPow = pow(fresnel, 2.2);

        // Glossy Specular Molten Sheen
        vec3 light1 = normalize(vec3(1.5, 2.0, 1.8));
        vec3 half1 = normalize(light1 - V);
        float spec1 = pow(max(dot(N, half1), 0.0), 48.0);

        vec3 light2 = normalize(vec3(-1.8, -1.0, 1.2));
        vec3 half2 = normalize(light2 - V);
        float spec2 = pow(max(dot(N, half2), 0.0), 32.0);

        // Haute-Couture Palette: Champagne Ivory, Iridescent Opal, Lilac Rose
        vec3 colChampagne = vec3(0.98, 0.90, 0.78); // #f8e6c7
        vec3 colLilac     = vec3(0.88, 0.74, 0.98); // #e0bdff
        vec3 colRose      = vec3(0.98, 0.72, 0.80); // #fbc8ce
        vec3 colPearl     = vec3(0.98, 0.98, 1.00); // pure pearl highlight

        // Iridescent Thin-Film Surface Flow
        float t = sin(uTime * 0.4 + vWave * 4.0) * 0.5 + 0.5;
        vec3 fluidBase = mix(colChampagne, colLilac, t);
        fluidBase = mix(fluidBase, colRose, fresnelPow * 0.8);

        // Color dispersion blend
        vec3 finalColor = vec3(
          fluidBase.r * refrLightR,
          fluidBase.g * refrLightG,
          fluidBase.b * refrLightB
        );

        // Add pure pearl specular highlights
        finalColor += colPearl * (spec1 * 0.95 + spec2 * 0.4);
        finalColor += fluidBase * (fresnelPow * 1.1);

        // Deep obsidian ambient base with soft inner glow
        finalColor = mix(vec3(0.08, 0.07, 0.12), finalColor, 0.82 + fresnelPow * 0.35);

        gl_FragColor = vec4(finalColor, 0.96);
      }
    `;

    // 1. Central Hero Sculpture: Smooth Liquid Pearl Sphere
    const sphereGeo = new THREE.SphereGeometry(1.65, 128, 128);
    const sphereUniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseSpeed: { value: 0.0 },
    };

    const sphereMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: sphereUniforms,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);

    // 2. Sculptural Minimalist Halo Orbit Rings (Aerodynamic & Luxurious)
    const ringGroup = new THREE.Group();

    // Ring 1: Champagne Gold Ribbon
    const ringGeo1 = new THREE.TorusGeometry(2.35, 0.014, 32, 180);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xf3d2a2,
      metalness: 0.95,
      roughness: 0.15,
      transparent: true,
      opacity: 0.75,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ringGroup.add(ring1);

    // Ring 2: Lavender Platinum Ring
    const ringGeo2 = new THREE.TorusGeometry(2.7, 0.009, 32, 180);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xd8b4fe,
      metalness: 0.92,
      roughness: 0.18,
      transparent: true,
      opacity: 0.6,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    ringGroup.add(ring2);

    scene.add(ringGroup);

    // 3. Delicate Architectural Outer Polyhedron (Ultra-Fine Champagne Wireframe)
    const cageGeo = new THREE.IcosahedronGeometry(2.1, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0xf3d2a2,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    scene.add(cageMesh);

    // 4. Subtle Inner Radiant Luminescence
    const coreLight = new THREE.PointLight(0xf3d2a2, 1.5, 6.0);
    scene.add(coreLight);

    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.9);
    scene.add(ambientLight);

    // 5. Starlight Dust Particle Field
    const particleCount = 1200;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cChampagne = new THREE.Color(0xf3d2a2);
    const cLilac = new THREE.Color(0xd8b4fe);
    const cWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const r = 2.4 + Math.random() * 7.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[idx] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[idx + 2] = r * Math.cos(phi);

      const mix = Math.random();
      const col = mix > 0.6 ? cChampagne : mix > 0.3 ? cLilac : cWhite;
      particleColors[idx] = col.r;
      particleColors[idx + 1] = col.g;
      particleColors[idx + 2] = col.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.35, 'rgba(243,210,162,0.8)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // --- Interactive Mouse & Drag Momentum ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let mouseSpeed = 0;
    let prevMouseTime = performance.now();
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

      const now = performance.now();
      const dt = Math.max(now - prevMouseTime, 16);
      const dist = Math.hypot(nx - mouse.targetX, ny - mouse.targetY);
      mouseSpeed = Math.min((dist / dt) * 45.0, 1.0);
      prevMouseTime = now;

      mouse.targetX = nx;
      mouse.targetY = ny;

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        dragVelocityX = deltaX * 0.005;
        dragVelocityY = deltaY * 0.005;
        sphereMesh.rotation.y += dragVelocityX;
        sphereMesh.rotation.x += dragVelocityY;
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

    // --- Smooth 60-120 FPS Animation Loop ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Lerp mouse
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      mouseSpeed *= 0.94;

      sphereUniforms.uTime.value = elapsedTime;
      sphereUniforms.uMouse.value.set(mouse.x, mouse.y);
      sphereUniforms.uMouseSpeed.value = mouseSpeed;

      // Gentle, luxurious core rotation
      if (!isDragging) {
        sphereMesh.rotation.y += 0.004 + dragVelocityX * 0.8;
        sphereMesh.rotation.x += 0.002 + dragVelocityY * 0.8;
        dragVelocityX *= 0.94;
        dragVelocityY *= 0.94;
      }

      // Gyroscopic halo rotations
      ring1.rotation.z += 0.006;
      ring1.rotation.y += 0.004;
      ring2.rotation.z -= 0.005;
      ring2.rotation.x += 0.003;

      // Outer delicate cage counter-rotation
      cageMesh.rotation.y = -sphereMesh.rotation.y * 0.6;
      cageMesh.rotation.z += 0.002;

      // Parallax camera lerp
      camera.position.x += (mouse.x * 1.1 - camera.position.x) * 0.035;
      camera.position.y += (mouse.y * 0.85 - camera.position.y) * 0.035;
      camera.lookAt(0, 0, 0);

      // Celestial dust rotation
      particles.rotation.y = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', handleResize);

      sphereGeo.dispose();
      sphereMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      cageGeo.dispose();
      cageMat.dispose();
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
