"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Music, BookOpen, Pencil, MousePointerClick, Upload, FileAudio } from "lucide-react";

export const AUDIO_TRACKS = [
  { id: "word", name: "单词", url: "/audio/单词.mp3", icon: BookOpen },
  { id: "pencil", name: "铅笔", url: "/audio/铅笔.mp3", icon: Pencil },
  { id: "tap", name: "敲击", url: "/audio/敲击.mp3", icon: MousePointerClick },
];

export default function AudioWidget({ isInteracted }: { isInteracted: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [customTracks, setCustomTracks] = useState<{ id: string, name: string, url: string, icon: any }[]>([]);
  const [currentTrack, setCurrentTrack] = useState<{ id: string, name: string, url: string, icon: any }>(AUDIO_TRACKS[0]);
  const [isDragging, setIsDragging] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // 当用户在首页发生交互后，自动解除静音并尝试播放
  useEffect(() => {
    if (isInteracted && audioRef.current && isMuted) {
      setIsMuted(false);
      audioRef.current.play().catch(() => console.log("Autoplay blocked"));
    }
  }, [isInteracted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // 背景音量设置得柔和一些
      if (isMuted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => console.log("Play blocked"));
      }
    }
  }, [isMuted, currentTrack]);

  // 处理文件上传
  const handleFileUpload = (files: FileList | File[]) => {
    const newTracks: { id: string, name: string, url: string, icon: any }[] = [];
    
    Array.from(files).forEach((file) => {
      if (file && file.type.startsWith("audio/")) {
        const url = URL.createObjectURL(file);
        newTracks.push({
          id: `custom-${crypto.randomUUID()}`,
          name: file.name.length > 15 ? file.name.substring(0, 15) + "..." : file.name,
          url: url,
          icon: FileAudio
        });
      }
    });

    if (newTracks.length > 0) {
      setCustomTracks((prev) => [...prev, ...newTracks]);
      setCurrentTrack(newTracks[0]); // 默认播放新上传的第一首
      if (isMuted) setIsMuted(false);
    } else {
      alert("请上传有效的音频文件 (如 .mp3, .wav 等)。");
    }
  };

  const handleTrackEnd = () => {
    const isCustom = customTracks.some(t => t.id === currentTrack.id);
    if (isCustom && customTracks.length > 1) {
      // 播放列表的下一首
      const currentIndex = customTracks.findIndex(t => t.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % customTracks.length;
      setCurrentTrack(customTracks[nextIndex]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // 列表包含内置音乐和用户上传的自定义音乐
  const allTracks = [...AUDIO_TRACKS, ...customTracks];
  const isCurrentTrackCustom = customTracks.some(t => t.id === currentTrack.id);
  const shouldLoop = !isCurrentTrackCustom || customTracks.length <= 1;

  return (
    <div ref={containerRef} className="fixed bottom-8 right-8 z-50 flex flex-col items-end space-y-4">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        loop={shouldLoop}
        onEnded={handleTrackEnd}
        playsInline
      />
      
      {isOpen && (
        <div className="bg-warmwhite/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-khaki-light/50 flex flex-col space-y-3 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-300 w-48">
          <p className="text-xs text-text-brown/50 tracking-widest uppercase mb-1">环境音</p>
          
          <div className="flex flex-col space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {AUDIO_TRACKS.map((track) => {
              const Icon = track.icon;
              const isActive = currentTrack.id === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => {
                    setCurrentTrack(track);
                    if (isMuted) setIsMuted(false);
                  }}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-300 w-full ${
                    isActive ? "bg-khaki-dark/20 text-text-brown" : "text-text-brown/50 hover:bg-khaki-light/30 hover:text-text-brown/80"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-sm tracking-widest truncate">{track.name}</span>
                </button>
              );
            })}

            {customTracks.length > 0 && (
              <>
                <div className="w-full border-t border-dashed border-khaki-dark/30 my-1" />
                {customTracks.map((track) => {
                  const Icon = track.icon;
                  const isActive = currentTrack.id === track.id;
                  return (
                    <button
                      key={track.id}
                      onClick={() => {
                        setCurrentTrack(track);
                        if (isMuted) setIsMuted(false);
                      }}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-300 w-full ${
                        isActive ? "bg-khaki-dark/20 text-text-brown" : "text-text-brown/50 hover:bg-khaki-light/30 hover:text-text-brown/80"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-sm tracking-widest truncate">{track.name}</span>
                    </button>
                  );
                })}
              </>
            )}
          </div>

          <div className="h-px w-full bg-khaki-light/50 my-2" />

          {/* Upload Custom Audio Button / Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl transition-all duration-300 text-center ${
              isDragging ? "border-khaki-dark bg-khaki-light/40 scale-[1.02]" : "border-khaki-light hover:border-khaki-dark hover:bg-khaki-light/20"
            }`}
          >
            <input
              type="file"
              accept="audio/*"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileUpload(e.target.files);
                }
                e.target.value = ""; // Reset input so same file can be selected again
              }}
            />
            <Upload className={`w-5 h-5 mb-2 transition-colors ${isDragging ? "text-khaki-dark" : "text-text-brown/40"}`} />
            <span className="text-xs text-text-brown/60 leading-tight whitespace-pre-line pointer-events-none">
              {isDragging ? "松开添加文件" : "点击或拖拽\n添加自定义音乐"}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3">
        {/* Mute Toggle */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="w-12 h-12 rounded-full bg-khaki-light/30 backdrop-blur-md flex items-center justify-center text-text-brown/70 hover:text-text-brown hover:bg-khaki-light/60 transition-all duration-300 shadow-sm hover:scale-105"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {/* Track Selector Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105 ${
            isOpen ? "bg-khaki-dark text-white" : "bg-khaki-light/30 text-text-brown/70 hover:text-text-brown hover:bg-khaki-light/60"
          }`}
        >
          <Music className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
