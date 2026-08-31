'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);

  // Glow circle center
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);

  // Smooth lagging spring for the glow
  const springConfig = { damping: 100, stiffness: 100, mass: 0.8 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // Glow circle center (400x400 size -> offset by 200)
      cursorX.set(e.clientX - 200);
      cursorY.set(e.clientY - 200);

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  // Only render on client to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-[400px] h-[400px] pointer-events-none z-[9998]"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        opacity: isVisible ? 1 : 0,
      }}
      initial={false}
      transition={{ opacity: { duration: 0.5 } }}
    >
      <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(79,107,67,0.15)_0%,rgba(139,115,85,0.05)_40%,rgba(255,255,255,0)_70%)] blur-2xl" />
    </motion.div>
  );
}
