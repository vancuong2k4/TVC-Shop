import React, { useState } from 'react';
import { Sparkles, X, Check, ArrowRight, Ruler, HelpCircle } from 'lucide-react';

const SizeRecommenderModal = ({ isOpen, onClose, onSelectSize, availableSizes = ['S', 'M', 'L', 'XL'] }) => {
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState('female');
  const [height, setHeight] = useState(165);
  const [weight, setWeight] = useState(52);
  const [fitPreference, setFitPreference] = useState('regular'); // 'slim', 'regular', 'relaxed'
  const [recommendation, setRecommendation] = useState(null);

  if (!isOpen) return null;

  const calculateRecommendation = () => {
    let recSize = 'M';
    let confidence = 95;
    let note = '';

    const bmi = weight / ((height / 100) * (height / 100));

    if (gender === 'male') {
      if (height < 165) {
        recSize = weight < 60 ? 'S' : 'M';
      } else if (height <= 173) {
        recSize = weight < 65 ? 'M' : 'L';
      } else if (height <= 180) {
        recSize = weight < 75 ? 'L' : 'XL';
      } else {
        recSize = 'XL';
      }
    } else {
      // Female
      if (height < 155) {
        recSize = weight < 48 ? 'S' : 'M';
      } else if (height <= 163) {
        recSize = weight < 53 ? 'S' : 'M';
      } else if (height <= 170) {
        recSize = weight < 58 ? 'M' : 'L';
      } else {
        recSize = weight < 65 ? 'L' : 'XL';
      }
    }

    // Adjust for fit preference
    if (fitPreference === 'relaxed') {
      if (recSize === 'S' && availableSizes.includes('M')) recSize = 'M';
      else if (recSize === 'M' && availableSizes.includes('L')) recSize = 'L';
      else if (recSize === 'L' && availableSizes.includes('XL')) recSize = 'XL';
      note = 'Đã cộng thêm 1 size để đảm bảo form áo/quần suông rộng thoải mái (Relaxed Fit).';
    } else if (fitPreference === 'slim') {
      note = 'Kích cỡ vừa vặn tôn dáng, ôm nhẹ tự nhiên theo đường cong cơ thể (Slim Fit).';
    } else {
      note = 'Form dáng chuẩn mực cân đối, vừa vặn hoàn hảo theo bảng size tiêu chuẩn TVC-Shop.';
    }

    // Đảm bảo size gợi ý nằm trong danh sách size hiện có
    if (!availableSizes.includes(recSize) && availableSizes.length > 0) {
      recSize = availableSizes[0];
    }

    setRecommendation({
      size: recSize,
      confidence: Math.round(confidence - (fitPreference === 'relaxed' ? 2 : 0)),
      bmi: bmi.toFixed(1),
      note
    });
    setStep(2);
  };

  const handleApply = () => {
    if (recommendation && onSelectSize) {
      onSelectSize(recommendation.size);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white max-w-md w-full p-6 md:p-8 shadow-2xl border border-black/10 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors"
        >
          <X size={20} />
        </button>

        {step === 1 ? (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-[0.2em] mb-2">
                <Sparkles size={11} className="text-amber-300" />
                <span>Smart Size Advisor</span>
              </div>
              <h3 className="font-serif text-xl font-bold uppercase tracking-tight text-black">
                Gợi Ý Size Chuẩn Xác
              </h3>
              <p className="text-xs text-gray-500 font-light mt-1">
                Nhập chiều cao và cân nặng để hệ thống đề xuất size vừa vặn nhất cho bạn.
              </p>
            </div>

            {/* Gender Toggle */}
            <div className="mb-6">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">
                Giới tính của bạn
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2 text-xs font-bold uppercase tracking-wider border transition-all ${
                    gender === 'female' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Nữ
                </button>
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2 text-xs font-bold uppercase tracking-wider border transition-all ${
                    gender === 'male' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Nam
                </button>
              </div>
            </div>

            {/* Sliders Height & Weight */}
            <div className="space-y-5 mb-6">
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                  <span className="text-gray-500 uppercase tracking-wider text-[10px] font-bold">Chiều cao</span>
                  <span className="font-serif font-bold text-black">{height} cm</span>
                </div>
                <input
                  type="range"
                  min="140"
                  max="200"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                  <span className="text-gray-500 uppercase tracking-wider text-[10px] font-bold">Cân nặng</span>
                  <span className="font-serif font-bold text-black">{weight} kg</span>
                </div>
                <input
                  type="range"
                  min="35"
                  max="120"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
                />
              </div>
            </div>

            {/* Fit Preference */}
            <div className="mb-8">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">
                Sở thích mặc của bạn
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'slim', label: 'Ôm vừa (Slim)' },
                  { id: 'regular', label: 'Tiêu chuẩn (Regular)' },
                  { id: 'relaxed', label: 'Rộng rãi (Relaxed)' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFitPreference(item.id)}
                    className={`p-2 border text-[10px] font-semibold uppercase tracking-wider text-center transition-all ${
                      fitPreference === item.id ? 'border-black bg-zinc-900 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={calculateRecommendation}
              className="w-full py-3.5 bg-black text-white text-xs uppercase font-bold tracking-[0.2em] hover:bg-zinc-800 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Xem Size Phù Hợp</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          /* Step 2: Result */
          <div className="text-center py-2 animate-fade-in">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 font-serif text-2xl font-bold shadow-lg">
              {recommendation.size}
            </div>

            <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-600 font-bold mb-1">
              Độ tương thích {recommendation.confidence}%
            </p>

            <h3 className="font-serif text-2xl font-bold uppercase tracking-tight text-black mb-3">
              Size {recommendation.size} Hoàn Hảo Cho Bạn
            </h3>

            <p className="text-xs text-gray-600 leading-relaxed mb-6 max-w-xs mx-auto">
              {recommendation.note}
            </p>

            <div className="bg-zinc-50 border border-zinc-200 p-4 mb-6 text-left space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Chỉ số thể hình:</span>
                <span className="font-bold text-black">{height} cm / {weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span>Phong cách lựa chọn:</span>
                <span className="font-bold text-black uppercase">{fitPreference}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleApply}
                className="w-full py-3.5 bg-black text-white text-xs uppercase font-bold tracking-[0.2em] hover:bg-zinc-800 transition-colors flex items-center justify-center space-x-2"
              >
                <Check size={16} />
                <span>Áp Dụng Size {recommendation.size} Vào Giỏ Hàng</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
              >
                Tính toán lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SizeRecommenderModal;
