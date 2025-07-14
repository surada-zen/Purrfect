import React, { useRef, useEffect } from 'react';

// Particle properties
interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
}

interface AnimatedStarryNightProps {
  theme: 'light' | 'dark';
}

const AnimatedStarryNight: React.FC<AnimatedStarryNightProps> = ({ theme }) => {
  const particleColors = theme === 'dark' 
    ? ['#FFF0F5', '#FFE4E1', '#FF69B4', '#FFFFFF']
    : ['#2C2A3A', '#403E54', '#574141', '#302b63'];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasDimensions = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    };

    setCanvasDimensions();
    
    const handlePointerMove = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = event.clientX - rect.left;
        mouseRef.current.y = event.clientY - rect.top;
    };
    
    // Use pointermove to support both mouse and touch
    window.addEventListener('pointermove', handlePointerMove);
    
    const createParticles = () => {
        if (mouseRef.current.x === null || mouseRef.current.y === null) return;
        
        // Create a small burst of particles
        for (let i = 0; i < 2; i++) {
             const size = Math.random() * 4 + 1;
             particlesRef.current.push({
                x: mouseRef.current.x,
                y: mouseRef.current.y,
                size: size,
                speedX: Math.random() * 3 - 1.5,
                speedY: Math.random() * 3 - 1.5,
                color: particleColors[Math.floor(Math.random() * particleColors.length)],
                alpha: 1
            });
        }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Keep the nice gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, theme === 'dark' ? '#0f0c29' : '#f8f9fa');
      gradient.addColorStop(0.5, theme === 'dark' ? '#302b63' : '#e9ecef');
      gradient.addColorStop(1, theme === 'dark' ? '#24243e' : '#dee2e6');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (mouseRef.current.x !== null) {
          createParticles();
      }

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha -= 0.02; // fade out

        if (p.alpha > 0) {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            ctx.restore();
        }
      }
      
      // Remove dead particles
      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0);

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animate();
    
    const resizeObserver = new ResizeObserver(setCanvasDimensions);
    if(canvas.parentElement) {
        resizeObserver.observe(canvas.parentElement);
    }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      window.removeEventListener('pointermove', handlePointerMove);
      if(canvas.parentElement) {
        resizeObserver.unobserve(canvas.parentElement);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" />;
};

export default AnimatedStarryNight;