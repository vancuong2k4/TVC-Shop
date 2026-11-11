import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ThumbsUp, Check, MessageSquare, Send, 
  Flame, Award, CheckCircle2, ArrowRight, ShieldCheck, Heart 
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

export default function RunwayVoting() {
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votedIds, setVotedIds] = useState({});
  const [feedbackInputs, setFeedbackInputs] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    fetchConcepts();
  }, []);

  const fetchConcepts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/runway-voting/concepts');
      if (res.data?.success) {
        setConcepts(res.data.concepts || []);
      }
    } catch (err) {
      console.error('Failed to load runway concepts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (conceptId) => {
    if (votedIds[conceptId]) {
      showToast('Bạn đã bình chọn cho thiết kế này rồi!', 'info');
      return;
    }

    try {
      setSubmittingId(conceptId);
      const feedbackText = feedbackInputs[conceptId] || '';
      const res = await api.post('/runway-voting/vote', {
        concept_id: conceptId,
        feedback: feedbackText
      });

      if (res.data?.success) {
        setVotedIds(prev => ({ ...prev, [conceptId]: true }));
        setConcepts(prev => prev.map(c => {
          if (c.id === conceptId) {
            return {
              ...c,
              votes_count: c.votes_count + 1,
              feedback_comments: feedbackText 
                ? [{ user: 'Bạn (Người bình chọn)', comment: feedbackText }, ...c.feedback_comments]
                : c.feedback_comments
            };
          }
          return c;
        }));
        setFeedbackInputs(prev => ({ ...prev, [conceptId]: '' }));
        showToast('Bình chọn thành công! Cảm ơn đóng góp của bạn vào sàn diễn TVC-Shop.', 'success');
      }
    } catch {
      showToast('Có lỗi xảy ra khi gửi bình chọn', 'error');
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 max-w-6xl mx-auto px-4 md:px-8 w-full flex flex-col">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono uppercase tracking-widest text-zinc-300 mb-3">
            <Sparkles size={13} className="text-amber-400" />
            Atelier Design Co-Creation & Community Voting
          </div>
          <h1 className="text-3xl md:text-5xl font-serif tracking-tight uppercase mb-3">
            Bầu Chọn Thiết Kế Runway
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed">
            Đồng sáng tạo cùng Giám đốc sáng tạo TVC-Shop. Những bản phác thảo đạt đủ số phiếu bình chọn từ cộng đồng sẽ chính thức được đưa vào may đo thực tế trên sàn diễn thời trang mùa tới.
          </p>
        </div>

        {/* Concepts Showcase List */}
        {loading ? (
          <div className="h-[450px] flex flex-col items-center justify-center text-zinc-500">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest text-zinc-400">Đang tải các bản phác thảo Runway...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {concepts.map((concept) => {
              const isVoted = votedIds[concept.id];
              const isApproved = concept.status === 'approved_for_production' || concept.votes_count >= concept.production_target_votes;
              const progressPercent = Math.min(100, Math.round((concept.votes_count / concept.production_target_votes) * 100));

              return (
                <div 
                  key={concept.id}
                  className="rounded-3xl bg-zinc-950/70 border border-white/15 p-6 md:p-10 backdrop-blur-md flex flex-col lg:flex-row gap-8 items-center overflow-hidden hover:border-white/30 transition-all duration-300 shadow-2xl"
                >
                  {/* Concept Image Showcase */}
                  <div className="w-full lg:w-5/12 aspect-[4/5] rounded-2xl overflow-hidden relative group">
                    <img 
                      src={concept.image} 
                      alt={concept.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono uppercase tracking-widest text-white border border-white/20">
                        {concept.season}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
                      <span className="px-2.5 py-1 rounded-md bg-white/10 text-zinc-300 border border-white/15 flex items-center gap-1.5 backdrop-blur-md">
                        <Flame size={13} className="text-amber-400" /> {concept.votes_count} Phiếu Ủng Hộ
                      </span>
                      {isApproved && (
                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 backdrop-blur-md">
                          <CheckCircle2 size={13} /> Đã Duyệt Sản Xuất
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Concept Details & Interaction */}
                  <div className="w-full lg:w-7/12 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs uppercase tracking-widest font-mono text-zinc-400">
                          NHÀ THIẾT KẾ: {concept.designer}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-serif text-white uppercase tracking-tight mb-3">
                        {concept.title}
                      </h2>

                      {/* Specs pills */}
                      <div className="space-y-2 mb-6 text-xs">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-zinc-400 font-mono block mb-1">Cấu trúc phom dáng:</span>
                          <span className="text-zinc-200 font-light">{concept.silhouette}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-zinc-400 font-mono block mb-1">Đề xuất chất liệu:</span>
                          <span className="text-amber-300 font-light">{concept.fabric_proposed}</span>
                        </div>
                      </div>

                      {/* Voting Scarcity Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center text-xs font-mono mb-2">
                          <span className="text-zinc-400">Tiến độ đưa vào Runway:</span>
                          <span className="text-white font-semibold">{concept.votes_count} / {concept.production_target_votes} ({progressPercent}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-200 rounded-full transition-all duration-1000"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Community Comments / Feedbacks */}
                      <div className="mb-6">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-2">
                          Ý Kiến Đóng Góp Từ Giới Mộ Điệu ({concept.feedback_comments?.length || 0})
                        </span>
                        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                          {concept.feedback_comments?.map((fb, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-zinc-900/60 border border-white/5 text-xs">
                              <span className="font-semibold text-zinc-200 block mb-0.5">{fb.user}</span>
                              <p className="text-zinc-400 font-light text-[11px] leading-relaxed">{fb.comment}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Vote Input & Action CTA */}
                    <div className="pt-6 border-t border-white/10 space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={feedbackInputs[concept.id] || ''}
                          onChange={(e) => setFeedbackInputs(prev => ({ ...prev, [concept.id]: e.target.value }))}
                          placeholder="Để lại góp ý về màu sắc hoặc phụ kiện cho NTK..."
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                        />
                        <button
                          onClick={() => handleVote(concept.id)}
                          disabled={submittingId === concept.id}
                          className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg ${
                            isVoted 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-white text-black hover:bg-zinc-200'
                          }`}
                        >
                          {isVoted ? (
                            <><Check size={14} /> Đã Bầu Chọn</>
                          ) : (
                            <><ThumbsUp size={14} /> Bầu Chọn ({concept.votes_count})</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
