import React, { useState, useEffect } from 'react';
import { 
  Award, Sparkles, TrendingUp, ShieldCheck, Gift, 
  ChevronRight, Clock, Star, Zap, Crown 
} from 'lucide-react';
import api from '../../api/axios';
import { formatPrice } from '../../utils/formatPrice';

const LoyaltyDashboard = () => {
  const [data, setData] = useState({
    points: 0,
    total_spent: 0,
    successful_orders: 0,
    tier: 'Bronze',
    tier_color: '#CD7F32',
    tier_discount: 0,
    next_tier: 'Silver',
    next_tier_threshold: 2000000,
    progress: 0,
    remaining_spent_needed: 2000000,
    history: [],
    benefits: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoyalty = async () => {
      try {
        const response = await api.get('/loyalty/profile');
        setData(response.data);
      } catch (err) {
        console.error('Lỗi khi tải thông tin hội viên:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoyalty();
  }, []);

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'Diamond':
        return <Crown size={24} className="text-blue-500" />;
      case 'Gold':
        return <Award size={24} className="text-yellow-500" />;
      case 'Silver':
        return <Zap size={24} className="text-slate-400" />;
      default:
        return <ShieldCheck size={24} className="text-amber-700" />;
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-xs uppercase font-bold tracking-widest text-gray-400 animate-pulse">
        Đang tải thông tin thành viên...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Loyalty VIP Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-black to-neutral-800 text-white p-6 sm:p-8 rounded-sm shadow-xl border border-neutral-700">
        <div className="absolute top-0 right-0 translate-x-6 -translate-y-6 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 block mb-1">
              TVC-Shop Loyalty Privilege
            </span>
            <div className="flex items-center space-x-2">
              <h3 className="text-3xl font-serif font-bold uppercase tracking-wider text-white">
                Thành Viên {data.tier}
              </h3>
              {getTierIcon(data.tier)}
            </div>
            {data.tier_discount > 0 && (
              <span className="inline-block mt-1 text-[11px] font-bold bg-white text-black px-2.5 py-0.5 rounded-xs uppercase tracking-wider">
                Đặc quyền giảm {data.tier_discount}% đơn hàng
              </span>
            )}
          </div>

          <div className="text-left sm:text-right bg-white/10 backdrop-blur-md px-4 py-3 rounded-sm border border-white/10">
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-300 block">
              Điểm Tích Lũy
            </span>
            <span className="text-2xl font-bold font-mono tracking-tight text-white">
              {data.points.toLocaleString('vi-VN')} <span className="text-xs font-normal">pts</span>
            </span>
          </div>
        </div>

        {/* Progress Bar to next tier */}
        <div className="space-y-2 pt-2 border-t border-neutral-800">
          <div className="flex justify-between text-xs text-neutral-300">
            <span>
              {data.next_tier 
                ? `Tiến độ lên hạng ${data.next_tier}` 
                : 'Bạn đã đạt cấp độ VIP cao nhất!'}
            </span>
            <span className="font-bold">{data.progress}%</span>
          </div>

          <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-neutral-400 to-white rounded-full transition-all duration-700"
              style={{ width: `${data.progress}%` }}
            />
          </div>

          {data.next_tier && (
            <p className="text-[11px] text-neutral-400 pt-1">
              Chi tiêu thêm <strong>{formatPrice(data.remaining_spent_needed)}</strong> để nâng hạng và mở khóa thêm ưu đãi độc quyền.
            </p>
          )}
        </div>
      </div>

      {/* Grid: Benefits & Recent Point History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Tier Benefits */}
        <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-xs">
          <div className="flex items-center space-x-2 mb-4 border-b border-gray-100 pb-3">
            <Gift size={18} className="text-gray-900" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900">
              Đặc Quyền Của Bạn ({data.tier})
            </h4>
          </div>

          <ul className="space-y-3">
            {data.benefits && data.benefits.map((b, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 text-xs text-gray-700">
                <Sparkles size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Tổng chi tiêu tích lũy:</span>
            <strong className="text-gray-900 font-bold">{formatPrice(data.total_spent)}</strong>
          </div>
        </div>

        {/* Recent Points History */}
        <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-xs">
          <div className="flex items-center space-x-2 mb-4 border-b border-gray-100 pb-3">
            <Clock size={18} className="text-gray-900" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900">
              Lịch Sử Tích Điểm
            </h4>
          </div>

          {data.history && data.history.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {data.history.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <span className="text-[10px] text-gray-400">{item.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600 block">
                      {item.points} pts
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {formatPrice(item.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-gray-400">
              Chưa có lịch sử tích lũy điểm thưởng
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default LoyaltyDashboard;
