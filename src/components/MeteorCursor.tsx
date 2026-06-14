"use client";

import { useEffect, useRef, useState } from "react";

export default function MeteorCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top = e.clientY + "px";
      }
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: "2px solid rgba(147, 197, 253, 0.8)",
          boxShadow: "0 0 10px rgba(147, 197, 253, 0.6), 0 0 20px rgba(59, 130, 246, 0.4)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 999999,
          transition: "width 0.2s, height 0.2s",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
        }}
      />
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0 0 6px rgba(255, 255, 255, 0.8)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 999999,
        }}
      />
    </>
  );
}