'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import gsap from 'gsap';

// --- 1. The Design System (Custom CSS) ---
// تم دمج الألوان المطلوبة لإنشاء نظام بصري متماسك
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;400;700&family=Noto+Kufi+Arabic:wght@200;400;700&display=swap');

  :root {
    --c-silver: #B3B7C1;
    --c-ocean: #438FB3;
    --c-teal: #58A8B4;
    --c-dark: #0a0b0c;
    --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
  }

  body {
    background-color: var(--c-dark);
    color: var(--c-silver);
    font-family: 'Outfit', 'Noto Kufi Arabic', sans-serif;
    margin: 0;
    overflow: hidden; /* Lock scroll during intro */
  }

  /* Intro Overlay Container */
  .intro-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
    z-index: 9999;
    display: flex; justify-content: center; align-items: center;
    pointer-events: none;
  }

  /* The Split Curtains */
  .curtain {
    position: absolute; top: 0; height: 100%; width: 50%;
    background: #050505;
    z-index: 2;
    will-change: transform;
  }
  .curtain-left { left: 0; border-right: 1px solid rgba(179, 183, 193, 0.1); }
  .curtain-right { right: 0; border-left: 1px solid rgba(179, 183, 193, 0.1); }

  /* The Counter/Loader */
  .loader-content {
    position: relative; z-index: 10;
    display: flex; flex-direction: column; align-items: center;
    mix-blend-mode: difference;
  }
  
  .counter {
    font-size: clamp(4rem, 10vw, 8rem);
    font-weight: 200;
    color: var(--c-teal);
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  .loading-bar {
    width: 200px; height: 2px; background: rgba(179, 183, 193, 0.2);
    margin-top: 20px; position: relative; overflow: hidden;
  }
  .loading-progress {
    position: absolute; top: 0; left: 0; height: 100%; width: 0%;
    background: var(--c-ocean);
  }

  /* Hero Typography */
  .hero-title {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    z-index: 1;
    pointer-events: none;
  }
  
  .hero-title h1 {
    font-size: clamp(3rem, 8vw, 6rem);
    background: linear-gradient(to bottom, var(--c-silver), var(--c-ocean));
    -webkit-background-clip: text;
    color: transparent;
    opacity: 0; /* Hidden initially */
    transform: translateY(50px);
  }

  /* Canvas Wrapper */
  .webgl-wrapper {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    z-index: 0;
    opacity: 0; /* Fades in */
  }
`;

// --- 2. The 3D Particle System (Gemini Core) ---
const ParticleShader = {
  vertex: `
    uniform float uTime;
    attribute float aScale;
    attribute vec3 aRandomness;
    varying vec3 vColor;
    
    void main() {
      // حركة موجية معقدة للجزيئات
      vec3 pos = position;
      pos.x += sin(uTime * 0.5 + position.y) * 0.5;
      pos.y += cos(uTime * 0.3 + position.x) * 0.5;
      pos += aRandomness * sin(uTime * 0.5);

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // الحجم يتغير بناءً على العمق
      gl_PointSize = (8.0 * aScale) * (1.0 / -mvPosition.z);
    }
  `,
  fragment: `
    void main() {
      // خلق دائرة ناعمة متوهجة
      float r = distance(gl_PointCoord, vec2(0.5));
      if (r > 0.5) discard;
      float glow = 1.0 - (r * 2.0);
      glow = pow(glow, 2.0);

      // المزج بين ألوان البراند
      vec3 colorA = vec3(0.345, 0.659, 0.706); // #58A8B4 (Teal)
      vec3 colorB = vec3(0.263, 0.561, 0.702); // #438FB3 (Ocean)
      vec3 finalColor = mix(colorA, colorB, gl_PointCoord.y);

      gl_FragColor = vec4(finalColor, glow * 0.8);
    }
  `
};

const Experience3D = () => {
  const mount = useRef(null);

  useEffect(() => {
    if (!mount.current) return;
    
    // Scene Setup
    const w = window.innerWidth, h = window.innerHeight;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0b0c, 0.02); // ضباب لإخفاء الحدود
    
    const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 100);
    camera.position.z = 15;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.current.appendChild(renderer.domElement);

    // Particles Data
    const count = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const randomness = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for(let i=0; i<count; i++) {
      const i3 = i * 3;
      // توزيع دائري (Galaxy Shape)
      const radius = Math.random() * 10;
      const spinAngle = radius * 5;
      const branchAngle = (i % 3) * 2 * Math.PI / 3;
      
      positions[i3] = Math.cos(branchAngle + spinAngle) * radius;
      positions[i3+1] = (Math.random() - 0.5) * 2; // Spread Y
      positions[i3+2] = Math.sin(branchAngle + spinAngle) * radius;

      randomness[i3] = (Math.random() - 0.5);
      randomness[i3+1] = (Math.random() - 0.5);
      randomness[i3+2] = (Math.random() - 0.5);
      
      scales[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: ParticleShader.vertex,
      fragmentShader: ParticleShader.fragment,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animation Loop
    const clock = new THREE.Clock();
    let frameId;
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsedTime;
      
      // دوران الكاميرا ببطء حول المشهد
      camera.position.x = Math.sin(elapsedTime * 0.1) * 15;
      camera.position.z = Math.cos(elapsedTime * 0.1) * 15;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      mount.current?.removeChild(renderer.domElement);
      geometry.dispose();
    };
  }, []);

  return <div ref={mount} className="webgl-wrapper" />;
};

// --- 3. The Intro Component (The Logic) ---
const IntroSequence = ({ onComplete }) => {
  const counterRef = useRef(null);
  const barRef = useRef(null);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: onComplete
      });

      // 1. Counter Animation (0 to 100)
      const counterObj = { val: 0 };
      tl.to(counterObj, {
        val: 100,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counterRef.current) counterRef.current.innerText = Math.floor(counterObj.val);
        }
      });
      
      // 2. Progress Bar
      tl.to(".loading-progress", { width: "100%", duration: 2.5, ease: "power2.inOut" }, 0);

      // 3. Exit Loader Elements
      tl.to([counterRef.current, ".loading-bar"], { 
        y: -50, opacity: 0, duration: 0.8, ease: "back.in(1.7)" 
      });

      // 4. The Curtain Reveal (The Big Moment)
      tl.to(".curtain-left", { x: "-100%", duration: 1.5, ease: "power4.inOut" }, "-=0.4");
      tl.to(".curtain-right", { x: "100%", duration: 1.5, ease: "power4.inOut" }, "<"); // Start same time

      // 5. WebGL Fade In (Reveal the magic)
      tl.to(".webgl-wrapper", { opacity: 1, duration: 1 }, "-=1.2");
      
      // 6. Hero Text Reveal
      tl.to(".hero-title h1", { 
        opacity: 1, y: 0, duration: 1.2, ease: "power3.out" 
      }, "-=0.5");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="intro-overlay">
      <div className="curtain curtain-left"></div>
      <div className="curtain curtain-right"></div>
      
      <div className="loader-content">
        <div ref={counterRef} className="counter">0</div>
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      </div>
    </div>
  );
};

// --- 4. Main Page Structure ---
export default function Masterpiece() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Unlock scroll after intro
    if (!loading) document.body.style.overflow = 'auto';
  }, [loading]);

  return (
    <main>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      {/* 1. The Intro Layer */}
      <IntroSequence onComplete={() => setLoading(false)} />

      {/* 2. The 3D World (Always rendered behind) */}
      <Experience3D />

      {/* 3. The Hero Content */}
      <section style={{ height: '100vh', position: 'relative' }}>
        <div className="hero-title">
          <h1>GEMINI <br /> ARCHITECTURE</h1>
          <p style={{ marginTop: '2rem', color: '#B3B7C1', letterSpacing: '2px' }}>
            A NEW ERA OF DIGITAL REALITY
          </p>
        </div>
      </section>
      
      {/* 4. Content Below (To show scroll unlocking) */}
      {!loading && (
        <section style={{ height: '100vh', background: '#0a0b0c', padding: '10vw' }}>
          <h2 style={{ color: '#58A8B4', fontSize: '3rem' }}>The Concept</h2>
          <p style={{ maxWidth: '600px', fontSize: '1.2rem', marginTop: '2rem' }}>
            لقد تم بناء هذا الموقع ليعكس فلسفة التناغم بين البيانات والفن.
          </p>
        </section>
      )}
    </main>
  );
}
