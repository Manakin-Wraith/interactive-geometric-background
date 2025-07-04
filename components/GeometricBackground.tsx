import React, { useRef, useEffect } from 'react';
import type { Particle, FabricConfig } from '../types';

export const FABRIC_PRESETS: FabricConfig[] = [
  {
    id: 'geometric',
    name: 'Geometric',
    particleCount: 1000,
    connectDistance: 100,
    springStiffness: 0.01,
    damping: 0.95,
    repelStrength: 10,
    particleColor: '#14b8a6', // teal-500
    lineColor: (opacity) => `rgba(20, 184, 166, ${opacity})`,
    particleSize: { min: 1, max: 2.5 },
    drawLines: true,
    particleArrangement: 'grid',
  },
  {
    id: 'cosmic-dust',
    name: 'Cosmic Dust',
    particleCount: 2000,
    connectDistance: 0,
    springStiffness: 0.005,
    damping: 0.97,
    repelStrength: 5,
    particleColor: ['#ffffff', '#fde047', '#a5f3fc'], // white, yellow-300, cyan-200
    lineColor: () => '',
    particleSize: { min: 0.5, max: 1.5 },
    drawLines: false,
    particleArrangement: 'random',
  },
  {
    id: 'liquid-metal',
    name: 'Liquid Metal',
    particleCount: 500,
    connectDistance: 120,
    springStiffness: 0.02,
    damping: 0.92,
    repelStrength: 15,
    particleColor: '#e5e7eb', // gray-200
    lineColor: (opacity) => `rgba(229, 231, 235, ${opacity * 0.5})`,
    particleSize: { min: 2, max: 4 },
    drawLines: true,
    particleArrangement: 'grid',
  },
  {
    id: 'neural-net',
    name: 'Neural Net',
    particleCount: 800,
    connectDistance: 150,
    springStiffness: 0.015,
    damping: 0.95,
    repelStrength: 12,
    particleColor: '#4f46e5', // indigo-600
    lineColor: (opacity) => `rgba(165, 180, 252, ${opacity * 0.7})`, // indigo-300
    particleSize: { min: 1.5, max: 2.5 },
    drawLines: true,
    particleArrangement: 'grid',
  },
  {
    id: 'stardust',
    name: 'Stardust',
    particleCount: 1500,
    connectDistance: 0,
    springStiffness: 0.002,
    damping: 0.98,
    repelStrength: 8,
    particleColor: ['#facc15', '#e879f9', '#67e8f9'], // amber-400, fuchsia-400, cyan-300
    lineColor: () => '',
    particleSize: { min: 1, max: 3 },
    drawLines: false,
    particleArrangement: 'random',
  },
  {
    id: 'floating-particles',
    name: 'Floating Particles',
    particleCount: 100,
    connectDistance: 0,
    springStiffness: 0, // No spring force
    damping: 0.99,
    repelStrength: 2,
    particleColor: ['rgba(255, 255, 255, 0.5)', 'rgba(220, 230, 255, 0.5)'],
    lineColor: () => '',
    particleSize: { min: 15, max: 45 },
    drawLines: false,
    particleArrangement: 'random',
  },
];

interface GeometricBackgroundProps {
  fabric: FabricConfig;
  pointerSize: number;
}

