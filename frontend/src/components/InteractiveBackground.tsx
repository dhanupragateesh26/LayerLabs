'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function InteractiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!isClient) return null; // Avoid hydration mismatch

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-black">
      {/* CSS Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      {/* Mouse Follower Glow */}
      <motion.div
        className="absolute w-[400px] h-[400px] bg-brand-primary/20 rounded-full blur-[100px]"
        animate={{
          x: mousePosition.x - 200, // Center the orb on mouse
          y: mousePosition.y - 200,
        }}
        transition={{ type: "tween", ease: "circOut", duration: 0.8 }}
      />
      
      {/* Added abstract rotating shape for extra dynamism */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-brand-secondary/10 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
      />
    </div>
  );
}
