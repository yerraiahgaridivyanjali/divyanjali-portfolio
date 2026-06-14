"use client";

import { useEffect, useState, useRef } from "react";

const FOREST_TREES = [
  { x: 30, w: 45, h: 110 },
  { x: 60, w: 55, h: 140 },
  { x: 100, w: 35, h: 90 },
  { x: 130, w: 60, h: 155 },
  { x: 170, w: 50, h: 125 },
  { x: 210, w: 65, h: 165 },
  { x: 250, w: 45, h: 110 },
  { x: 290, w: 55, h: 140 },
  { x: 330, w: 35, h: 95 },
  { x: 360, w: 60, h: 150 },
  { x: 400, w: 50, h: 120 },
  { x: 440, w: 65, h: 170 },
  { x: 480, w: 45, h: 115 },
  { x: 520, w: 55, h: 145 },
  { x: 560, w: 35, h: 90 },
  { x: 590, w: 60, h: 160 },
  { x: 630, w: 50, h: 125 },
  { x: 670, w: 65, h: 175 },
  { x: 710, w: 45, h: 110 },
  { x: 750, w: 55, h: 140 },
  { x: 790, w: 35, h: 95 },
  { x: 820, w: 60, h: 155 },
  { x: 860, w: 50, h: 120 },
  { x: 900, w: 65, h: 165 },
  { x: 940, w: 45, h: 115 },
  { x: 980, w: 55, h: 145 },
  { x: 1020, w: 35, h: 90 },
  { x: 1050, w: 60, h: 160 },
  { x: 1090, w: 50, h: 125 },
  { x: 1130, w: 65, h: 170 },
  { x: 1170, w: 45, h: 110 },
  { x: 1210, w: 55, h: 140 },
  { x: 1250, w: 35, h: 95 },
  { x: 1280, w: 60, h: 150 },
  { x: 1320, w: 50, h: 120 },
  { x: 1360, w: 65, h: 175 },
  { x: 1400, w: 45, h: 110 },
  { x: 1440, w: 55, h: 140 },
];

const getPineTreePath = (x: number, w: number, h: number) => {
  const bottom = 200;
  const top = bottom - h;
  const t1y = top + h * 0.25;
  const t2y = top + h * 0.5;
  const t3y = top + h * 0.75;
  const t4y = bottom;

  return `M ${x},${top} L ${x - w * 0.15},${t1y} L ${x - w * 0.08},${t1y} L ${x - w * 0.28},${t2y} L ${x - w * 0.15},${t2y} L ${x - w * 0.45},${t3y} L ${x - w * 0.22},${t3y} L ${x - w * 0.6},${t4y} L ${x + w * 0.6},${t4y} L ${x + w * 0.22},${t3y} L ${x + w * 0.45},${t3y} L ${x + w * 0.15},${t2y} L ${x + w * 0.28},${t2y} L ${x + w * 0.08},${t1y} L ${x + w * 0.15},${t1y} Z`;
};

interface IntroScreenProps {
  onComplete: () => void;
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [lettersVisible, setLettersVisible] = useState<boolean[]>(new Array(10).fill(false));
  const [meteorFired, setMeteorFired] = useState(false);
  const [meteorLanded, setMeteorLanded] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const targetDotRef = useRef<HTMLSpanElement>(null);
  const meteorRef = useRef<HTMLDivElement>(null);

  const name = "DIVYANJALI";
  const letterArray = name.split("");

