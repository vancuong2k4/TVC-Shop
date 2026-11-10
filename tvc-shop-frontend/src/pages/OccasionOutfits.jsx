import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import ProductCard from '../components/common/ProductCard';
import api from '../api/axios';
import { Sparkles, Calendar, ArrowRight, Compass, ShieldCheck } from 'lucide-react';

const OccasionOutfits = () => {
  const [data, setData] = useState(null);
  const [selectedOccasion, setSelectedOccasion] = useState('workwear');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOccasions(selectedOccasion);
  }, [selectedOccasion]);

  const fetchOccasions = async (occ) => {
    setLoading(true);
    try {
      const response = await api.get(`/occasions?occasion=${occ}`);
      setData(response.data);
    } catch (error) {
      console.error('Lỗi khi tải trang phục theo dịp:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentOcc = data?.selected_occasion;

  return (
    <div className="bg-[#FAF9F6] min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-24 pb-24">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-6xl">
          <Breadcrumb items={[{ label: 'Trang chủ', link: '/' }, { label: 'Phong Cách Theo Dịp (Occasions)' }]} />

          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-[0.25em] mb-4">
              <Compass size={12} className="text-amber-300" />
              <span>Curated Styling Guide</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-black mb-4">
              Phong Cách Theo Từng Dịp
            </h1>
            <p className="text-xs md:text-sm text-gray-500 uppercase tracking-widest leading-relaxed">
              Bộ sưu tập gợi ý phối đồ tinh tế, sẵn sàng cho mọi khoảnh khắc đáng nhớ trong cuộc sống của bạn
            </p>
          </div>

          {/* Occasion Cards Selector (4 Tabs) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {data?.occasions?.map((occ) => {
              const isActive = selectedOccasion === occ.id;
              return (
                <button
                  key={occ.id}
                  onClick={() => setSelectedOccasion(occ.id)}
                  className={`text-left p-4 border transition-all duration-300 relative overflow-hidden group ${
                    isActive 
                      ? 'border-black bg-black text-white shadow-xl' 
                      : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400'
                  }`}
                >
                  <span className={`text-[9px] uppercase font-bold tracking-widest block mb-1 ${isActive ? 'text-amber-300' : 'text-gray-400'}`}>
                    {occ.badge}
                  </span>
                  <h3 className="font-serif font-bold text-sm tracking-tight mb-2 truncate">
                    {occ.name}
                  </h3>
                  <div className="h-28 overflow-hidden bg-zinc-100 mb-2">
                    <img 
                      src={occ.image_url} 
                      alt={occ.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Featured Occasion Story Hero */}
          {currentOcc && (
            <div className="bg-white border border-gray-100 p-8 md:p-12 mb-16 shadow-sm flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2 aspect-[4/3] bg-zinc-100 overflow-hidden">
                <img 
                  src={currentOcc.image_url} 
                  alt={currentOcc.name} 
                  className="w-full h-full object-cover" 
                />
              </div>

              <div className="w-full md:w-1/2 space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-zinc-400">
                  {currentOcc.tagline}
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold uppercase tracking-tight text-black">
                  {currentOcc.name}
                </h2>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-light">
                  {currentOcc.description}
                </p>
                <div className="pt-2 flex items-center space-x-2 text-xs text-gray-500">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Thiết kế giới hạn được tuyển chọn bởi Stylist TVC-Shop</span>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="mb-8">
            <h3 className="text-sm uppercase font-bold tracking-[0.2em] text-black mb-8 border-b border-gray-200 pb-4">
              Gợi Ý Trang Phục Phù Hợp ({data?.products?.length || 0})
            </h3>

            {loading ? (
              <div className="py-24 text-center">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs uppercase tracking-widest text-gray-400">Đang tuyển chọn trang phục...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {data?.products?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OccasionOutfits;
