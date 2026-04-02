"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Upload, X, Star, TreePine, Sparkles } from "lucide-react";
import { StarrySky, Rainforest, AnimeFantasy } from "./DynamicBackgrounds";

export default function FocusTimer({ intent, initialDuration = 25 * 60, onEnd }: { intent: string; initialDuration?: number; onEnd: (completed: boolean, actualTime: number) => void }) {
  const [timeLeft, setTimeLeft] = useState(initialDuration);

  // Background settings
  const [bgMedia, setBgMedia] = useState<{ type: "image" | "video" | "builtin", url?: string, name?: "starry" | "rainforest" | "anime" } | null>({ type: "builtin", name: "starry" });
  const [blurAmount, setBlurAmount] = useState(0); // px
  const [dimAmount, setDimAmount] = useState(0); // %
  const [showSettings, setShowSettings] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const settingsBtnRef = useRef<HTMLButtonElement>(null);

  // 自动进入全屏
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.warn("Fullscreen request failed:", err);
      }
    };
    enterFullscreen();

    return () => {
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen();
        }
      } catch (err) {}
    };
  }, []);

  // 点击外部关闭设置
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showSettings &&
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node) &&
        settingsBtnRef.current &&
        !settingsBtnRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSettings]);
  
  // 仅在初次加载时读取存储的滤镜设置
  useEffect(() => {
    try {
      const saved = localStorage.getItem("focus_bg_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.blurAmount !== undefined) setBlurAmount(parsed.blurAmount);
        if (parsed.dimAmount !== undefined) setDimAmount(parsed.dimAmount);
      }
    } catch(e) {}
  }, []);

  // 滤镜设置变化时保存
  useEffect(() => {
    try {
      localStorage.setItem("focus_bg_settings", JSON.stringify({ blurAmount, dimAmount }));
    } catch(e) {}
  }, [blurAmount, dimAmount]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      // 结束时播放提示音
      const audio = new Audio("/audio/bell.wav");
      audio.play().catch(() => {});
      
      // 保存专注记录到本地
      try {
        const saved = localStorage.getItem("focus_records");
        const records = saved ? JSON.parse(saved) : [];
        records.push({
          id: crypto.randomUUID(),
          intent: intent,
          duration: initialDuration,
          timestamp: Date.now()
        });
        localStorage.setItem("focus_records", JSON.stringify(records));
      } catch (err) {
        console.error("Failed to save record", err);
      }
      onEnd(true, initialDuration);
    }
  }, [timeLeft, onEnd, intent, initialDuration]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    if (file.type.startsWith("video/")) {
      setBgMedia({ type: "video", url });
    } else if (file.type.startsWith("image/")) {
      setBgMedia({ type: "image", url });
    }
    
    // 如果用户上传了背景，自动调高遮罩比例以确保文字能看清
    if (dimAmount < 30) {
      setDimAmount(40);
    }
    
    e.target.value = ""; // 重置 input 以便重复上传同一个文件
  };

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  // 判断是否应该使用深色文字（无背景媒体 且 遮罩较浅）
  const isDarkText = !bgMedia && dimAmount < 30;

  return (
    <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden">
      
      {/* 动态背景层 */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {bgMedia ? (
          bgMedia.type === "video" && bgMedia.url ? (
            <video 
              src={bgMedia.url} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover transition-all duration-1000 scale-105"
              style={{ filter: `blur(${blurAmount}px)` }}
            />
          ) : bgMedia.type === "image" && bgMedia.url ? (
            <img 
              src={bgMedia.url} 
              alt="Background" 
              className="w-full h-full object-cover transition-all duration-1000 scale-105"
              style={{ filter: `blur(${blurAmount}px)` }}
            />
          ) : bgMedia.type === "builtin" ? (
            <div className="absolute inset-0 transition-all duration-1000" style={{ filter: `blur(${blurAmount}px)` }}>
              {bgMedia.name === "starry" && <StarrySky />}
              {bgMedia.name === "rainforest" && <Rainforest />}
              {bgMedia.name === "anime" && <AnimeFantasy />}
            </div>
          ) : null
        ) : (
          // 默认呼吸渐变背景
          <motion.div 
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "linear" 
            }}
            className="w-full h-full bg-gradient-to-br from-[#E3D5CA] via-[#FDFBF7] to-[#C8B6A6]"
            style={{ backgroundSize: "200% 200%", filter: `blur(${blurAmount}px)` }}
          />
        )}
        
        {/* 暗角遮罩 (用于降低对比度、防分心、保证文字清晰度) */}
        <div 
          className="absolute inset-0 bg-black transition-opacity duration-500 pointer-events-none"
          style={{ opacity: dimAmount / 100 }}
        />
      </div>

      {/* 设置按钮 */}
      <button 
        ref={settingsBtnRef}
        onClick={() => setShowSettings(!showSettings)}
        className={`absolute top-8 right-8 z-50 p-3 rounded-full backdrop-blur-md transition-all duration-300 ${
          isDarkText 
            ? "bg-khaki-light/30 text-text-brown/50 hover:text-text-brown hover:bg-khaki-light/60" 
            : "bg-white/10 text-white/50 hover:text-white hover:bg-white/20"
        }`}
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* 设置面板 */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            ref={settingsRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-24 right-8 z-50 w-72 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-white/90 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm tracking-widest uppercase text-white/70">背景设置</h3>
              <button onClick={() => setShowSettings(false)} className="text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* 内置主题选择 */}
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => { setBgMedia({ type: "builtin", name: "starry" }); if(dimAmount < 30) setDimAmount(40); }}
                  className={`flex flex-col items-center p-2 rounded-xl border transition-all ${bgMedia?.name === "starry" ? 'bg-white/20 border-white/40' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                >
                  <Star className="w-4 h-4 mb-1 text-blue-200" />
                  <span className="text-[10px] text-white/80">星空</span>
                </button>
                <button 
                  onClick={() => { setBgMedia({ type: "builtin", name: "rainforest" }); if(dimAmount < 30) setDimAmount(40); }}
                  className={`flex flex-col items-center p-2 rounded-xl border transition-all ${bgMedia?.name === "rainforest" ? 'bg-white/20 border-white/40' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                >
                  <TreePine className="w-4 h-4 mb-1 text-green-200" />
                  <span className="text-[10px] text-white/80">雨林</span>
                </button>
                <button 
                  onClick={() => { setBgMedia({ type: "builtin", name: "anime" }); if(dimAmount < 30) setDimAmount(40); }}
                  className={`flex flex-col items-center p-2 rounded-xl border transition-all ${bgMedia?.name === "anime" ? 'bg-white/20 border-white/40' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                >
                  <Sparkles className="w-4 h-4 mb-1 text-pink-200" />
                  <span className="text-[10px] text-white/80">幻想</span>
                </button>
              </div>

              {/* 自定义背景上传 */}
              <div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 flex flex-col items-center justify-center space-y-1 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-dashed border-white/20 text-sm hover:scale-[1.02]"
                >
                  <Upload className="w-4 h-4 text-white/60" />
                  <span className="text-white/80 text-xs">自定义图片或视频</span>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*,video/*"
                  className="hidden"
                />
              </div>

              {/* 控制滑块 */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white/60">
                    <span>背景模糊 (心理景深)</span>
                    <span>{blurAmount}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="40" 
                    value={blurAmount} 
                    onChange={(e) => setBlurAmount(Number(e.target.value))}
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white/60">
                    <span>沉浸遮罩 (降低视觉噪音)</span>
                    <span>{dimAmount}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="90" 
                    value={dimAmount} 
                    onChange={(e) => setDimAmount(Number(e.target.value))}
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>
              </div>
              
              {bgMedia && (
                <button 
                  onClick={() => setBgMedia(null)}
                  className="w-full py-2 text-xs text-white/40 hover:text-white transition-colors"
                >
                  恢复默认渐变背景
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 核心计时器文字 */}
      <div className={`relative z-10 flex flex-col items-center justify-center space-y-16 transition-colors duration-500 ${isDarkText ? "text-text-brown" : "text-white text-shadow-sm"}`}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center space-y-2"
        >
          <p className="text-sm opacity-50 tracking-widest uppercase">当前专注</p>
          <p className={`text-xl md:text-2xl font-medium ${!isDarkText && 'drop-shadow-md'}`}>{intent}</p>
        </motion.div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`text-[6rem] md:text-[9rem] font-light tracking-tighter opacity-90 tabular-nums ${!isDarkText && 'drop-shadow-lg'}`}
        >
          {hours > 0 ? `${hours}:` : ""}{minutes}:{seconds}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <button
            onClick={() => {
              if (window.confirm("确定要放弃当前的专注吗？深呼吸一次再做决定吧。")) {
                const actualTime = initialDuration - timeLeft;
                // 保存部分记录
                try {
                  const saved = localStorage.getItem("focus_records");
                  const records = saved ? JSON.parse(saved) : [];
                  if (actualTime > 0) {
                    records.push({
                      id: crypto.randomUUID(),
                      intent: intent + " (未完成)",
                      duration: actualTime,
                      timestamp: Date.now()
                    });
                    localStorage.setItem("focus_records", JSON.stringify(records));
                  }
                } catch (err) {}
                onEnd(false, actualTime);
              }
            }}
            className="text-xs opacity-40 hover:opacity-100 transition-opacity tracking-widest border-b border-transparent hover:border-current pb-1"
          >
            放弃
          </button>
        </motion.div>
      </div>
    </div>
  );
}
