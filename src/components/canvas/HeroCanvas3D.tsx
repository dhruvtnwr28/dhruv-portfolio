import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HeroCanvas3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.015);

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
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // --- Master Group for the Tesseract ---
    const tesseractGroup = new THREE.Group();
    // Default cinematic isometric tilt
    tesseractGroup.rotation.x = 0.35;
    tesseractGroup.rotation.y = 0.65;
    scene.add(tesseractGroup);

    // =========================================================================
    // 1. INNER VOLUMETRIC PLASMA NEBULA CORE (The Cosmic Beating Space Stone)
    // =========================================================================
    const innerVertexShader = `
      uniform float uTime;
      uniform float uHeartbeat;
      varying vec3 vPosition;
      varying vec3 vNormal;

      void main() {
        vPosition = position;
        vNormal = normal;

        // Subtle breathing expansion with the heartbeat
        vec3 displaced = position * (1.0 + uHeartbeat * 0.08);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
      }
    `;

    const innerFragmentShader = `
      uniform float uTime;
      uniform float uHeartbeat;
      varying vec3 vPosition;
      varying vec3 vNormal;

      // 3D Simplex Noise for volumetric cosmic plasma
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
        // Multi-layered animated cosmic plasma energy
        float n1 = snoise(vPosition * 2.2 + vec3(0.0, uTime * 0.45, 0.0));
        float n2 = snoise(vPosition * 4.0 - vec3(uTime * 0.3, 0.0, uTime * 0.2));
        float plasma = (n1 * 0.65 + n2 * 0.35) * 0.5 + 0.5;

        // Radial energy falloff from center (pure white glowing core)
        float distFromCenter = length(vPosition) / 1.1;
        float coreIntensity = clamp(1.0 - distFromCenter, 0.0, 1.0);
        coreIntensity = pow(coreIntensity, 1.3);

        // Heartbeat energy surge
        float beatGlow = uHeartbeat * 0.7;

        // Authentic Avengers Tesseract Palette:
        vec3 colCoreWhite = vec3(1.0, 1.0, 1.0);      // Pure blinding white center
        vec3 colElectric  = vec3(0.0, 0.94, 1.0);     // #00f0ff electric cyan
        vec3 colDeepBlue  = vec3(0.05, 0.35, 0.95);    // #0d59f2 cosmic sapphire
        vec3 colVoidBlue  = vec3(0.01, 0.08, 0.35);    // Deep outer perimeter

        // Layer color blend
        vec3 color = mix(colDeepBlue, colElectric, plasma);
        color = mix(color, colCoreWhite, coreIntensity * 0.85 + beatGlow * 0.4);

        // Alpha transparency so energy feels volumetric and cloud-like inside the glass
        float alpha = clamp(0.35 + coreIntensity * 0.5 + plasma * 0.25 + beatGlow * 0.25, 0.0, 0.95);

        gl_FragColor = vec4(color, alpha);
      }
    `;

    const innerCoreUniforms = {
      uTime: { value: 0 },
      uHeartbeat: { value: 0 },
    };

    const innerCoreMat = new THREE.ShaderMaterial({
      vertexShader: innerVertexShader,
      fragmentShader: innerFragmentShader,
      uniforms: innerCoreUniforms,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const innerCoreGeo = new THREE.BoxGeometry(2.0, 2.0, 2.0, 32, 32, 32);
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    tesseractGroup.add(innerCoreMesh);

    // Secondary Inner Orb (Concentrated singularity light)
    const innerOrbGeo = new THREE.SphereGeometry(0.75, 32, 32);
    const innerOrbMat = new THREE.MeshBasicMaterial({
      color: 0x99f6ff,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const innerOrbMesh = new THREE.Mesh(innerOrbGeo, innerOrbMat);
    tesseractGroup.add(innerOrbMesh);

    // =========================================================================
    // 2. OUTER PRISTINE CRYSTALLINE GLASS CUBE
    // =========================================================================
    const outerVertexShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldNormal;
      varying vec3 vEyeVector;

      void main() {
        vNormal = normal;
        vPosition = position;
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vEyeVector = normalize(worldPos.xyz - cameraPosition);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const outerFragmentShader = `
      uniform float uTime;
      uniform float uHeartbeat;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldNormal;
      varying vec3 vEyeVector;

      void main() {
        vec3 N = normalize(vWorldNormal);
        vec3 V = normalize(vEyeVector);

        // Glass Fresnel reflection
        float fresnel = dot(-V, N);
        fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
        float fresnelPow = pow(fresnel, 2.4);

        // Crisp specular crystal highlights
        vec3 light1 = normalize(vec3(1.5, 2.0, 1.8));
        vec3 half1 = normalize(light1 - V);
        float spec1 = pow(max(dot(N, half1), 0.0), 64.0);

        vec3 light2 = normalize(vec3(-1.8, -1.2, 1.0));
        vec3 half2 = normalize(light2 - V);
        float spec2 = pow(max(dot(N, half2), 0.0), 32.0);

        // Glass Colors
        vec3 colCyan = vec3(0.0, 0.94, 1.0);
        vec3 colIce  = vec3(0.85, 0.95, 1.0);
        vec3 colDeep = vec3(0.02, 0.12, 0.35);

        // Base crystal surface tint
        vec3 surfaceColor = mix(colDeep, colCyan, fresnelPow * 0.9);
        surfaceColor += colIce * (spec1 * 0.95 + spec2 * 0.35);
        surfaceColor += colCyan * (uHeartbeat * 0.4);

        // Edge glow
        float edgeAlpha = 0.22 + fresnelPow * 0.65 + uHeartbeat * 0.15;

        gl_FragColor = vec4(surfaceColor, clamp(edgeAlpha, 0.0, 0.92));
      }
    `;

    const outerUniforms = {
      uTime: { value: 0 },
      uHeartbeat: { value: 0 },
    };

    const outerGlassMat = new THREE.ShaderMaterial({
      vertexShader: outerVertexShader,
      fragmentShader: outerFragmentShader,
      uniforms: outerUniforms,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const outerBoxGeo = new THREE.BoxGeometry(2.35, 2.35, 2.35);
    const outerGlassMesh = new THREE.Mesh(outerBoxGeo, outerGlassMat);
    tesseractGroup.add(outerGlassMesh);

    // =========================================================================
    // 3. RAZOR-SHARP LUMINESCENT CUBIC EDGES
    // =========================================================================
    const edgesGeo = new THREE.EdgesGeometry(outerBoxGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      linewidth: 2,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const edgesLine = new THREE.LineSegments(edgesGeo, edgesMat);
    tesseractGroup.add(edgesLine);

    // =========================================================================
    // 4. BEATING DYNAMIC POINT LIGHT (Radiates light onto scene)
    // =========================================================================
    const tesseractPointLight = new THREE.PointLight(0x00f0ff, 4.0, 10.0);
    tesseractPointLight.position.set(0, 0, 0);
    tesseractGroup.add(tesseractPointLight);

    const ambientLight = new THREE.AmbientLight(0x0284c7, 0.5);
    scene.add(ambientLight);

    // =========================================================================
    // 5. COSMIC ENERGY EMBER DUST PARTICLES
    // =========================================================================
    const particleCount = 1000;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cCyan = new THREE.Color(0x00f0ff);
    const cSky = new THREE.Color(0x38bdf8);
    const cWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const r = 2.4 + Math.random() * 6.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[idx] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[idx + 2] = r * Math.cos(phi);

      const mix = Math.random();
      const col = mix > 0.6 ? cCyan : mix > 0.3 ? cSky : cWhite;
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
      grad.addColorStop(0.35, 'rgba(0,240,255,0.85)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // =========================================================================
    // 6. INTERACTIVE MOUSE CLICK & DRAG ROTATION
    // =========================================================================
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
        dragVelocityX = deltaX * 0.007;
        dragVelocityY = deltaY * 0.007;

        tesseractGroup.rotation.y += dragVelocityX;
        tesseractGroup.rotation.x += dragVelocityY;

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

    // =========================================================================
    // 7. ANIMATION LOOP: LIVING HEARTBEAT & STEADY ROTATION
    // =========================================================================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // --- Heartbeat Pulse Function (Lub-Dub rhythmic cycle) ---
      // Pulse fires at ~72 BPM
      const beatPeriod = 1.6;
      const cycleTime = elapsedTime % beatPeriod;
      // First quick pulse (lub)
      const lub = Math.exp(-Math.pow((cycleTime - 0.25) * 9.0, 2.0));
      // Second trailing echo pulse (dub)
      const dub = Math.exp(-Math.pow((cycleTime - 0.55) * 9.0, 2.0)) * 0.6;
      const heartbeat = lub + dub;

      // Update shader uniforms
      innerCoreUniforms.uTime.value = elapsedTime;
      innerCoreUniforms.uHeartbeat.value = heartbeat;
      outerUniforms.uTime.value = elapsedTime;
      outerUniforms.uHeartbeat.value = heartbeat;

      // Dynamic light pulse in sync with heartbeat
      tesseractPointLight.intensity = 3.2 + heartbeat * 4.5;
      edgesMat.opacity = 0.65 + heartbeat * 0.35;
      innerOrbMesh.scale.setScalar(1.0 + heartbeat * 0.18);

      // Lerp mouse target for camera parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Automatic gentle rotation + drag momentum inertia
      if (!isDragging) {
        tesseractGroup.rotation.y += 0.005 + dragVelocityX * 0.8;
        tesseractGroup.rotation.x += 0.002 + dragVelocityY * 0.8;
        dragVelocityX *= 0.94;
        dragVelocityY *= 0.94;
      }

      // Parallax camera lerp
      camera.position.x += (mouse.x * 0.9 - camera.position.x) * 0.035;
      camera.position.y += (mouse.y * 0.7 - camera.position.y) * 0.035;
      camera.lookAt(0, 0, 0);

      // Cosmic dust rotation
      particles.rotation.y = elapsedTime * 0.018;

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

      innerCoreGeo.dispose();
      innerCoreMat.dispose();
      innerOrbGeo.dispose();
      innerOrbMat.dispose();
      outerBoxGeo.dispose();
      outerGlassMat.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
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
