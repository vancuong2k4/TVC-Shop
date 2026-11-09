import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { formatPrice } from '../../utils/formatPrice';
import { 
  Gift, Users, Copy, Check, Sparkles, Share2, 
  ArrowRight, CreditCard, Award, HeartHandshake, ShieldCheck
} from 'lucide-react';

const ReferralCard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const response = await api.get('/referral/stats');
      setData(response.data);
    } catch (error) {
      console.error('Lỗi khi tải thông tin giới thiệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-100 p-8 shadow-sm flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs uppercase tracking-widest text-gray-400">Đang tải đặc quyền giới thiệu...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-10">
      {/* Hero Banner Minimalist Luxury */}
      <div className="relative overflow-hidden bg-black text-white p-8 md:p-12 border border-black/10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-zinc-800/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-zinc-700/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-300 mb-6">
            <Sparkles size={12} className="text-amber-300" />
            <span>Chương trình Đại sứ TVC-Shop</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-serif font-normal tracking-tight text-white mb-4">
            Lan Tỏa Phong Cách, <br className="hidden sm:inline" />
            Nhận Đặc Quyền Sang Trọng.
          </h2>

          <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-8 max-w-xl">
            Tặng bạn bè voucher giảm giá <span className="text-white font-semibold">{data.friend_discount_percent}%</span> cho đơn hàng đầu tiên của họ. 
            Mỗi khi họ mua sắm thành công, bạn nhận ngay <span className="text-white font-semibold">{formatPrice(data.reward_per_invite)}</span> tiền tích lũy mua sắm.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/15">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400">Bạn bè đã tham gia</p>
              <p className="text-xl md:text-2xl font-serif font-medium text-white mt-1">
                {data.successful_invites} <span className="text-xs font-sans text-zinc-400">người</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400">Tích lũy nhận được</p>
              <p className="text-xl md:text-2xl font-serif font-medium text-white mt-1">
                {formatPrice(data.total_earned_credits)}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[10px] uppercase tracking-widest text-zinc-400">Đặc quyền người mời</p>
              <p className="text-xl md:text-2xl font-serif font-medium text-amber-300 mt-1">
                +{formatPrice(data.reward_per_invite)}/lượt
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Code & Share Link Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Code Box */}
        <div className="bg-white border border-gray-100 p-6 md:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-zinc-400 mb-2">
              <Award size={16} />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Mã giới thiệu độc quyền</span>
            </div>
            <h3 className="text-base font-serif font-semibold text-gray-900 mb-2">Mã quà tặng của bạn</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Bạn bè có thể nhập trực tiếp mã này tại bước thanh toán để nhận ngay ưu đãi 10%.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-zinc-50 border border-zinc-200 p-2 pl-4">
            <span className="font-mono font-bold tracking-widest text-sm text-black flex-1">
              {data.referral_code}
            </span>
            <button
              onClick={() => copyToClipboard(data.referral_code, 'code')}
              className="px-4 py-2 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors flex items-center space-x-1.5"
            >
              {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copiedCode ? 'Đã sao chép' : 'Sao chép'}</span>
            </button>
          </div>
        </div>

        {/* Link Box */}
        <div className="bg-white border border-gray-100 p-6 md:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-zinc-400 mb-2">
              <Share2 size={16} />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Liên kết chia sẻ tức thì</span>
            </div>
            <h3 className="text-base font-serif font-semibold text-gray-900 mb-2">Link giới thiệu bạn bè</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Gửi đường link này qua tin nhắn, mạng xã hội để bạn bè đăng ký và tự động kích hoạt quà tặng.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-zinc-50 border border-zinc-200 p-2 pl-4">
            <span className="text-xs text-gray-600 truncate flex-1 font-mono">
              {data.referral_link}
            </span>
            <button
              onClick={() => copyToClipboard(data.referral_link, 'link')}
              className="px-4 py-2 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors flex items-center space-x-1.5"
            >
              {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copiedLink ? 'Đã sao chép' : 'Sao chép'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step by Step Guide */}
      <div className="bg-zinc-50 border border-zinc-200 p-8">
        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 text-center mb-8">
          Cách Thức Hoạt Động Của Chương Trình
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 bg-white border border-zinc-200 flex items-center justify-center font-serif text-lg font-bold shadow-sm">
              01
            </div>
            <h5 className="font-serif font-medium text-sm text-black">Gửi Lời Mời</h5>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Sao chép mã hoặc liên kết giới thiệu và chia sẻ đến những người bạn yêu thích thời trang.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 bg-white border border-zinc-200 flex items-center justify-center font-serif text-lg font-bold shadow-sm">
              02
            </div>
            <h5 className="font-serif font-medium text-sm text-black">Bạn Bè Mua Hàng</h5>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Bạn bè nhận ưu đãi giảm giá 10% cho đơn hàng đầu tiên của họ tại TVC-Shop.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 bg-white border border-zinc-200 flex items-center justify-center font-serif text-lg font-bold shadow-sm">
              03
            </div>
            <h5 className="font-serif font-medium text-sm text-black">Nhận Thưởng Ngay</h5>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Nhận ngay 50.000đ tích lũy mua sắm cho mỗi đơn hàng bạn bè hoàn tất thành công.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralCard;