  useEffect(() => {
    // 1. Animate letter by letter (100ms interval per letter)
    const timers: NodeJS.Timeout[] = [];
    letterArray.forEach((_, index) => {
      const timer = setTimeout(() => {
        setLettersVisible((prev) => {
          const next = [...prev];
          next[index] = true;
          return next;
        });

        // Fire the meteor as soon as the first "I" (index 1) appears!
        if (index === 1) {
          setMeteorFired(true);
        }
      }, index * 120 + 200); // start typing after 200ms delay
      timers.push(timer);
    });

    // 2. Transition automatically to the main page after 3.8 seconds
    const completionTimer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        onComplete();
      }, 800); // match transition duration
    }, 3800);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(completionTimer);
    };
  }, [onComplete]);

  useEffect(() => {
    if (!meteorFired || !targetDotRef.current || !meteorRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const dotRect = targetDotRef.current.getBoundingClientRect();
    const meteorElement = meteorRef.current;

    // Calculate dot position relative to the intro container
    const targetX = dotRect.left - containerRect.left + dotRect.width / 2;
    const targetY = dotRect.top - containerRect.top + dotRect.height / 2;

    // Set starting position of the meteor (offscreen top-right)
    const startX = containerRect.width + 100;
    const startY = -100;

    meteorElement.style.left = `${startX}px`;
    meteorElement.style.top = `${startY}px`;
    meteorElement.style.transform = "translate(-50%, -50%) scale(1)";
    meteorElement.style.opacity = "1";

    // Trigger reflow to apply initial styles
    void meteorElement.offsetWidth;

    // Smooth transition to landing dot
    meteorElement.style.transition = "left 0.9s cubic-bezier(0.1, 0.8, 0.25, 1), top 0.9s cubic-bezier(0.1, 0.8, 0.25, 1), transform 0.9s ease-out";
    meteorElement.style.left = `${targetX}px`;
    meteorElement.style.top = `${targetY}px`;
    meteorElement.style.transform = "translate(-50%, -50%) scale(0.6)";

    const landTimer = setTimeout(() => {
      setMeteorLanded(true);
      meteorElement.style.opacity = "0"; // hide the flying meteor once landed
    }, 900); // matches the transition time

    return () => clearTimeout(landTimer);
  }, [meteorFired]);

  // Generate 60 twinkling stars positions with random drift directions
  const [stars, setStars] = useState<{ top: number; left: number; size: number; delay: number; duration: number; driftX: number; driftY: number }[]>([]);
  useEffect(() => {
    const list = [];
    for (let i = 0; i < 60; i++) {
      list.push({
        top: Math.random() * 70, // Keep stars in top 70% of the screen
        left: Math.random() * 100,
        size: Math.random() * 1.8 + 0.6,
        delay: Math.random() * 4,
        duration: Math.random() * 4 + 3, // slow gentle animation
        driftX: (Math.random() - 0.5) * 45,
        driftY: (Math.random() - 0.5) * 45,
      });
    }
    setStars(list);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-cover bg-center transition-opacity duration-800 select-none ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundImage: "url('/intro-bg.png')" }}
    >
      {/* Black/Blue Sky overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/30 pointer-events-none" />

      {/* Atmospheric Glow at bottom above treeline */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#1e3a8a]/20 via-transparent to-transparent pointer-events-none" />

      {/* Twinkling Stars with Drift */}
      {stars.map((star, i) => (
        <div
          key={i}
          className="star animate-twinkle"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            "--twinkle-duration": `${star.duration}s`,
            animationDelay: `${star.delay}s`,
            "--drift-x": `${star.driftX}px`,
            "--drift-y": `${star.driftY}px`,
          } as React.CSSProperties}
        />
      ))}



      {/* Moon in Upper Left corner with soft 90-degree sweeping glow */}
      <div className="absolute top-12 left-12 md:top-20 md:left-20 z-10">
        {/* Soft atmospheric radial glow spread at 90 degrees */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-radial from-blue-300/15 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        {/* Moon Core */}
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-white via-blue-50 to-blue-200 shadow-[0_0_20px_5px_rgba(219,234,254,0.4)] animate-moon-glow" />
      </div>

      {/* Center name animation container */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-20">
        <h1 className="flex text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extralight tracking-[0.15em] sm:tracking-[0.2em] text-white">
          {letterArray.map((char, index) => {
            const isFirstI = index === 1;
            const isVisible = lettersVisible[index];
            
            return (
              <span
                key={index}
                className={`relative inline-block ${
                  isVisible 
                    ? "animate-letter-meteor letter-meteor-streak opacity-100" 
                    : "opacity-0"
                }`}
              >
                {isFirstI ? (
                  // Custom letter "I" that lets a meteor become its dot
                  <span className="inline-flex flex-col items-center relative">
                    {/* The Dot container */}
                    <span 
                      ref={targetDotRef} 
                      className={`w-3 h-3 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 rounded-full absolute -top-5 sm:-top-7 md:-top-9 transition-all duration-300 ${
                        meteorLanded 
                          ? "bg-white shadow-[0_0_15px_6px_rgba(147,197,253,0.9)] opacity-100 scale-100" 
                          : "opacity-0 scale-0"
                      }`}
                    >
                      {/* Landing shockwave ripple */}
                      {meteorLanded && (
                        <span className="absolute inset-0 rounded-full border border-blue-200 animate-ping opacity-75" />
                      )}
                    </span>
                    {/* Stem of the Capital I */}
                    <span>I</span>
                  </span>
                ) : (
                  char
                )}
              </span>
            );
          })}
        </h1>

        {/* Pulsing subtext */}
        <div
          className={`mt-10 md:mt-16 text-lg sm:text-2xl font-light tracking-[0.3em] text-blue-200/90 animate-pulse-glow transition-all duration-1000 ${
            lettersVisible[lettersVisible.length - 1] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          Explore Me Now..
        </div>
      </div>

      {/* Flying Meteor Element */}
      <div
        ref={meteorRef}
        className="absolute pointer-events-none opacity-0 select-none z-30"
        style={{ width: "20px", height: "20px" }}
      >
        {/* Glowing meteor core */}
        <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_15px_4px_rgba(255,255,255,1),0_0_30px_10px_rgba(59,130,246,0.6)] relative z-10" />
        
        {/* Blue tail pointing backwards (flying top-right to bottom-left) */}
        <div 
          className="absolute top-1/2 left-1/2 w-24 h-4 bg-gradient-to-r from-blue-500/80 via-blue-400/30 to-transparent rounded-full origin-left"
          style={{ transform: "translate(0, -50%) rotate(30deg)" }}
        />
      </div>

      {/* Tall pine trees silhouette at the bottom */}
      <div className="w-full relative h-36 sm:h-48 z-10 pointer-events-none flex items-end">
        {/* We use a stable div wrapper to sway the SVG in all browsers */}
        <div className="w-full h-full animate-sway-stable" style={{ transformOrigin: "bottom center" }}>
          <svg 
            className="w-full h-full text-black fill-current" 
            viewBox="0 0 1440 200" 
            preserveAspectRatio="none"
          >
            {/* Layer 1: Back painted forest line (Slightly shorter, lower opacity) */}
            {FOREST_TREES.map((tree, idx) => (
              <path 
                key={`back-${idx}`} 
                d={getPineTreePath(tree.x + 10, tree.w * 0.85, tree.h * 0.85)} 
                opacity="0.5"
              />
            ))}
            {/* Layer 2: Front painted forest line (Taller, full black silhouette) */}
            {FOREST_TREES.map((tree, idx) => (
              <path 
                key={`front-${idx}`} 
                d={getPineTreePath(tree.x, tree.w, tree.h)} 
                opacity="1"
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
