import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HeroCanvas3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08070b, 0.018);

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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // --- GLSL Shaders: Molten Liquid Chrome with Chromatic Refraction ---
    const vertexShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uMouseSpeed;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldNormal;
      varying vec3 vEyeVector;
      varying float vDisplacement;

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

        // Fluid wave deformation over time
        float wave1 = snoise(position * 1.1 + vec3(uTime * 0.35));
        float wave2 = 0.5 * snoise(position * 2.3 - vec3(uTime * 0.25));
        
        // Mouse velocity ripple
        float mouseDist = length(position.xy - uMouse * 2.2);
        float mouseRipple = smoothstep(2.8, 0.0, mouseDist) * (0.35 + uMouseSpeed * 0.8);
        
        vDisplacement = wave1 + wave2 + mouseRipple;
        vec3 displaced = position + normal * (vDisplacement * 0.34);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldNormal;
      varying vec3 vEyeVector;
      varying float vDisplacement;

      void main() {
        vec3 N = normalize(vWorldNormal);
        vec3 V = normalize(vEyeVector);

        // --- Optical Refraction with Chromatic Dispersion ---
        // Separate Indices of Refraction (IOR) for Red, Green, Blue
        vec3 refrR = refract(V, N, 1.0 / 1.14);
        vec3 refrG = refract(V, N, 1.0 / 1.18);
        vec3 refrB = refract(V, N, 1.0 / 1.23);

        // Simulated High-Fashion Environment Light Fields
        float refrLightR = dot(refrR, vec3(0.5, 0.8, 0.6)) * 0.5 + 0.5;
        float refrLightG = dot(refrG, vec3(-0.6, 0.7, 0.5)) * 0.5 + 0.5;
        float refrLightB = dot(refrB, vec3(0.7, -0.4, 0.8)) * 0.5 + 0.5;

        // Metallic Fresnel Reflection
        float fresnel = dot(-V, N);
        fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
        float fresnelPow = pow(fresnel, 2.5);

        // Specular Molten Highlight
        vec3 lightDir = normalize(vec3(1.2, 1.5, 1.0));
        vec3 halfVec = normalize(lightDir - V);
        float spec = pow(max(dot(N, halfVec), 0.0), 32.0);

        // Liquid Avant-Garde Palette: Champagne Gold, Iridescent Lilac, Molten Platinum
        vec3 colChampagne = vec3(0.97, 0.88, 0.73); // #f7dfbe
        vec3 colLilac     = vec3(0.85, 0.71, 0.98); // #d8b4fe
        vec3 colRose      = vec3(0.98, 0.68, 0.76); // #fbcfe8
        vec3 colPlatinum  = vec3(0.92, 0.94, 0.98); // liquid mercury

        // Dynamic Iridescent Thin-Film Gradient
        float t = sin(uTime * 0.5 + vDisplacement * 2.2) * 0.5 + 0.5;
        vec3 baseFluid = mix(colChampagne, colLilac, t);
        baseFluid = mix(baseFluid, colRose, fresnelPow * 0.75);

        // Combine Refraction Chromatic Split + Molten Platinum Specular
        vec3 finalColor = vec3(
          baseFluid.r * refrLightR,
          baseFluid.g * refrLightG,
          baseFluid.b * refrLightB
        );

        // Add molten metal sheen + specular gloss
        finalColor += colPlatinum * spec * 0.85;
        finalColor += baseFluid * (fresnelPow * 1.3);

        // Deep rich ambient shadow in creases
        finalColor = mix(vec3(0.04, 0.03, 0.06), finalColor, 0.78 + fresnelPow * 0.4);

        gl_FragColor = vec4(finalColor, 0.94);
      }
    `;

    // Sculptural Organic Torus Knot (Haute-Couture Liquid Ribbon)
    const sculptureGeo = new THREE.TorusKnotGeometry(1.55, 0.48, 160, 32, 2, 3);
    const sculptureUniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseSpeed: { value: 0.0 },
    };

    const sculptureMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: sculptureUniforms,
      wireframe: false,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const sculptureMesh = new THREE.Mesh(sculptureGeo, sculptureMat);
    scene.add(sculptureMesh);

    // Subtle Ambient Light
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.8);
    scene.add(ambientLight);

    // Minimal Floating Liquid Droplets Orbiting
    const dropletGroup = new THREE.Group();
    const dropletMat = new THREE.MeshStandardMaterial({
      color: 0xf3d2a2,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.7,
    });

    const droplets: THREE.Mesh[] = [];
    for (let i = 0; i < 7; i++) {
      const radius = 0.08 + Math.random() * 0.12;
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 24), dropletMat);
      const angle = (i / 7) * Math.PI * 2;
      const dist = 2.4 + Math.random() * 0.8;
      mesh.position.set(Math.cos(angle) * dist, (Math.random() - 0.5) * 1.5, Math.sin(angle) * dist);
      dropletGroup.add(mesh);
      droplets.push(mesh);
    }
    scene.add(dropletGroup);

    // Starlight Dust Field (Subtle luxury ambient particles)
    const particleCount = 1400;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cChampagne = new THREE.Color(0xf3d2a2);
    const cLilac = new THREE.Color(0xd8b4fe);
    const cWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const r = 2.4 + Math.random() * 8.0;
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

    // Glow sprite
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.35, 'rgba(243,210,162,0.7)');
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

    // --- Interactive Mouse & Drag Physics ---
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

      // Compute cursor velocity
      const now = performance.now();
      const dt = Math.max(now - prevMouseTime, 16);
      const dist = Math.hypot(nx - mouse.targetX, ny - mouse.targetY);
      mouseSpeed = Math.min((dist / dt) * 50.0, 1.0);
      prevMouseTime = now;

      mouse.targetX = nx;
      mouse.targetY = ny;

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        dragVelocityX = deltaX * 0.005;
        dragVelocityY = deltaY * 0.005;
        sculptureMesh.rotation.y += dragVelocityX;
        sculptureMesh.rotation.x += dragVelocityY;
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

    // --- Animation Loop ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Lerp mouse
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Decay mouse speed
      mouseSpeed *= 0.95;

      sculptureUniforms.uTime.value = elapsedTime;
      sculptureUniforms.uMouse.value.set(mouse.x, mouse.y);
      sculptureUniforms.uMouseSpeed.value = mouseSpeed;

      // Autonomic sculpture rotation + drag momentum
      if (!isDragging) {
        sculptureMesh.rotation.y += 0.005 + dragVelocityX * 0.8;
        sculptureMesh.rotation.x += 0.003 + dragVelocityY * 0.8;
        dragVelocityX *= 0.94;
        dragVelocityY *= 0.94;
      }

      // Droplets orbit
      dropletGroup.rotation.y = elapsedTime * 0.15;
      dropletGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;

      // Parallax camera lerp
      camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.035;
      camera.position.y += (mouse.y * 0.9 - camera.position.y) * 0.035;
      camera.lookAt(0, 0, 0);

      // Star particles rotation
      particles.rotation.y = elapsedTime * 0.02;

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

      sculptureGeo.dispose();
      sculptureMat.dispose();
      dropletMat.dispose();
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
