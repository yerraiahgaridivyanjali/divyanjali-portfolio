"use client";

import { useEffect, useRef, useState } from "react";

interface Bubble {
  id: number;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hueOffset: number;
}

export default function BubbleSkills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const animationRef = useRef<number | null>(null);
  
  const skills = ["C", "MATLAB", "Python", "Embedded C", "VHDL", "Verilog"];

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || 450;

    const initialBubbles: Bubble[] = skills.map((skill, index) => {
      const radius = Math.max(skill.length * 8 + 35, 55); // size proportional to skill length, min 55px
      
      const segment = width / skills.length;
      const x = segment * index + segment / 2 + (Math.random() - 0.5) * 30;
      // Start bubbles strictly inside the container near the bottom
      const y = height - radius - 20 - (index * 20);
      
      return {
        id: index,
        text: skill,
        x,
        y,
        vx: (Math.random() - 0.5) * 0.3, 
        vy: -(Math.random() * 0.2 + 0.3), 
        radius,
        hueOffset: Math.random() * 360,
      };
    });

    setBubbles(initialBubbles);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (bubbles.length === 0 || !containerRef.current) return;

    const canvasUpdate = () => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || 450;

      setBubbles((prevBubbles) => {
        return prevBubbles.map((bubble) => {
          let { x, y, vx, vy, radius } = bubble;

          // 1. Physics update
          // Add a tiny sinusoidal bobbing wave
          const wave = Math.sin(Date.now() * 0.002 + bubble.id) * 0.05;
          vx += wave * 0.2;

          // Natural buoyancy (float up) but slow down near top (made very slow and calm)
          const buoyancy = -0.002;
          if (y > 80) {
            vy += buoyancy;
          } else {
            // Decelerate near top to keep them bobbing on screen
            vy *= 0.98;
            vy += (50 - y) * 0.0002; // very gentle force to keep them below the top padding
          }

          // Apply terminal velocity cap (reduced significantly for a peaceful, slow speed)
          const speed = Math.sqrt(vx * vx + vy * vy);
          const maxSpeed = 0.6;
          if (speed > maxSpeed) {
            vx = (vx / speed) * maxSpeed;
            vy = (vy / speed) * maxSpeed;
          }

          // Apply movement
          x += vx;
          y += vy;

          // 2. Boundary Collisions (bounce off container edges)
          // Left Wall
          if (x - radius < 0) {
            x = radius;
            vx = Math.abs(vx) * 0.8;
          }
          // Right Wall
          if (x + radius > width) {
            x = width - radius;
            vx = -Math.abs(vx) * 0.8;
          }
          // Top Wall
          if (y - radius < 0) {
            y = radius;
            vy = Math.abs(vy) * 0.8;
          }
          // Bottom Wall
          if (y + radius > height) {
            y = height - radius;
            vy = -Math.abs(vy) * 0.8;
          }

          // 3. Bubble-to-Bubble collision (elastic collision)
          // To keep implementation stable, we perform a simplified bounce
          prevBubbles.forEach((other) => {
            if (other.id === bubble.id) return;
            const dx = other.x - x;
            const dy = other.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = radius + other.radius;

            if (dist < minDist) {
              // Collision detected! Resolve overlap
              const overlap = minDist - dist;
              const angle = Math.atan2(dy, dx);
              
              // Push away
              x -= Math.cos(angle) * overlap * 0.5;
              y -= Math.sin(angle) * overlap * 0.5;

              // Exchange velocities slightly
              const tempVx = vx;
              const tempVy = vy;
              vx -= Math.cos(angle) * 0.15;
              vy -= Math.sin(angle) * 0.15;
            }
          });

          return {
            ...bubble,
            x,
            y,
            vx,
            vy,
          };
        });
      });

      animationRef.current = requestAnimationFrame(canvasUpdate);
    };

    animationRef.current = requestAnimationFrame(canvasUpdate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [bubbles.length]);

  const handleBubbleClick = (id: number) => {
    // Make bubble react when clicked (gentle velocity burst for a peaceful reaction)
    setBubbles((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -0.5 - Math.random() * 0.5, // gentle pop up
          };
        }
        return b;
      })
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] md:h-[450px] overflow-hidden rounded-2xl bg-slate-950/20 pointer-events-auto"
    >
      {/* Floating Bubbles */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          onClick={() => handleBubbleClick(bubble.id)}
          className="soap-bubble absolute text-sm md:text-base font-semibold text-white cursor-pointer select-none"
          style={{
            width: `${bubble.radius * 2}px`,
            height: `${bubble.radius * 2}px`,
            left: `${bubble.x - bubble.radius}px`,
            top: `${bubble.y - bubble.radius}px`,
            filter: `hue-rotate(${bubble.hueOffset}deg)`,
          }}
        >
          <span className="text-center px-2 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-wide">
            {bubble.text}
          </span>
        </div>
      ))}
    </div>
  );
}
