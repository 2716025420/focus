import { motion } from "framer-motion";
import { useMemo } from "react";

export function StarrySky() {
  // Generate random twinkling stars
  const stars = useMemo(() => {
    return [...Array(70)].map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1, // 1px to 3px
      duration: Math.random() * 4 + 3, // 3s to 7s
      delay: Math.random() * 5,
      glow: Math.random() > 0.8 // 20% of stars have a stronger glow
    }));
  }, []);

  return (
    <div className="absolute inset-0 bg-[#07090F] overflow-hidden">
       {/* Deep night sky gradient */}
       <div className="absolute inset-0 opacity-90" 
            style={{ background: 'radial-gradient(circle at 50% 0%, #151A28 0%, #07090F 70%, #000000 100%)' }} />
       
       {/* Twinkling Stars */}
       {stars.map((star) => (
         <motion.div
           key={star.id}
           className="absolute rounded-full bg-white"
           style={{
             top: star.top + '%',
             left: star.left + '%',
             width: star.size + 'px',
             height: star.size + 'px',
             boxShadow: star.glow ? `0 0 ${star.size * 3}px ${star.size}px rgba(255,255,255,0.4)` : 'none'
           }}
           animate={{
             opacity: [0.2, 1, 0.2],
             scale: [0.8, 1.2, 0.8]
           }}
           transition={{
             duration: star.duration,
             repeat: Infinity,
             ease: "easeInOut",
             delay: star.delay
           }}
         />
       ))}
    </div>
  );
}

export function Rainforest() {
  // Fireflies
  const fireflies = useMemo(() => {
    return [...Array(35)].map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 2, // 2px to 5px
      startX: Math.random() * 100,
      startY: Math.random() * 100,
      moveX: (Math.random() - 0.5) * 20, // -10vw to 10vw
      moveY: (Math.random() - 0.5) * 20, // -10vh to 10vh
      duration: Math.random() * 8 + 6, // 6s to 14s
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="absolute inset-0 bg-[#050A07] overflow-hidden">
      {/* Deep forest gradient */}
      <div className="absolute inset-0 opacity-90"
        style={{ 
          background: "radial-gradient(circle at 50% 100%, #122A1B 0%, #0A110D 60%, #030504 100%)" 
        }}
      />
      
      {/* Fireflies */}
      <div className="absolute inset-0">
        {fireflies.map((ff) => (
          <motion.div
            key={ff.id}
            className="absolute rounded-full bg-[#D4F0B7]"
            style={{
              width: ff.size + 'px',
              height: ff.size + 'px',
              left: ff.startX + '%',
              top: ff.startY + '%',
              boxShadow: `0 0 ${ff.size * 4}px ${ff.size * 1.5}px rgba(212, 240, 183, 0.5)`
            }}
            animate={{
              x: [0, ff.moveX + 'vw', 0],
              y: [0, ff.moveY + 'vh', 0],
              opacity: [0, 0.9, 0.2, 0.9, 0],
            }}
            transition={{
              duration: ff.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: ff.delay,
              times: [0, 0.25, 0.5, 0.75, 1] // Creates the alternating bright/dark blinking effect
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function AnimeFantasy() {
  // Relaxing, sparse meteor shower
  const meteors = useMemo(() => {
    return [...Array(8)].map((_, i) => ({
      id: i,
      startX: Math.random() * 140 - 20, // -20% to 120%
      startY: Math.random() * 100 - 20, // -20% to 80%
      length: Math.random() * 150 + 100, // 100px to 250px
      duration: Math.random() * 7 + 6, // 6s to 13s (slow and relaxing)
      delay: Math.random() * 20, // Spread out over 20s
    }));
  }, []);

  return (
    <div className="absolute inset-0 bg-[#1A1528] overflow-hidden">
      {/* Anime twilight gradient */}
      <div className="absolute inset-0"
        style={{ 
          background: "linear-gradient(to bottom, #1A1528 0%, #342240 50%, #5C3858 100%)" 
        }}
      />
      
      {/* Glowing Horizon */}
      <motion.div 
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-[30%] left-0 right-0 h-[80%] opacity-60 blur-3xl"
        style={{ background: 'radial-gradient(ellipse at top, #ECA4A6 0%, transparent 60%)' }}
      />

      {/* Meteors */}
      <div className="absolute inset-0">
        {meteors.map((m) => (
          <motion.div
            key={m.id}
            className="absolute"
            style={{
              top: m.startY + '%',
              left: m.startX + '%',
            }}
            initial={{
              opacity: 0,
              x: 0,
              y: 0
            }}
            animate={{
              x: [0, 1500],
              y: [0, 1500],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: m.duration,
              repeat: Infinity,
              ease: "linear",
              delay: m.delay,
            }}
          >
            {/* Rotated Meteor Container */}
            <div 
              className="flex items-center justify-end"
              style={{
                width: m.length + 'px',
                transform: 'rotate(45deg)',
                transformOrigin: 'right center', // Head is the origin
              }}
            >
              {/* Meteor Tail */}
              <div 
                className="h-[1px] w-full"
                style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4))' }} 
              />
              {/* Meteor Head (Bright Dot) */}
              <div className="w-[3px] h-[3px] rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,1)] flex-shrink-0" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
