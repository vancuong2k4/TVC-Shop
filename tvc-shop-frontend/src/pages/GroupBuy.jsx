import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import api from '../api/axios';
import { formatPrice } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Sparkles, Clock, ArrowRight, CheckCircle2, 
  ShieldCheck, Share2, Tag, ShoppingBag 
} from 'lucide-react';

const GroupBuy = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [joiningId, setJoiningId] = useState(null);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchGroupBuys();
  }, []);

  const fetchGroupBuys = async () => {
    try {
      const response = await api.get('/group-buys');
      setData(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách mua chung:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (item) => {
    setJoiningId(item.group_buy_id);
    try {
      if (user) {
        await api.post(`/group-buys/${item.group_buy_id}/join`);
      }
      
      // Thêm sản phẩm vào giỏ hàng với giá ưu đãi Mua Chung
      addToCart({
        id: item.product_id,
        name: `${item.product_name} [Nhóm ${item.group_buy_id}]`,
        price: item.group_price,
        image: item.image_url
      }, 1, 'M', 'Black');

      setJoinedGroups(prev => [...prev, item.group_buy_id]);
    } catch (error) {
      console.error('Lỗi khi tham gia mua chung:', error);
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-24 pb-24">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-6xl">
          <Breadcrumb items={[{ label: 'Trang chủ', link: '/' }, { label: 'Mua Chung Nhóm' }]} />

          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-[0.25em] mb-4">
              <Users size={12} className="text-amber-300" />
              <span>Team Shopping Experience</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-black mb-4">
              Mua Chung Theo Nhóm
            </h1>
            <p className="text-xs md:text-sm text-gray-500 uppercase tracking-widest leading-relaxed">
              Lập nhóm mua sắm cùng bạn bè để mở khóa mức giá chiết khấu đặc quyền tới 30%
            </p>
          </div>

          {/* How It Works 3-Step Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 bg-white border border-gray-100 p-8 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-black text-white rounded-none flex items-center justify-center font-serif text-sm font-bold flex-shrink-0">
                01
              </div>
              <div>
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-black mb-1">Chọn Món Đồ Yêu Thích</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Chọn sản phẩm trong danh mục Mua Chung với giá giảm tới 30%.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-black text-white rounded-none flex items-center justify-center font-serif text-sm font-bold flex-shrink-0">
                02
              </div>
              <div>
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-black mb-1">Gia Nhập Hoặc Mời Bạn Bè</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Gia nhập nhóm có sẵn hoặc chia sẻ link mời 1-2 người bạn cùng mua.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-black text-white rounded-none flex items-center justify-center font-serif text-sm font-bold flex-shrink-0">
                03
              </div>
              <div>
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-black mb-1">Hoàn Tất & Giao Tận Tay</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Khi đủ số thành viên, đơn hàng được tự động xác nhận và xuất kho riêng biệt.</p>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs uppercase tracking-widest text-gray-400">Đang tìm các nhóm mua chung...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data?.items?.map((item) => {
                const isJoined = joinedGroups.includes(item.group_buy_id);

                return (
                  <div
                    key={item.group_buy_id}
                    className="bg-white border border-gray-100 hover:border-black transition-all duration-300 shadow-sm flex flex-col justify-between group overflow-hidden"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.product_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : null}

                        {/* Discount Tag */}
                        <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                          Mua Chung -{item.discount_percent}%
                        </div>

                        {/* Expiry Pill */}
                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-black text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 flex items-center space-x-1 shadow-sm">
                          <Clock size={11} />
                          <span>Còn {item.expires_in}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">
                          {item.category_name}
                        </p>
                        <h3 className="font-serif font-bold text-base text-black truncate mb-3">
                          {item.product_name}
                        </h3>

                        {/* Pricing */}
                        <div className="flex items-baseline space-x-3 mb-5">
                          <span className="font-serif text-xl font-bold text-black">
                            {formatPrice(item.group_price)}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(item.original_price)}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 uppercase">
                            Tiết kiệm {formatPrice(item.savings)}
                          </span>
                        </div>

                        {/* Group Progress Bar */}
                        <div className="p-3 bg-zinc-50 border border-zinc-200 mb-2">
                          <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
                            <span className="font-semibold text-black">
                              Nhóm của <strong className="font-serif">{item.leader_name}</strong>
                            </span>
                            <span className="text-[11px] font-mono font-bold text-black">
                              {item.current_members}/{item.required_members} người
                            </span>
                          </div>

                          <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden mb-2">
                            <div
                              className="h-full bg-black"
                              style={{ width: `${(item.current_members / item.required_members) * 100}%` }}
                            ></div>
                          </div>

                          <p className="text-[10px] text-gray-500">
                            Chỉ cần thêm <strong className="text-black font-semibold">{item.slots_left} người nữa</strong> để chốt đơn giá ưu đãi.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="p-6 pt-0">
                      {isJoined ? (
                        <div className="w-full py-3 bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest text-center flex items-center justify-center space-x-2">
                          <CheckCircle2 size={16} />
                          <span>Đã Thêm Vào Giỏ Hàng</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleJoinGroup(item)}
                          disabled={joiningId === item.group_buy_id}
                          className="w-full py-3.5 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400"
                        >
                          {joiningId === item.group_buy_id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <span>Gia Nhập Nhóm Mua Chung</span>
                              <ArrowRight size={14} />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GroupBuy;
