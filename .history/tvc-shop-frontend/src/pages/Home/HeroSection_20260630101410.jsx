import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
      title: <>Định hình <br className="hidden md:block"/>Phong cách mới</>,
      subtitle: "Khám phá bộ sưu tập Thu Đông 2026 với những thiết kế tối giản, tinh tế và sang trọng."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
      title: <>Bản tự do của <br className="hidden md:block"/>Sự đơn giản</>,
      subtitle: "Sự thanh lịch toát lên từ những đường cắt tinh gọn và chất liệu cao cấp."
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop",
      title: <>Vẻ đẹp <br className="hidden md:block"/>Vượt thời gian</>,
      subtitle: "Tôn vinh cá tính độc bản của bạn với những trang phục không bao giờ lỗi mốt."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-screen w-full bg-black flex items-center justify-center overflow-hidden">
      
      {/* Slides */}
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {/* Background Image with slight zoom effect on active */}
          <div className={`absolute inset-0 transition-transform duration-[10000ms] ease-linear ${index === currentSlide ? 'scale-105' : 'scale-100'}`}>
            <img 
              src={slide.image} 
              alt="Fashion Hero Banner" 
              className="w-full h-full object-cover object-center"
            />
          </div>
          
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto mt-16">
            <h1 
              className={`text-5xl md:text-7xl font-serif font-bold text-white uppercase tracking-tighter mb-6 leading-tight transition-all duration-1000 delay-300 transform 
                ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              {slide.title}
            </h1>
            <p 
              className={`text-lg md:text-xl text-gray-200 mb-10 font-light tracking-wide max-w-2xl mx-auto transition-all duration-1000 delay-500 transform
                ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              {slide.subtitle}
            </p>
            <div
              className={`transition-all duration-1000 delay-700 transform
                ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <Link to="/shop" className="btn-primary bg-white text-black hover:bg-gray-200 transition-colors">
                Khám phá ngay
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-12 h-1 rounded-full transition-all duration-500 ${index === currentSlide ? 'bg-white' : 'bg-white/30 hover:bg-white/60'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
};

export default HeroSection;
