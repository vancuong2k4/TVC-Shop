import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const PromoBanner = () => {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    const fetchPromoBanner = async () => {
      try {
        const response = await api.get('/banners?position=promo');
        if (response.data && response.data.length > 0) {
          setBanner(response.data[0]); // Lấy banner đầu tiên
        }
      } catch (error) {
        console.error('Lỗi tải promo banner:', error);
      }
    };
    fetchPromoBanner();
  }, []);

  const bgStyle = banner && banner.image_url 
    ? { backgroundImage: `url(${banner.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: 'black' };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] lg:min-h-[600px] bg-black">
          {/* Image Side */}
          <div 
            className="h-[40vh] lg:h-auto order-2 lg:order-1 relative" 
            style={bgStyle}
          >
            {/* If no image, fallback to solid color */}
          </div>
          
          {/* Content Side */}
          <div className="flex flex-col justify-center px-8 py-16 lg:px-20 order-1 lg:order-2">
            <span className="text-xs font-bold tracking-[0.4em] text-white/70 uppercase mb-6 block">
              Ưu Đãi Đặc Biệt
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-8 leading-[1.1] tracking-tighter">
              {banner?.title || "Giảm 20% Cho Bộ Sưu Tập Mùa Thu"}
            </h2>
            <p className="text-white/80 mb-12 text-lg leading-relaxed max-w-md">
              {banner?.subtitle || (
                <>Sử dụng mã <strong className="text-black bg-white px-3 py-1 ml-1 font-mono tracking-widest text-sm rounded-sm">FALL20</strong> khi thanh toán.</>
              )}
            </p>
            <div>
              <Link to={banner?.link || "/shop"} className="inline-block px-10 py-5 text-xs font-bold tracking-[0.25em] uppercase bg-white text-black hover:bg-gray-200 transition-colors duration-300">
                Mua Sắm Ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
