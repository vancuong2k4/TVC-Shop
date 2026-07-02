import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative h-screen w-full bg-gray-100 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img 
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
        alt="Fashion Hero Banner" 
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
        <h1 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter mb-6 leading-tight">
          Định hình <br className="hidden md:block"/>Phong cách mới
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-10 font-light tracking-wide max-w-2xl mx-auto">
          Khám phá bộ sưu tập Thu Đông 2026 với những thiết kế tối giản, tinh tế và sang trọng.
        </p>
        <Link to="/shop" className="btn-primary bg-white text-black hover:bg-gray-200 transition-colors">
          Khám phá ngay
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
