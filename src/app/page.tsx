"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BreathingCircle from "@/components/BreathingCircle";
import FocusTimer from "@/components/FocusTimer";
import AudioWidget from "@/components/AudioWidget";
import RecordsPanel from "@/components/RecordsPanel";
import { Play, History, Clock } from "lucide-react";

type FlowState = "landing" | "breathing" | "intent" | "focus" | "summary";

export default function Home() {
  const [currentState, setCurrentState] = useState<FlowState>("landing");
  const [intent, setIntent] = useState("");
  const [isInteracted, setIsInteracted] = useState(false);
  const [showRecords, setShowRecords] = useState(false);
  
  // 专注时长设定（秒），默认 25 分钟
  const [duration, setDuration] = useState(25 * 60);
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [customH, setCustomH] = useState(0);
  const [customM, setCustomM] = useState(0);
  const [customS, setCustomS] = useState(0);

  // 总结页数据
  const [summaryData, setSummaryData] = useState<{ completed: boolean, actualTime: number }>({ completed: false, actualTime: 0 });

  const handleStart = () => {
    setIsInteracted(true);
    setCurrentState("breathing");
  };

  const handleCustomTimeChange = () => {
    const totalSeconds = (customH * 3600) + (customM * 60) + customS;
    if (totalSeconds > 0) {
      setDuration(totalSeconds);
    }
  };

  useEffect(() => {
    if (isCustomTime) {
      handleCustomTimeChange();
    }
  }, [customH, customM, customS, isCustomTime]);

  const presetTimes = [
    { label: "10 分钟", value: 10 * 60 },
    { label: "30 分钟", value: 30 * 60 },
    { label: "1 小时", value: 60 * 60 },
  ];

  // 总结页任意键返回
  useEffect(() => {
    if (currentState === "summary") {
      const handleKeyDown = () => {
        setCurrentState("landing");
        setIntent("");
      };
      
      // 延迟绑定全局事件，防止触发"放弃"时的点击/按键事件冒泡被立刻捕获
      const timer = setTimeout(() => {
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("click", handleKeyDown);
      }, 100);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("click", handleKeyDown);
      };
    }
  }, [currentState]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-warmwhite text-text-brown selection:bg-khaki-dark selection:text-white">
      {/* 悬浮背景音乐控制器 */}
      <AudioWidget isInteracted={isInteracted} />

      {/* 专注历史记录弹窗 */}
      <AnimatePresence>
        {showRecords && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-50"
          >
            <RecordsPanel onClose={() => setShowRecords(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 首页顶部的查看记录按钮 */}
      {currentState === "landing" && (
        <button 
          onClick={() => setShowRecords(true)}
          className="absolute top-8 right-8 p-3 rounded-full text-text-brown/40 hover:text-text-brown hover:bg-khaki-light/30 transition-all z-40 flex items-center space-x-2 group"
        >
          <span className="text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">记录</span>
          <History className="w-5 h-5" />
        </button>
      )}

      <AnimatePresence mode="wait">
        {currentState === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="flex flex-col items-center text-center space-y-12"
          >
            <h1 className="text-3xl md:text-5xl font-light tracking-wide text-text-brown/90">
              在开始前，<br className="md:hidden" />让我们先停下来。
            </h1>
            <button
              onClick={handleStart}
              className="group flex items-center justify-center w-16 h-16 rounded-full bg-khaki-light/30 hover:bg-khaki-light/60 transition-all duration-500 ease-out hover:scale-105"
            >
              <Play className="w-6 h-6 ml-1 text-text-brown/70 group-hover:text-text-brown transition-colors" />
            </button>
          </motion.div>
        )}

        {currentState === "breathing" && (
          <motion.div
            key="breathing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1 }}
            className="w-full h-full flex items-center justify-center"
          >
            <BreathingCircle onComplete={() => setCurrentState("intent")} />
          </motion.div>
        )}

        {currentState === "intent" && (
          <motion.div
            key="intent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center space-y-8 w-full max-w-md px-6"
          >
            <h2 className="text-xl md:text-2xl font-medium text-text-brown/80 tracking-wider">
              设定专注锚点
            </h2>
            
            <div className="w-full space-y-6">
              {/* 时长选择 */}
              <div className="flex flex-col items-center space-y-3">
                <div className="flex space-x-2">
                  {presetTimes.map((pt) => (
                    <button
                      key={pt.value}
                      onClick={() => { setDuration(pt.value); setIsCustomTime(false); }}
                      className={`px-4 py-1.5 rounded-full text-xs tracking-wider transition-all border ${!isCustomTime && duration === pt.value ? 'bg-khaki-dark/20 border-khaki-dark/40 text-text-brown' : 'bg-transparent border-transparent text-text-brown/50 hover:bg-khaki-light/30'}`}
                    >
                      {pt.label}
                    </button>
                  ))}
                  <button
                      onClick={() => setIsCustomTime(true)}
                      className={`px-4 py-1.5 rounded-full text-xs tracking-wider transition-all border ${isCustomTime ? 'bg-khaki-dark/20 border-khaki-dark/40 text-text-brown' : 'bg-transparent border-transparent text-text-brown/50 hover:bg-khaki-light/30'}`}
                    >
                      自定义
                  </button>
                </div>
                
                <AnimatePresence>
                  {isCustomTime && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      className="overflow-hidden w-full"
                    >
                      <div className="flex justify-center items-center py-2 mx-auto w-max">
                        <div className="flex items-baseline text-text-brown/80">
                          <input 
                            type="number" 
                            min="0" max="23" 
                            value={customH || ''} 
                            onChange={(e) => setCustomH(Number(e.target.value))} 
                            className="w-14 text-center bg-transparent text-3xl font-light focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-khaki-dark/40 selection:bg-khaki-dark/20"
                            placeholder="00"
                          />
                          <span className="text-sm font-medium ml-1">h</span>
                        </div>
                        <span className="text-khaki-dark/40 text-2xl font-light mx-2 pb-1">:</span>
                        <div className="flex items-baseline text-text-brown/80">
                          <input 
                            type="number" 
                            min="0" max="59" 
                            value={customM || ''} 
                            onChange={(e) => setCustomM(Number(e.target.value))} 
                            className="w-14 text-center bg-transparent text-3xl font-light focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-khaki-dark/40 selection:bg-khaki-dark/20"
                            placeholder="00"
                          />
                          <span className="text-sm font-medium ml-1">m</span>
                        </div>
                        <span className="text-khaki-dark/40 text-2xl font-light mx-2 pb-1">:</span>
                        <div className="flex items-baseline text-text-brown/80">
                          <input 
                            type="number" 
                            min="0" max="59" 
                            value={customS || ''} 
                            onChange={(e) => setCustomS(Number(e.target.value))} 
                            className="w-14 text-center bg-transparent text-3xl font-light focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-khaki-dark/40 selection:bg-khaki-dark/20"
                            placeholder="00"
                          />
                          <span className="text-sm font-medium ml-1">s</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 意图输入 */}
              <p className="text-sm text-text-brown/50 text-center">
                接下来的 {isCustomTime ? '时光' : (duration / 60) + ' 分钟'}，你唯一要专注完成的一件事是什么？
              </p>
              <input
                type="text"
                autoFocus
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder="我想完成..."
                className="w-full text-center bg-transparent border-b border-khaki-dark/40 py-3 text-lg focus:outline-none focus:border-khaki-dark transition-colors placeholder:text-khaki-dark/50"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && intent.trim() && duration > 0) {
                    setCurrentState("focus");
                  }
                }}
              />
            </div>
            
            <button
              onClick={() => {
                if (intent.trim() && duration > 0) setCurrentState("focus");
              }}
              disabled={!intent.trim() || duration <= 0}
              className="px-8 py-2 rounded-full text-sm tracking-widest uppercase transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed bg-khaki-dark/20 hover:bg-khaki-dark/40 text-text-brown"
            >
              进入心流
            </button>
          </motion.div>
        )}

        {currentState === "focus" && (
          <motion.div
            key="focus"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full"
          >
            <FocusTimer 
              intent={intent} 
              initialDuration={duration}
              onEnd={(completed, actualTime) => {
                setSummaryData({ completed, actualTime });
                setCurrentState("summary");
              }} 
            />
          </motion.div>
        )}

        {currentState === "summary" && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center space-y-8 w-full max-w-xl px-6 text-center cursor-pointer"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-light text-text-brown/90">
                {summaryData.completed ? "干得漂亮！" : "休息一下也无妨。"}
              </h2>
              <p className="text-lg text-text-brown/60">
                {summaryData.completed 
                  ? "你完美地守护了自己的注意力，这段时间将成为你成长的基石。" 
                  : "能开始就是一种勇气，现在的中断是为了下一次更好的出发。"}
              </p>
            </div>

            <div className="w-full max-w-sm space-y-4">
              <p className="text-sm tracking-widest uppercase text-text-brown/50">专注报告</p>
              <div>
                <p className="text-2xl font-medium text-text-brown">{intent}</p>
                <div className="flex items-center justify-center space-x-2 mt-2 text-text-brown/70">
                  <Clock className="w-4 h-4" />
                  <span>
                    {Math.floor(summaryData.actualTime / 3600) > 0 ? `${Math.floor(summaryData.actualTime / 3600)}小时 ` : ""}
                    {Math.floor((summaryData.actualTime % 3600) / 60)}分钟 {summaryData.actualTime % 60}秒
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm tracking-widest text-text-brown/40 animate-pulse mt-12">
              - 按下任意键或点击屏幕继续 -
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
