import React from 'react';
import { Link } from 'react-router-dom';

const CategoryGrid = () => {
  const categories = [
    {
      id: 1,
      title: "Thời Trang Nam",
      image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974&auto=format&fit=crop",
      link: "/shop?category=1"
    },
    {
      id: 2,
      title: "Thời Trang Nữ",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop",
      link: "/shop?category=2"
    },
    {
      id: 3,
      title: "Phụ Kiện",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop",
      link: "/shop?category=3"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold uppercase tracking-tighter">Bộ Sưu Tập</h2>
          <Link to="/shop" className="text-sm font-bold uppercase tracking-[0.2em] border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors hidden md:block">Xem tất cả</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 auto-rows-[300px] md:auto-rows-[400px]">
          {categories.map((cat, index) => (
            <div 
              key={cat.id} 
              className={`group relative overflow-hidden bg-gray-100 ${
                index === 0 
                  ? 'md:col-span-8 md:row-span-2' // Cột lớn bên trái
                  : 'md:col-span-4 md:row-span-1'  // Cột nhỏ bên phải
              }`}
            >
              <img 
                src={cat.image} 
                alt={cat.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-700"></div>
              <div className="absolute inset-0 flex flex-col items-start justify-end p-8 md:p-12">
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 drop-shadow-md">
                  {cat.title}
                </h3>
                <Link to={cat.link} className="bg-white text-black px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors duration-300 transform opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 shadow-lg">
                  Khám Phá
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
