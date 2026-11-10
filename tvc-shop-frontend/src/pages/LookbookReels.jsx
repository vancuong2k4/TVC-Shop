import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Heart, Share2, ShoppingBag, 
  ChevronUp, ChevronDown, Sparkles, Check, ArrowRight, Eye, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function LookbookReels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [likedReels, setLikedReels] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const videoRefs = useRef([]);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      setLoading(true);
      const res = await api.get('/video-reels');
      if (res.data?.success) {
        setReels(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load video reels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === activeIndex) {
          video.currentTime = 0;
          if (isPlaying) {
            video.play().catch(() => {});
          }
        } else {
          video.pause();
        }
      }
    });
  }, [activeIndex, isPlaying]);

  const togglePlay = () => {
    const currentVideo = videoRefs.current[activeIndex];
    if (!currentVideo) return;
    if (isPlaying) {
      currentVideo.pause();
      setIsPlaying(false);
    } else {
      currentVideo.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRefs.current.forEach(v => {
      if (v) v.muted = !isMuted;
    });
  };

  const handleLike = (id) => {
    setLikedReels(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleShare = (reel) => {
    const shareUrl = window.location.origin + `/lookbook?reel=${reel.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(reel.id);
    showToast('Đã sao chép liên kết video lookbook!', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleQuickAdd = async (product) => {
    try {
      await addToCart(product, 1, product.size || 'M', product.color || 'Black');
      showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
    } catch {
      showToast('Không thể thêm vào giỏ hàng', 'error');
    }
  };

  const nextReel = () => {
    if (activeIndex < reels.length - 1) {
      setActiveIndex(prev => prev + 1);
    }
  };

  const prevReel = () => {
    if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    }
  };

  const currentReel = reels[activeIndex];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 max-w-7xl mx-auto px-4 w-full flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-8 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs uppercase tracking-widest text-zinc-300 mb-3">
            <Sparkles size={13} className="text-amber-400" />
            Shoppable Video Editorial
          </div>
          <h1 className="text-3xl md:text-5xl font-serif tracking-tight uppercase">
            Lookbook Reels
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-2 font-light tracking-wide">
            Trải nghiệm thời trang thị giác đa chiều. Chạm để xem và sở hữu ngay trang phục trên sàn diễn.
          </p>
        </div>

        {loading ? (
          <div className="h-[600px] w-full max-w-md flex flex-col items-center justify-center border border-white/10 rounded-2xl bg-zinc-950/60">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest text-zinc-400">Đang tải sàn diễn video...</p>
          </div>
        ) : reels.length === 0 ? (
          <div className="h-[400px] flex items-center justify-center text-zinc-500 text-sm">
            Hiện chưa có Lookbook Reel nào.
          </div>
        ) : (
          <div className="relative w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-8">
            {/* Reels Video Feed Viewport */}
            <div className="relative w-full max-w-[380px] h-[640px] bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl border border-white/15 flex items-center justify-center group">
              <video
                ref={el => (videoRefs.current[activeIndex] = el)}
                src={currentReel?.video_url}
                poster={currentReel?.thumbnail}
                loop
                playsInline
                muted={isMuted}
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer"
              />

              {/* Gradient overlays */}
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

              {/* Center Play Indicator */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/30 cursor-pointer pointer-events-auto transition-transform active:scale-95"
                >
                  <Play size={28} className="translate-x-0.5 fill-white" />
                </div>
              )}

              {/* Right Side Social Actions */}
              <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4 z-20">
                <button
                  onClick={() => handleLike(currentReel.id)}
                  className="flex flex-col items-center gap-1 group/btn"
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
                    likedReels[currentReel.id] 
                      ? 'bg-rose-500/20 border-rose-500 text-rose-500 scale-105' 
                      : 'bg-black/40 border-white/20 text-white hover:border-white/40'
                  }`}>
                    <Heart 
                      size={20} 
                      className={likedReels[currentReel.id] ? 'fill-rose-500 stroke-rose-500' : ''} 
                    />
                  </div>
                  <span className="text-[11px] font-medium text-zinc-300">
                    {likedReels[currentReel.id] ? currentReel.likes_count + 1 : currentReel.likes_count}
                  </span>
                </button>

                <button
                  onClick={() => handleShare(currentReel)}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-11 h-11 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white hover:border-white/40 backdrop-blur-md transition-all">
                    {copiedId === currentReel.id ? <Check size={18} className="text-emerald-400" /> : <Share2 size={18} />}
                  </div>
                  <span className="text-[11px] font-medium text-zinc-300">Share</span>
                </button>

                <button
                  onClick={toggleMute}
                  className="w-11 h-11 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white hover:border-white/40 backdrop-blur-md transition-all"
                >
                  {isMuted ? <VolumeX size={18} className="text-zinc-400" /> : <Volume2 size={18} className="text-amber-400" />}
                </button>
              </div>

              {/* Reel Info & Shoppable Tag Bottom Bar */}
              <div className="absolute inset-x-4 bottom-4 z-20 pointer-events-auto">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase tracking-widest text-zinc-300 font-medium">
                    {currentReel.author}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-zinc-300 border border-white/10 flex items-center gap-1">
                    <Eye size={11} /> {currentReel.views_count}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white tracking-wide mb-1 line-clamp-1">
                  {currentReel.title}
                </h3>
                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-3">
                  {currentReel.description}
                </p>

                {/* Shoppable Product Pill */}
                {currentReel.product && (
                  <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl p-2.5 flex items-center gap-3">
                    <img 
                      src={currentReel.product.image || currentReel.thumbnail} 
                      alt={currentReel.product.name}
                      className="w-11 h-11 rounded-lg object-cover border border-white/15"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase text-zinc-400 tracking-wider font-medium">Sản phẩm trong video</p>
                      <h4 className="text-xs text-white font-medium truncate">{currentReel.product.name}</h4>
                      <p className="text-xs font-semibold text-white mt-0.5">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentReel.product.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleQuickAdd(currentReel.product)}
                      className="p-2.5 rounded-lg bg-white text-black hover:bg-zinc-200 transition-colors flex-shrink-0"
                      title="Thêm nhanh vào giỏ hàng"
                    >
                      <ShoppingBag size={15} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Control Panel & Playlist */}
            <div className="w-full max-w-sm flex flex-col gap-4">
              <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                    REEL {activeIndex + 1} / {reels.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={prevReel}
                      disabled={activeIndex === 0}
                      className="p-2 rounded-lg border border-white/15 bg-zinc-900 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={nextReel}
                      disabled={activeIndex === reels.length - 1}
                      className="p-2 rounded-lg border border-white/15 bg-zinc-900 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                </div>

                {/* Current Active Product Details */}
                {currentReel?.product && (
                  <div className="border border-white/10 rounded-xl p-4 bg-zinc-900/60 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs uppercase tracking-wider text-zinc-300">Đặc sắc lookbook</span>
                    </div>
                    <h3 className="text-base font-serif text-white tracking-wide mb-1">
                      {currentReel.product.name}
                    </h3>
                    <p className="text-sm font-semibold text-zinc-200 mb-3">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentReel.product.price)}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuickAdd(currentReel.product)}
                        className="flex-1 py-2.5 px-3 bg-white text-black text-xs uppercase tracking-wider font-semibold rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag size={14} /> Thêm Giỏ Hàng
                      </button>
                      <Link
                        to={`/product/${currentReel.product.id}`}
                        className="py-2.5 px-3 border border-white/20 text-zinc-300 text-xs rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center"
                      >
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                )}

                {/* All playlist items mini list */}
                <h4 className="text-xs uppercase tracking-widest text-zinc-400 mb-3">Sàn Diễn Tuyển Chọn</h4>
                <div className="space-y-2">
                  {reels.map((reel, index) => (
                    <div
                      key={reel.id}
                      onClick={() => setActiveIndex(index)}
                      className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        index === activeIndex 
                          ? 'border-white bg-white/10' 
                          : 'border-white/5 bg-zinc-900/40 hover:border-white/20'
                      }`}
                    >
                      <img 
                        src={reel.thumbnail} 
                        alt={reel.title} 
                        className="w-12 h-16 object-cover rounded-md border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white font-medium truncate">{reel.title}</p>
                        <p className="text-[11px] text-zinc-400 truncate">{reel.author}</p>
                        <span className="text-[10px] text-zinc-500 mt-1 block">Views: {reel.views_count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
