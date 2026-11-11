import React, { useState, useEffect, useRef } from 'react';
import { 
  Rotate3d, Sparkles, MoveHorizontal, Info, Eye, 
  ChevronLeft, ChevronRight, Play, Pause, ZoomIn 
} from 'lucide-react';
import api from '../../api/axios';

export default function SpinViewer360Modal({ isOpen, onClose, productId = 1 }) {
  const [spinData, setSpinData] = useState(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState(null);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const autoSpinTimerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchSpinData();
    }
  }, [isOpen, productId]);

  const fetchSpinData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/spin-viewer/data?product_id=${productId}`);
      if (res.data?.success) {
        setSpinData(res.data.spin_data);
        setCurrentFrame(0);
      }
    } catch (err) {
      console.error('Failed to load spin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-Spin rotation loop
  useEffect(() => {
    if (isAutoSpinning && spinData?.frames?.length > 0) {
      autoSpinTimerRef.current = setInterval(() => {
        setCurrentFrame(prev => (prev + 1) % spinData.frames.length);
      }, 300);
    } else {
      clearInterval(autoSpinTimerRef.current);
    }
    return () => clearInterval(autoSpinTimerRef.current);
  }, [isAutoSpinning, spinData]);

  // Touch and Mouse drag handlers
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX || (e.touches && e.touches[0].clientX);
    setIsAutoSpinning(false);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !spinData?.frames?.length) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const deltaX = clientX - startXRef.current;

    // Ngưỡng 15px chuyển 1 khung hình
    if (Math.abs(deltaX) > 15) {
      const step = deltaX > 0 ? -1 : 1;
      setCurrentFrame(prev => {
        const next = prev + step;
        if (next < 0) return spinData.frames.length - 1;
        if (next >= spinData.frames.length) return 0;
        return next;
      });
      startXRef.current = clientX;
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  if (!isOpen) return null;

  const currentHotspots = spinData?.hotspots?.filter(h => h.frame === currentFrame) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-zinc-950 border border-white/20 rounded-3xl shadow-2xl p-6 md:p-8 text-white overflow-hidden flex flex-col items-center"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="w-full flex justify-between items-center pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-400">
              <Rotate3d size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">360° CRAFTSMANSHIP INSPECTION</span>
              <h2 className="text-base font-serif uppercase tracking-tight text-white">{spinData?.name || 'Sản phẩm 360°'}</h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10"
          >
            Đóng [×]
          </button>
        </div>

        {/* 360 Viewport */}
        {loading || !spinData ? (
          <div className="h-[420px] flex flex-col items-center justify-center text-zinc-500">
            <div className="w-7 h-7 border-2 border-white/20 border-t-white rounded-full animate-spin mb-3" />
            <p className="text-xs uppercase tracking-widest text-zinc-400">Đang khởi tạo góc quay 3D...</p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* Draggable Image Frame Canvas */}
            <div 
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
              className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 cursor-grab active:cursor-grabbing select-none group shadow-2xl bg-black"
            >
              <img 
                src={spinData.frames[currentFrame]} 
                alt="360 Frame"
                className="w-full h-full object-cover pointer-events-none"
              />

              {/* Drag Indicator Overlay */}
              <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none">
                <span className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono uppercase tracking-widest text-zinc-300 border border-white/15 flex items-center gap-1.5 shadow-lg">
                  <MoveHorizontal size={13} className="text-amber-400 animate-pulse" /> Kéo ngang để xoay 360°
                </span>
              </div>

              {/* Craftsmanship Hotspots Pins */}
              {currentHotspots.map((spot, sIdx) => (
                <div
                  key={sIdx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHotspot(spot);
                  }}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-20 group/pin"
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                >
                  <span className="relative flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-amber-500 border-2 border-white items-center justify-center text-[10px] font-bold text-black shadow-lg">
                      +
                    </span>
                  </span>
                </div>
              ))}
            </div>

            {/* Hotspot Inspection Modal / Card */}
            {activeHotspot && (
              <div className="mt-4 p-3.5 rounded-xl bg-white/10 border border-white/20 text-xs w-full max-w-md animate-in fade-in flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Info size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white">{activeHotspot.title}</h4>
                    <p className="text-zinc-300 font-light mt-0.5">{activeHotspot.desc}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveHotspot(null)} 
                  className="text-zinc-400 hover:text-white text-xs font-mono"
                >
                  [×]
                </button>
              </div>
            )}

            {/* Rotation Controls Bar */}
            <div className="w-full max-w-md flex items-center justify-between gap-3 mt-4 pt-3 border-t border-white/10 text-xs font-mono">
              <span className="text-zinc-400">
                Góc: {currentFrame + 1} / {spinData.frames.length} ({Math.round(((currentFrame + 1) / spinData.frames.length) * 360)}°)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoSpinning(!isAutoSpinning)}
                  className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                    isAutoSpinning ? 'bg-amber-400 text-black border-amber-400 font-semibold' : 'border-white/15 bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  {isAutoSpinning ? <><Pause size={12} /> Dừng Xoay</> : <><Play size={12} /> Tự Động Xoay</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
