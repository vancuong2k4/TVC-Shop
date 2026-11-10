import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { Sparkles, X, Gift, Copy, Check, ArrowRight, Award } from 'lucide-react';

const LuckyWheelModal = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchConfig();
      // Kiểm tra xem đã quay trong phiên làm việc chưa
      if (sessionStorage.getItem('tvc_lucky_wheel_spun') === 'true') {
        setHasSpun(true);
      }
    }
  }, [isOpen]);

  const fetchConfig = async () => {
    try {
      const response = await api.get('/lucky-wheel/config');
      setConfig(response.data);
    } catch (error) {
      console.error('Lỗi khi tải cấu hình vòng quay:', error);
    }
  };

  // Vẽ vòng quay trên Canvas chuẩn đồ họa sắc nét
  useEffect(() => {
    if (!config?.prizes || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const prizes = config.prizes;
    const numSlices = prizes.length;
    const arc = (2 * Math.PI) / numSlices;
    const radius = canvas.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    prizes.forEach((prize, i) => {
      const angle = i * arc;

      // Draw slice
      ctx.beginPath();
      ctx.fillStyle = prize.color;
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius - 6, angle, angle + arc);
      ctx.lineTo(radius, radius);
      ctx.fill();

      // Border slice
      ctx.strokeStyle = '#3f3f46';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.fillStyle = prize.textColor || '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.translate(
        radius + Math.cos(angle + arc / 2) * (radius - 55),
        radius + Math.sin(angle + arc / 2) * (radius - 55)
      );
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillText(prize.label, 0, 0);
      ctx.restore();
    });

    // Outer luxury rim
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 4, 0, 2 * Math.PI);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [config]);

  const handleSpin = async () => {
    if (spinning || hasSpun) return;

    setSpinning(true);
    setResult(null);

    try {
      const response = await api.post('/lucky-wheel/spin');
      const data = response.data;
      const prizeIndex = data.prize_index;
      const numSlices = config.prizes.length;
      const sliceAngle = 360 / numSlices;

      // Tính góc quay để kim trên đỉnh trúng chính giữa slice đã chọn
      // Mặc định Canvas vẽ từ góc 0 (hướng 3 giờ). Kim ở trên đỉnh là hướng 12 giờ (270 độ).
      const targetAngle = 270 - (prizeIndex * sliceAngle + sliceAngle / 2);
      const totalRotations = 360 * 6; // Quay 6 vòng tăng kịch tính
      const newRotation = rotation + totalRotations + (targetAngle - (rotation % 360));

      setRotation(newRotation);

      setTimeout(() => {
        setResult(data);
        setSpinning(false);
        setHasSpun(true);
        sessionStorage.setItem('tvc_lucky_wheel_spun', 'true');
      }, 5000); // 5s quay
    } catch (error) {
      console.error('Lỗi khi quay thưởng:', error);
      setSpinning(false);
    }
  };

  const copyCode = () => {
    if (result?.coupon_code) {
      navigator.clipboard.writeText(result.coupon_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-zinc-950 text-white max-w-lg w-full p-6 md:p-8 border border-zinc-800 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300 mb-2">
            <Sparkles size={12} />
            <span>Đặc Quyền Thành Viên</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold uppercase tracking-tight text-white">
            Vòng Quay May Mắn
          </h2>
          <p className="text-xs text-zinc-400 font-light mt-1">
            Quay ngay để nhận voucher độc quyền giảm tới 25% cho đơn hàng tiếp theo.
          </p>
        </div>

        {/* Wheel Canvas Container */}
        <div className="relative w-72 h-72 mx-auto mb-6 flex items-center justify-center">
          {/* Top Indicator Pointer (Kim chỉ trên đỉnh) */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-amber-300 filter drop-shadow-md"></div>
          </div>

          {/* Rotating Wheel */}
          <div 
            className="w-full h-full transition-transform duration-[5000ms] cubic-bezier(0.15, 0.9, 0.25, 1)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <canvas 
              ref={canvasRef} 
              width={288} 
              height={288} 
              className="w-full h-full rounded-full shadow-2xl"
            />
          </div>

          {/* Center Hub Button */}
          <button
            onClick={handleSpin}
            disabled={spinning || hasSpun}
            className="absolute z-10 w-16 h-16 rounded-full bg-white text-black font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:hover:scale-100 border-4 border-zinc-900"
          >
            {spinning ? 'Quay...' : hasSpun ? 'Đã quay' : 'Quay'}
          </button>
        </div>

        {/* Result Announcement Box */}
        {result && (
          <div className="bg-zinc-900 border border-zinc-700 p-5 text-center animate-slide-down space-y-3 mb-4">
            <h4 className="font-serif text-base font-bold text-amber-300 uppercase tracking-wider">
              {result.prize.label}
            </h4>
            <p className="text-xs text-zinc-300 font-light">
              {result.message}
            </p>

            {result.coupon_code && (
              <div className="flex items-center justify-center space-x-3 bg-black border border-zinc-700 p-2.5 max-w-xs mx-auto">
                <span className="font-mono font-bold text-sm tracking-widest text-white">
                  {result.coupon_code}
                </span>
                <button
                  onClick={copyCode}
                  className="px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors flex items-center space-x-1"
                >
                  {copiedCode ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copiedCode ? 'Đã lưu' : 'Sao chép'}</span>
                </button>
              </div>
            )}
            <p className="text-[10px] text-zinc-500 font-mono">
              Hạn dùng mã: {result.expires_at}
            </p>
          </div>
        )}

        {/* Footer Note */}
        <p className="text-[10px] text-center text-zinc-500 uppercase tracking-widest">
          * Mỗi khách hàng được tham gia quay 1 lần trong mỗi phiên mua sắm.
        </p>
      </div>
    </div>
  );
};

export default LuckyWheelModal;
