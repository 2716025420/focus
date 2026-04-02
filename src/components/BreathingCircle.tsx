"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

// 采用医学上著名的 4-7-8 放松呼吸法 (Dr. Andrew Weil)
// 被广泛证明能有效激活副交感神经，快速降低心率，平复焦虑并进入深度专注/放松状态
const PHASES = [
  { text: "吸气", duration: 4000 },
  { text: "屏息", duration: 7000 },
  { text: "呼气", duration: 8000 },
  { text: "放空", duration: 1000 }, // 留白1秒，用于欣赏水滴落水的余波
];

export default function BreathingCircle({ onComplete }: { onComplete: () => void }) {
  const [isStarted, setIsStarted] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [countdown, setCountdown] = useState(3);
  
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 总体时间延长到3分钟 (180秒)
  const [splash, setSplash] = useState(0);

  // 准备阶段倒计时
  useEffect(() => {
    if (isStarted || isEnding) return;
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          // 当倒计时到0（即显示“开始”）后，延迟1秒再正式开始
          setTimeout(() => setIsStarted(true), 1000);
          return prev;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isEnding]);

  // 动态切换呼吸阶段
  useEffect(() => {
    if (!isStarted || isEnding) return;
    const timer = setTimeout(() => {
      setPhaseIndex((prev) => (prev + 1) % PHASES.length);
    }, PHASES[phaseIndex].duration);
    return () => clearTimeout(timer);
  }, [phaseIndex, isStarted, isEnding]);

  // 整体倒计时
  useEffect(() => {
    if (!isStarted || isEnding) return;
    if (timeLeft <= 0) {
      setIsEnding(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isStarted, isEnding]);

  // 水滴落水激起涟漪计数
  useEffect(() => {
    if (isStarted && !isEnding && phaseIndex === 3) {
      setSplash((prev) => prev + 1);
    }
  }, [phaseIndex, isStarted, isEnding]);

  // 结束阶段过渡动画
  useEffect(() => {
    if (isEnding) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000); // 展示 3 秒的过渡页面后，再进入到 intent 设定
      return () => clearTimeout(timer);
    }
  }, [isEnding, onComplete]);

  const handleSkip = () => {
    setIsEnding(true);
  };

  const currentPhase = PHASES[phaseIndex];

  // 波纹动画控制: 吸气和屏息期间保持扩大，呼气时收缩
  const rippleScale = phaseIndex === 0 || phaseIndex === 1 ? 1.5 : 0.8;
  const rippleOpacity = phaseIndex === 0 || phaseIndex === 1 ? 0.4 : 0.1;
  // 扩大时的动画时间是吸气时间(4s)，缩小时是呼气时间(8s)
  const rippleTransitionDuration = phaseIndex === 0 || phaseIndex === 1 ? 4 : 8;

  // 水滴状态控制
  let dropVariant = "inhale";
  if (phaseIndex === 0) dropVariant = "inhale";
  else if (phaseIndex === 1) dropVariant = "holdTop";
  else if (phaseIndex === 2) dropVariant = "exhale";
  else if (phaseIndex === 3) dropVariant = "holdBottom";

  const dropVariants: Variants = {
    inhale: {
      scale: [0, 1],
      y: ["-35vh", "-35vh"],
      opacity: [0, 1],
      rotate: 45,
      transition: { duration: 4, ease: "easeOut" }
    },
    holdTop: {
      scale: 1,
      y: "-35vh",
      opacity: 1,
      rotate: 45,
      transition: { duration: 7, ease: "linear" }
    },
    exhale: {
      scale: 1,
      y: 0,
      opacity: 1,
      rotate: 45,
      transition: { duration: 8, ease: "easeInOut" } // 配合长达8秒的缓慢呼气，水滴也缓慢下落
    },
    holdBottom: {
      scale: 0,
      y: 0,
      opacity: 0,
      rotate: 45,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };
  const ripples = [
    { delay: 0, baseScale: 1 },
    { delay: 0.3, baseScale: 1.2 },
    { delay: 0.6, baseScale: 1.4 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden bg-warmwhite">
      <AnimatePresence mode="wait">
        {!isStarted && !isEnding ? (
          <motion.div
            key="preparation"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-warmwhite space-y-12 z-20"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center space-y-4"
            >
              <p className="text-2xl md:text-3xl font-light text-text-brown tracking-widest text-center leading-relaxed">
                调整坐姿，放松肩膀<br/>
                深呼吸
              </p>
              <p className="text-sm tracking-widest text-text-brown/50 uppercase mt-4">
                准备进入 3 分钟的深度平静
              </p>
            </motion.div>
            
            <div className="h-24 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={countdown}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                  className="text-6xl font-light text-khaki-dark tracking-[0.2em]"
                >
                  {countdown > 0 ? countdown : "开始"}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        ) : isEnding ? (
          <motion.div
            key="ending"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-warmwhite space-y-12 z-20"
          >
            <p className="text-2xl md:text-3xl font-light text-text-brown tracking-widest text-center leading-relaxed">
              内心已然平静
            </p>
            <p className="text-sm tracking-widest text-text-brown/40 uppercase mt-4 animate-pulse">
              即将进入专注状态...
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="breathing-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {/* 居中动画层 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* 整体背景呼吸波纹 */}
              {ripples.map((r, i) => (
                <motion.div
                  key={`ripple-${i}`}
                  animate={{ scale: rippleScale * r.baseScale, opacity: rippleOpacity * (1 - i * 0.2) }}
                  transition={{ duration: rippleTransitionDuration, ease: "easeInOut", delay: r.delay }}
                  className="absolute w-[40vw] h-[40vw] min-w-[300px] min-h-[300px] max-w-[600px] max-h-[600px] rounded-full border border-khaki-dark/20 bg-khaki-light/5"
                />
              ))}

              {/* 水滴落水瞬间的涟漪 */}
              <AnimatePresence>
                {phaseIndex === 3 && (
                  <motion.div
                    key={`splash-${splash}`}
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute w-32 h-32 rounded-full border-[3px] border-khaki-dark/30"
                  />
                )}
              </AnimatePresence>

              {/* 顶部水滴 */}
              <motion.div
                variants={dropVariants}
                initial={{ scale: 0, y: "-35vh", opacity: 0, rotate: 45 }}
                animate={dropVariant}
                className="absolute w-8 h-8 bg-gradient-to-br from-[#E3D5CA] to-[#C8B6A6] shadow-[0_10px_20px_rgba(200,182,166,0.6)]"
                style={{
                  borderRadius: "0 50% 50% 50%", // 旋转45度后顶部变尖
                }}
              />
            </div>

            {/* 底部文字和跳过按钮 */}
            <div className="absolute inset-x-0 bottom-[15%] flex flex-col items-center space-y-6 z-10">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentPhase.text}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl font-light tracking-widest text-text-brown"
                >
                  {currentPhase.text}
                </motion.p>
              </AnimatePresence>
              
              <button
                onClick={handleSkip}
                className="text-sm text-text-brown/40 hover:text-text-brown/70 transition-colors tracking-widest uppercase"
              >
                跳过 ({Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
