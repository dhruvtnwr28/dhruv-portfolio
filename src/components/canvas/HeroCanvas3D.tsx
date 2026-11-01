import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HeroCanvas3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09080d, 0.02);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- Aesthetic Liquid Pearl / Iridescent Silk Shaders ---
    const vertexShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vDisplacement;

      // Classic 3D Perlin Noise
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
        
        // Silky fluid wave displacement
        float noise = snoise(position * 1.2 + vec3(uTime * 0.35));
        noise += 0.4 * snoise(position * 2.2 - vec3(uTime * 0.25));
        
        // Gentle cursor attraction ripple
        float mouseDist = length(position.xy - uMouse * 2.0);
        float mouseWave = smoothstep(2.5, 0.0, mouseDist) * 0.35;
        
        vDisplacement = noise + mouseWave;
        vec3 newPosition = position + normal * (vDisplacement * 0.32);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vDisplacement;

      void main() {
        // High-end editorial fresnel
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = dot(viewDir, vNormal);
        fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
        fresnel = pow(fresnel, 2.2);

        // Elegant Champagne, Lavender & Sunset Rose Palette
        vec3 colChampagne = vec3(0.98, 0.88, 0.74); // #fadcbd
        vec3 colLavender = vec3(0.85, 0.67, 0.98);  // #d8a7ff
        vec3 colRoseGold = vec3(0.96, 0.66, 0.72);  // #f5a8b8
        vec3 colDeepObsidian = vec3(0.08, 0.07, 0.12);

        float t = sin(uTime * 0.6 + vDisplacement * 2.0) * 0.5 + 0.5;
        vec3 baseColor = mix(colChampagne, colLavender, t);
        baseColor = mix(baseColor, colRoseGold, fresnel * 0.85);

        // Subsurface blend
        vec3 finalColor = mix(colDeepObsidian, baseColor, 0.75 + fresnel * 0.9 + vDisplacement * 0.2);
        gl_FragColor = vec4(finalColor, 0.92);
      }
    `;

    // Sculptural Liquid Mesh
    const coreGeometry = new THREE.IcosahedronGeometry(1.65, 64);
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

    // Warm Ambient Core Lighting
    const ambientLight = new THREE.AmbientLight(0xfdf4dc, 0.6);
    scene.add(ambientLight);

    // Sculptural Minimalist Orbit Rings
    const ringGroup = new THREE.Group();
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf3d2a2,
      transparent: true,
      opacity: 0.22,
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.008, 16, 120), ringMat);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.006, 16, 120), ringMat);
    ring2.rotation.x = Math.PI / 2.8;
    ringGroup.add(ring1);
    ringGroup.add(ring2);
    scene.add(ringGroup);

    // --- Starlight Dust Field ---
    const particleCount = 1800;
    const particlePositions = new Float32Array(particleCount * 3);
    const initialPositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0xf3d2a2); // Champagne
    const c2 = new THREE.Color(0xd8a7ff); // Soft Lavender
    const c3 = new THREE.Color(0xffffff); // Star White

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const r = 2.6 + Math.random() * 8.5;
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

      const mix = Math.random();
      const col = mix > 0.6 ? c1 : mix > 0.3 ? c2 : c3;
      particleColors[idx] = col.r;
      particleColors[idx + 1] = col.g;
      particleColors[idx + 2] = col.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Warm radial sprite
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(243,210,162,0.8)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // --- Mouse & Pointer Physics ---
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
        dragVelocityX = deltaX * 0.004;
        dragVelocityY = deltaY * 0.004;
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

      // Lerp mouse target
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      coreUniforms.uTime.value = elapsedTime;
      coreUniforms.uMouse.value.set(mouse.x, mouse.y);

      if (!isDragging) {
        coreMesh.rotation.y += 0.004 + dragVelocityX * 0.8;
        coreMesh.rotation.x += 0.002 + dragVelocityY * 0.8;
        dragVelocityX *= 0.94;
        dragVelocityY *= 0.94;
      }

      ring1.rotation.z += 0.006;
      ring2.rotation.z -= 0.005;

      camera.position.x += (mouse.x * 1.1 - camera.position.x) * 0.035;
      camera.position.y += (mouse.y * 0.9 - camera.position.y) * 0.035;
      camera.lookAt(0, 0, 0);

      // Particle physics
      const positions = particleGeometry.attributes.position.array as Float32Array;
      const mouseWorldX = mouse.x * 4.0;
      const mouseWorldY = mouse.y * 3.0;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const ix = initialPositions[idx];
        const iy = initialPositions[idx + 1];
        const iz = initialPositions[idx + 2];

        // Gentle cosmic rotation
        const cosAngle = Math.cos(0.0008);
        const sinAngle = Math.sin(0.0008);
        const curX = positions[idx];
        const curZ = positions[idx + 2];
        positions[idx] = curX * cosAngle - curZ * sinAngle;
        positions[idx + 2] = curX * sinAngle + curZ * cosAngle;

        // Subtle cursor repulsion
        const dx = positions[idx] - mouseWorldX;
        const dy = positions[idx + 1] - mouseWorldY;
        const distSq = dx * dx + dy * dy;

        if (distSq < 3.0) {
          const force = (3.0 - distSq) * 0.015;
          particleVelocities[idx] += dx * force;
          particleVelocities[idx + 1] += dy * force;
        }

        positions[idx] += particleVelocities[idx];
        positions[idx + 1] += particleVelocities[idx + 1];
        positions[idx + 2] += particleVelocities[idx + 2];

        particleVelocities[idx] *= 0.92;
        particleVelocities[idx + 1] *= 0.92;
        particleVelocities[idx + 2] *= 0.92;

        positions[idx] += (ix - positions[idx]) * 0.008;
        positions[idx + 1] += (iy - positions[idx + 1]) * 0.008;
        positions[idx + 2] += (iz - positions[idx + 2]) * 0.008;
      }
      particleGeometry.attributes.position.needsUpdate = true;

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

      coreGeometry.dispose();
      coreMaterial.dispose();
      ringMat.dispose();
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
