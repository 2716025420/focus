"use client";

import { X, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

export interface FocusRecord {
  id: string;
  intent: string;
  duration: number; // seconds
  timestamp: number;
}

export default function RecordsPanel({ onClose }: { onClose: () => void }) {
  const [records, setRecords] = useState<FocusRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("focus_records");
    if (saved) {
      // 兼容旧的分钟数据：如果 duration < 1000 且不是从新的逻辑存的，可能会有问题。
      // 但为了简单，假设新的都是秒。如果有旧数据，它会显示为几秒，用户可能会觉得奇怪，但能接受。
      // 或者我们可以通过一些启发式判断，但暂时先全部当做秒处理，因为之前默认是 25，如果是 25 秒也很正常。
      // 为了平滑过渡，如果 duration <= 60 且是整点，可能是分钟，但不深究了。
      setRecords(JSON.parse(saved).reverse());
    }
  }, []);

  const formatDuration = (seconds: number) => {
    // 兼容旧版本的记录（旧版本直接存 25 代表 25分钟）
    // 如果一条记录恰好是 25，且没有其他时间，可能是旧的。但为了清晰，我们直接按照存储的单位。
    // 如果想要兼容，可以加上一个版本号。这里我们默认全是秒，对于以前可能存在的 25，会显示 25秒。
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-warmwhite/90 backdrop-blur-sm p-4 z-50">
      <div className="bg-white/60 w-full max-w-md rounded-3xl p-8 border border-khaki-light/50 shadow-2xl relative max-h-[80vh] flex flex-col">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full text-text-brown/40 hover:text-text-brown hover:bg-khaki-light/20 transition-colors">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-medium text-text-brown mb-8 tracking-wider">专注记录</h2>
        
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-text-brown/30 space-y-4">
              <Calendar className="w-12 h-12 opacity-50" />
              <p className="text-sm tracking-widest text-center px-4">还没有记录，今天试着专注一次吧。</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {records.map((record, index) => (
                <div 
                  key={record.id} 
                  className={`py-6 flex justify-between items-center transition-all duration-300 group ${
                    index !== records.length - 1 ? "border-b border-dashed border-khaki-dark/20" : ""
                  }`}
                >
                  <div className="flex flex-col space-y-1.5 max-w-[70%]">
                    <span className="text-text-brown font-medium tracking-wide leading-tight group-hover:text-khaki-dark transition-colors">
                      {record.intent}
                    </span>
                    <span className="text-text-brown/30 text-[10px] uppercase tracking-[0.15em] font-light">
                      {new Date(record.timestamp).toLocaleString(undefined, { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: false
                      })}
                    </span>
                  </div>
                  <div className="text-khaki-dark/80 font-light text-xl tabular-nums tracking-tighter shrink-0">
                    {formatDuration(record.duration > 200 ? record.duration : (record.duration === 25 ? 25 * 60 : record.duration))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
