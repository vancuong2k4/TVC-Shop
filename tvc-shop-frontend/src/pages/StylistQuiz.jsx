import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Check, ArrowRight, RotateCcw, ShoppingBag, 
  Share2, ShieldCheck, HelpCircle, Palette, Flame, Eye 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../api/axios';
import { formatPrice } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function StylistQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await api.get('/stylist-quiz/questions');
      if (res.data?.success) {
        setQuestions(res.data.questions || []);
      }
    } catch (err) {
      console.error('Failed to load stylist quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionValue) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionValue
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleAnalyze();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      const answersArray = Object.values(selectedAnswers);
      const res = await api.post('/stylist-quiz/analyze', {
        answers: answersArray
      });

      if (res.data?.success) {
        setResult(res.data);
        showToast('Đã giải mã thành công hồ sơ thẩm mỹ cá nhân của bạn!', 'success');
      }
    } catch {
      showToast('Có lỗi xảy ra khi phân tích phong cách', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentStep(0);
    setResult(null);
  };

  const handleQuickAdd = async (product) => {
    try {
      await addToCart(product, 1, 'M', 'Black');
      showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
    } catch {
      showToast('Không thể thêm sản phẩm', 'error');
    }
  };

  const currentQ = questions[currentStep];
  const isCurrentAnswered = currentQ && selectedAnswers[currentQ.id];
  const progressPercent = questions.length > 0 ? Math.round(((currentStep + 1) / questions.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 max-w-4xl mx-auto px-4 md:px-8 w-full flex flex-col items-center">
        {loading ? (
          <div className="h-[450px] flex flex-col items-center justify-center text-zinc-500">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest text-zinc-400">Đang khởi tạo studio khảo sát...</p>
          </div>
        ) : analyzing ? (
          <div className="h-[450px] flex flex-col items-center justify-center text-center">
            <div className="relative w-16 h-16 mb-6">
              <div className="w-16 h-16 border-2 border-white/20 border-t-amber-400 rounded-full animate-spin" />
              <Sparkles size={20} className="absolute inset-0 m-auto text-amber-400" />
            </div>
            <h3 className="text-xl font-serif uppercase tracking-tight mb-2">Đang Giải Mã Khí Chất Thời Trang</h3>
            <p className="text-xs text-zinc-400 max-w-sm font-light">
              AI Stylist đang đối chiếu các lựa chọn màu sắc, cấu trúc và xúc giác vải để phác thảo chân dung thẩm mỹ độc bản của bạn...
            </p>
          </div>
        ) : result ? (
          /* Result View */
          <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs font-mono uppercase tracking-widest text-amber-300 mb-3">
                <Sparkles size={13} />
                Chân Dung Thẩm Mỹ Của Bạn
              </div>
              <h1 className="text-3xl md:text-5xl font-serif tracking-tight uppercase mb-2">
                {result.archetype?.name}
              </h1>
              <p className="text-sm font-mono text-zinc-400 uppercase tracking-widest">
                "{result.archetype?.tagline}"
              </p>
            </div>

            {/* Archetype Description Card */}
            <div className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-white/15 backdrop-blur-md mb-8 shadow-2xl">
              <p className="text-sm text-zinc-300 font-light leading-relaxed mb-6">
                {result.archetype?.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10 text-xs font-mono">
                <div>
                  <span className="text-[10px] uppercase text-zinc-400 block mb-2">Trang Phục Nhận Diện (Signature Pieces):</span>
                  <p className="text-zinc-200 font-sans">{result.archetype?.signature_pieces}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-zinc-400 block mb-2">Bảng Màu Chủ Đạo:</span>
                  <div className="flex items-center gap-2">
                    {result.archetype?.color_palette?.map((hex, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-zinc-900 px-2 py-1 rounded border border-white/10">
                        <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: hex }} />
                        <span className="text-[10px] text-zinc-400">{hex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Do & Don't Styling Advice */}
              {result.styling_advice && (
                <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    <span className="font-bold block mb-1 font-mono uppercase tracking-wider">LỜI KHUYÊN NÊN:</span>
                    <p className="font-light text-zinc-300 leading-relaxed">{result.styling_advice.Do}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                    <span className="font-bold block mb-1 font-mono uppercase tracking-wider">NÊN TRÁNH:</span>
                    <p className="font-light text-zinc-300 leading-relaxed">{result.styling_advice.Dont}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Recommended Capsule Wardrobe */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-300">
                  Tuyển Tập Sản Phẩm Đề Xuất Dành Riêng Cho Bạn
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {result.recommended_products?.map((prod) => (
                  <div 
                    key={prod.id}
                    className="p-3.5 rounded-2xl bg-zinc-950/80 border border-white/10 flex flex-col justify-between group hover:border-white/30 transition-all"
                  >
                    <div>
                      <div className="aspect-[4/5] rounded-xl overflow-hidden mb-3 relative">
                        <img 
                          src={prod.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400'} 
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h4 className="text-xs font-semibold text-white truncate mb-1">
                        {prod.name}
                      </h4>
                      <p className="text-xs font-mono font-bold text-zinc-300 mb-3">
                        {formatPrice(prod.discount_price || prod.price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuickAdd(prod)}
                        className="flex-1 py-2 rounded-lg bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag size={13} /> Thêm Giỏ
                      </button>
                      <Link
                        to={`/product/${prod.id}`}
                        className="p-2 rounded-lg border border-white/20 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleRestart}
                className="px-6 py-3 rounded-xl border border-white/20 text-zinc-300 text-xs font-semibold uppercase tracking-wider hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <RotateCcw size={14} /> Làm Lại Khảo Sát
              </button>
              <Link
                to="/shop"
                className="px-8 py-3 rounded-xl bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-zinc-200 transition-colors flex items-center gap-2"
              >
                Khám Phá Toàn Bộ Cửa Hàng <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          /* Step Question View */
          <div className="w-full max-w-2xl">
            {/* Step Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-zinc-400 uppercase tracking-widest">
                  CÂU HỎI {currentStep + 1} / {questions.length}
                </span>
                <span className="text-amber-400 font-semibold">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-200 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Question Header */}
            {currentQ && (
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-serif text-white tracking-tight uppercase mb-2">
                  {currentQ.question}
                </h2>
                <p className="text-xs text-zinc-400 font-light">
                  {currentQ.description}
                </p>
              </div>
            )}

            {/* Options List */}
            <div className="space-y-3.5 mb-8">
              {currentQ?.options?.map((opt) => {
                const isSelected = selectedAnswers[currentQ.id] === opt.value;

                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectOption(currentQ.id, opt.value)}
                    className={`w-full p-4 md:p-5 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                      isSelected 
                        ? 'border-white bg-white/15 shadow-xl scale-[1.01]' 
                        : 'border-white/10 bg-zinc-950/70 hover:border-white/30'
                    }`}
                  >
                    <div className="pr-4">
                      <h4 className={`text-sm font-semibold tracking-wide mb-1 ${isSelected ? 'text-white' : 'text-zinc-200 group-hover:text-white'}`}>
                        {opt.title}
                      </h4>
                      <p className="text-xs text-zinc-400 font-light">
                        {opt.subtitle}
                      </p>
                    </div>

                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected 
                        ? 'bg-white border-white text-black' 
                        : 'border-white/20 text-transparent group-hover:border-white/40'
                    }`}>
                      <Check size={14} strokeWidth={3} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="px-5 py-2.5 rounded-xl border border-white/15 text-xs uppercase tracking-wider text-zinc-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                Quay Lại
              </button>

              <button
                onClick={handleNext}
                disabled={!isCurrentAnswered}
                className="px-8 py-3 rounded-xl bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-zinc-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
              >
                {currentStep === questions.length - 1 ? (
                  <>Xem Kết Quả Thẩm Mỹ <Sparkles size={14} className="text-amber-500" /></>
                ) : (
                  <>Tiếp Tục <ArrowRight size={14} /></>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
