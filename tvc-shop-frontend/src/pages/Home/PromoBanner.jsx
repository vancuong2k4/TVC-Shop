import React from 'react';
import { Link } from 'react-router-dom';

const PromoBanner = () => {
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="bg-black text-white px-8 py-20 md:py-28 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <span className="text-xs font-bold tracking-[0.4em] uppercase mb-6 opacity-80">Ưu Đãi Đặc Biệt</span>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-8">
              Giảm 20% Cho Bộ Sưu Tập Mùa Thu
            </h2>
            <p className="text-gray-400 mb-12 text-lg font-light leading-relaxed">
              Sử dụng mã <strong className="text-white font-mono bg-white/10 px-4 py-2 ml-2 tracking-widest text-sm">FALL20</strong> khi thanh toán. Chương trình áp dụng đến hết ngày 30/10.
            </p>
            <Link to="/shop" className="btn-outline border-white text-white hover:bg-white hover:text-black">
              Mua Sắm Ngay
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
