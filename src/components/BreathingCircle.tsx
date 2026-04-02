"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHASES = [
  { text: "吸气", duration: 4000, scale: 1.5 },
  { text: "屏息", duration: 4000, scale: 1.5 },
  { text: "呼气", duration: 4000, scale: 1 },
  { text: "屏息", duration: 4000, scale: 1 },
];

export default function BreathingCircle({ onComplete }: { onComplete: () => void }) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % PHASES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const currentPhase = PHASES[phaseIndex];

  return (
    <div className="flex flex-col items-center justify-center space-y-16">
      <div className="relative flex items-center justify-center w-64 h-64">
        {/* Breathing Circle Glow */}
        <motion.div
          animate={{ scale: currentPhase.scale }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="absolute w-32 h-32 rounded-full bg-khaki-light/50 backdrop-blur-md shadow-[0_0_40px_rgba(227,213,202,0.6)]"
        />
        {/* Core Anchor Dot */}
        <div className="absolute w-2 h-2 rounded-full bg-khaki-dark" />
      </div>

      <div className="flex flex-col items-center space-y-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentPhase.text}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-light tracking-widest text-text-brown"
          >
            {currentPhase.text}
          </motion.p>
        </AnimatePresence>
        
        <button
          onClick={onComplete}
          className="text-sm text-text-brown/40 hover:text-text-brown/70 transition-colors tracking-widest uppercase mt-8"
        >
          跳过 ({timeLeft}s)
        </button>
      </div>
    </div>
  );
}
