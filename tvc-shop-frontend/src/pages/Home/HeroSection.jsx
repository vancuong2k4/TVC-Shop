import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await api.get('/banners?position=hero');
        if (response.data && response.data.length > 0) {
          // Map backend data to slide format
          const formattedSlides = response.data.map(banner => ({
            id: banner.id,
            image: banner.image_url,
            title: <span dangerouslySetInnerHTML={{ __html: banner.title ? banner.title.replace('\n', '<br class="hidden md:block"/>') : '' }} />,
            subtitle: banner.subtitle || '',
            link: banner.link || '/shop'
          }));
          setSlides(formattedSlides);
        } else {
          // Fallback if no banners
          setSlides([
            {
              id: 1,
              image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
              title: <>Định hình <br className="hidden md:block"/>Phong cách mới</>,
              subtitle: "Khám phá bộ sưu tập Thu Đông 2026 với những thiết kế tối giản, tinh tế và sang trọng.",
              link: "/shop"
            }
          ]);
        }
      } catch (error) {
        console.error('Lỗi khi tải banner:', error);
      }
    };
    
    fetchBanners();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return <div className="h-screen bg-black"></div>;

  return (
    <div className="relative h-screen w-full bg-black flex items-center justify-center overflow-hidden">
      
      {/* Slides */}
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {/* Background Image without zoom effect */}
          <div className="absolute inset-0">
            <img 
              src={slide.image} 
              alt="Fashion Hero Banner" 
              className="w-full h-full object-cover object-center"
            />
          </div>
          {/* Top Gradient for Navbar Visibility */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/60 via-black/20 to-transparent z-[5] pointer-events-none"></div>
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end text-left px-6 md:px-16 lg:px-24 pb-32 md:pb-40">
            <div className={`transition-all duration-1000 delay-300 transform max-w-3xl
                ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif font-bold text-white uppercase tracking-tighter mb-6 leading-[1.1] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-white mb-10 font-medium tracking-wide max-w-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {slide.subtitle}
              </p>
              <div
                className={`transition-all duration-1000 delay-700 transform
                  ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              >
                <Link to={slide.link || "/shop"} className="inline-block px-10 py-5 text-xs font-bold tracking-[0.25em] uppercase bg-white text-black hover:bg-black hover:text-white transition-all duration-300 shadow-xl">
                  Khám phá ngay
                </Link>
              </div>
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