const GeometricBackground: React.FC<GeometricBackgroundProps> = ({ fabric, pointerSize }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const animationFrameId = useRef<number | null>(null);
  const idleTimeoutId = useRef<number | null>(null);

  const pointerSizeRef = useRef(pointerSize);
  useEffect(() => {
    pointerSizeRef.current = pointerSize;
  }, [pointerSize]);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    const idleTimeout = 2000;

    const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;
    
    const resetFloatingParticle = (p: Particle) => {
        p.life = getRandom(200, 500); // Lifespan in frames
        p.maxLife = p.life;
        p.x = Math.random() * canvas.width;
        p.y = canvas.height + p.size; // Start just below the screen
        p.vx = (Math.random() - 0.5) * 0.5;
        p.vy = -getRandom(0.5, 1.5); // Initial upward velocity
        p.angle = Math.random() * Math.PI * 2;
        p.angleSpeed = (Math.random() - 0.5) * 0.01;
    };

    const createParticles = () => {
        particles = [];
        const { particleCount, particleSize, particleColor, particleArrangement } = fabric;
        
        const cols = Math.floor(Math.sqrt(particleCount * (canvas.width / canvas.height)));
        const rows = Math.floor(particleCount / cols);
        const gapX = canvas.width / cols;
        const gapY = canvas.height / rows;

        for (let i = 0; i < particleCount; i++) {
            let x, y;

            if (particleArrangement === 'grid') {
                const col = i % cols;
                const row = Math.floor(i / cols);
                x = col * gapX + (Math.random() - 0.5) * gapX;
                y = row * gapY + (Math.random() - 0.5) * gapY;
            } else {
                x = Math.random() * canvas.width;
                y = Math.random() * canvas.height;
            }

            const color = Array.isArray(particleColor)
              ? particleColor[Math.floor(Math.random() * particleColor.length)]
              : particleColor;
            
            const particle: Particle = {
                x,
                y,
                originX: x,
                originY: y,
                color: color,
                size: getRandom(particleSize.min, particleSize.max),
                vx: 0,
                vy: 0,
            };

            if (fabric.id === 'floating-particles') {
                resetFloatingParticle(particle);
                particle.y = Math.random() * canvas.height; // Start at a random height
            }

            particles.push(particle);
        }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    const resetMousePosition = () => {
      mouse.current.x = -1000;
      mouse.current.y = -1000;
    };
    
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;

      if (idleTimeoutId.current) {
        clearTimeout(idleTimeoutId.current);
      }

      idleTimeoutId.current = window.setTimeout(resetMousePosition, idleTimeout);
    };

    const handleMouseLeave = () => {
      if (idleTimeoutId.current) {
        clearTimeout(idleTimeoutId.current);
      }
      resetMousePosition();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { repelStrength, springStiffness, damping, connectDistance, drawLines, lineColor } = fabric;
      
      const currentPointerSize = pointerSizeRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Repel from mouse (common to all)
        const dxMouse = p.x - mouse.current.x;
        const dyMouse = p.y - mouse.current.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < currentPointerSize) {
            const angle = Math.atan2(dyMouse, dxMouse);
            const force = (currentPointerSize - distMouse) / currentPointerSize;
            p.vx += Math.cos(angle) * force * repelStrength;
            p.vy += Math.sin(angle) * force * repelStrength;
        }

        if (fabric.id === 'floating-particles') {
            // --- FLOATING PARTICLE LOGIC ---
            if (!p.life || p.life <= 0) {
                resetFloatingParticle(p);
            } else {
                p.life--;
            }

            p.vy -= 0.02; // Constant upward drift
            p.vx += Math.sin(p.angle!) * 0.04; // Turbulence/swirl
            p.angle! += p.angleSpeed!;
            
            p.vx *= damping;
            p.vy *= damping;
            p.x += p.vx;
            p.y += p.vy;

            // Draw particle with fade and blur
            const halfLife = p.maxLife! / 2;
            const opacity = p.life! > halfLife 
                ? (p.maxLife! - p.life!) / halfLife // Fade in
                : p.life! / halfLife; // Fade out

            const baseColor = p.color.substring(0, p.color.lastIndexOf(','));
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            gradient.addColorStop(0, `${baseColor}, ${opacity * 0.2})`);
            gradient.addColorStop(1, `${baseColor}, 0)`);
            ctx.fillStyle = gradient;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // --- OTHER FABRIC LOGIC ---
            const dxOrigin = p.originX - p.x;
            const dyOrigin = p.originY - p.y;
            p.vx += dxOrigin * springStiffness;
            p.vy += dyOrigin * springStiffness;

            p.vx *= damping;
            p.vy *= damping;
            p.x += p.vx;
            p.y += p.vy;

            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            if (drawLines) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectDistance) {
                        ctx.strokeStyle = lineColor(1 - distance / connectDistance);
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
        }
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    resizeCanvas();
    animate();

    return () => {
      if(animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (idleTimeoutId.current) {
        clearTimeout(idleTimeoutId.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [fabric]); // Rerun effect when fabric changes

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0 bg-gray-900" />;
};

export default GeometricBackground;