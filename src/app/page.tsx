"use client";

import { useState, useEffect, useRef } from "react";

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
import IntroScreen from "@/components/IntroScreen";
import MeteorCursor from "@/components/MeteorCursor";
import BubbleSkills from "@/components/BubbleSkills";
import Image from "next/image";

type SectionType = "about" | "skills" | "projects" | "contact" | null;

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionType>(null);
  const [stars, setStars] = useState<{ top: number; left: number; size: number; delay: number; duration: number; driftX: number; driftY: number }[]>([]);
  const contentPanelRef = useRef<HTMLDivElement>(null);

  // Generate stars for main page background
  useEffect(() => {
    const list = [];
    for (let i = 0; i < 70; i++) {
      list.push({
        top: Math.random() * 75,
        left: Math.random() * 100,
        size: Math.random() * 1.8 + 0.6,
        delay: Math.random() * 5,
        duration: Math.random() * 5 + 3, // slow gentle animation
        driftX: (Math.random() - 0.5) * 45, // horizontal drift
        driftY: (Math.random() - 0.5) * 45, // vertical drift
      });
    }
    setStars(list);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLButtonElement>, section: SectionType) => {
    e.preventDefault();
    
    // 1. Immediately activate the section for instantaneous UI response
    setActiveSection(section);
    
    // 2. Smoothly scroll to the content panel
    setTimeout(() => {
      contentPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);

    // 3. Trigger custom cursor fly-to animation in parallel if available
    const rect = e.currentTarget.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    if ((window as any).animateMeteorTo) {
      (window as any).animateMeteorTo(targetX, targetY);
    }
  };

  if (loading) {
    return <IntroScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <main 
      className="relative min-h-screen flex flex-col items-center justify-start overflow-x-hidden bg-cover bg-center select-none"
      style={{ backgroundImage: "url('/main-bg.png')" }}
    >
      {/* Custom Meteor Cursor canvas */}
      <MeteorCursor />

      {/* Deep Space dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/40 pointer-events-none" />

      {/* Twinkling and Drifting Stars */}
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

      <div className="absolute top-8 left-8 md:top-16 md:left-16 z-10 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-radial from-blue-300/10 via-blue-500/3 to-transparent rounded-full blur-3xl" />
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-white via-blue-50 to-blue-200 shadow-[0_0_15px_4px_rgba(219,234,254,0.35)] animate-moon-glow" />
      </div>

      {/* HEADER / NAVIGATION */}
      <header className="w-full max-w-5xl px-6 py-6 md:py-8 z-30 relative mt-4">
        <nav className="glass-panel rounded-full px-4 py-2 md:px-8 md:py-3 flex justify-center items-center gap-2 sm:gap-6 md:gap-10 border border-white/5 shadow-lg max-w-xl mx-auto">
          {(["about", "skills", "projects", "contact"] as SectionType[]).map((sect) => (
            <button
              key={sect}
              onClick={(e) => handleNavClick(e, sect)}
              className={`relative px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium uppercase tracking-widest transition-all duration-300 ${
                activeSection === sect
                  ? "text-white bg-blue-500/20 border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  : "text-blue-200/70 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              {sect}
            </button>
          ))}
        </nav>
      </header>

      {/* PERSISTENT CENTERED HEADER (Profile & Name) */}
      <section className="w-full max-w-4xl px-6 flex flex-col items-center justify-center text-center z-20 relative mt-6 md:mt-10">
        {/* Profile photo masked in oval shape */}
        <div className="w-36 h-48 md:w-44 md:h-56 oval-mask relative mb-6">
          <Image
            src="/profile.jpg"
            alt="Divyanjali"
            fill
            priority
            sizes="(max-width: 768px) 144px, 176px"
            className="object-cover"
          />
        </div>

        {/* Shining star text effect name */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.18em] uppercase text-shining select-text mb-4">
          Divyanjali
        </h2>
        
        <p className="text-blue-200/60 font-light tracking-[0.25em] text-xs sm:text-sm uppercase mb-8">
          ECE Student &bull; Tech Explorer &bull; Designer
        </p>
      </section>

      {/* DYNAMIC CONTENT SECTION (Opens in glassmorphic panel below) */}
      <section 
        ref={contentPanelRef}
        className="w-full max-w-4xl px-4 sm:px-6 pb-24 z-20 relative min-h-[100px]"
      >
        {activeSection === "about" && (
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 sm:p-8 md:p-10 border border-white/10 shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="text-3xl sm:text-4xl">👋</span>
                <h3 className="text-2xl sm:text-3xl font-light tracking-wide text-white">
                  Hi, I'm <span className="font-normal text-blue-300">Divyanjali</span>
                </h3>
              </div>

              {/* Headline block */}
              <div className="inline-flex max-w-max bg-cyan-950/60 border border-cyan-500/30 rounded-xl px-6 py-2.5 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <span className="text-cyan-300 font-medium text-sm sm:text-base tracking-[0.2em] uppercase">
                  Wired to Create
                </span>
              </div>

              {/* Bio paragraphs */}
              <div className="flex flex-col gap-4 text-slate-200/90 text-sm sm:text-base font-light leading-relaxed tracking-wide select-text">
                <p>
                  B.Tech ECE student who is obsessed with how things work — from circuits to code to creative interfaces.
                </p>
                <p>
                  I'm building my roots in VLSI and Embedded Systems, exploring Cloud and DevOps, and designing UI/UX that is bold, experimental and intentional.
                </p>
                <p>
                  I'm also deeply fascinated by AI — constantly exploring tools and ideas that are reshaping how we build and think. Three real projects built from scratch. Zero excuses.
                </p>
                <p className="font-normal text-blue-300/90 mt-2">
                  Currently a fresher — but building fast, learning faster.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === "skills" && (
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-6">
            <h3 className="text-2xl sm:text-3xl font-light tracking-wide text-white mb-4 text-center">
              My <span className="font-normal text-blue-300">Skills</span>
            </h3>
            <p className="text-xs sm:text-sm text-blue-200/50 text-center mb-8 tracking-widest uppercase">
              Click on bubbles to pop them with a speed burst!
            </p>
            <BubbleSkills />
          </div>
        )}

        {activeSection === "projects" && (
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-6">
            <h3 className="text-2xl sm:text-3xl font-light tracking-wide text-white mb-8 text-center">
              Featured <span className="font-normal text-blue-300">Projects</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Project 1 */}
              <div className="double-border animate-float-box-1 flex flex-col justify-between min-h-[250px] transition-transform duration-300 hover:scale-[1.02]">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/20 uppercase tracking-widest">
                      In Progress
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold tracking-wider text-white uppercase mb-2">
                    VERDANT WRAP
                  </h4>
                  <p className="text-xs font-medium text-cyan-300 uppercase tracking-wider mb-3">
                    Sole Innovator & Concept Architect
                  </p>
                  <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed select-text">
                    Ideated and developed a seed-embedded biodegradable packaging solution entirely from scratch.
                  </p>
                </div>
              </div>

              {/* Project 2 */}
              <div className="double-border animate-float-box-2 flex flex-col justify-between min-h-[250px] transition-transform duration-300 hover:scale-[1.02]">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/20 uppercase tracking-widest">
                      Completed
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold tracking-wider text-white uppercase mb-2">
                    Air Drawing App
                  </h4>
                  <p className="text-xs font-medium text-cyan-300 uppercase tracking-wider mb-3">
                    Gesture Logic Designer & Developer
                  </p>
                  <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed select-text">
                    Designed the hand gesture-to-action mapping system and built the full application learning Python from zero.
                  </p>
                </div>
              </div>

              {/* Project 3 */}
              <div className="double-border animate-float-box-3 flex flex-col justify-between min-h-[250px] transition-transform duration-300 hover:scale-[1.02]">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/20 uppercase tracking-widest">
                      In Progress
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold tracking-wider text-white uppercase mb-2">
                    MediWater Kiosk
                  </h4>
                  <p className="text-xs font-medium text-cyan-300 uppercase tracking-wider mb-3">
                    Hardware & UX Design Lead
                  </p>
                  <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed select-text">
                    Led component selection and key design decisions across both hardware and user interface layers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "contact" && (
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 sm:p-8 md:p-10 border border-white/10 shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-6 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-light tracking-wide text-white mb-2 text-center">
               Contact <span className="font-normal text-blue-300">Me</span>
            </h3>
            <p className="text-sm font-light text-slate-300/80 text-center mb-8 select-text">
              Do you have a new idea? Contact me
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5 pointer-events-auto">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-xs font-medium uppercase tracking-widest text-slate-300">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  placeholder="Your Name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:bg-white/10 transition-all duration-300"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs font-medium uppercase tracking-widest text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="Your Email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:bg-white/10 transition-all duration-300"
                />
              </div>
              {/* Submit / LinkedIn Button */}
              <a
                href="https://www.linkedin.com/in/divyanjali-yerraiah-gari-2117153bb"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full py-3.5 px-6 rounded-xl text-center text-sm font-medium uppercase tracking-widest text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all duration-300 focus:outline-none border border-white/10 flex items-center justify-center gap-2"
              >
                {/* LinkedIn Icon */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                Connect on LinkedIn
              </a>
            </form>
          </div>
        )}
      </section>

      {/* Swaying Pine trees silhouette at the very bottom (Main page continuation) */}
      <footer className="w-full mt-auto relative h-32 md:h-44 z-10 pointer-events-none flex items-end">
        {/* Stable div wrapper to sway trees in all browsers */}
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
      </footer>
    </main>
  );
}
