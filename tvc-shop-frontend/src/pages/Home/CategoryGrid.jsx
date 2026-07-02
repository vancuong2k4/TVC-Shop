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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {categories.map((cat) => (
            <div key={cat.id} className="group relative aspect-[3/4] overflow-hidden bg-gray-100">
              <img 
                src={cat.image} 
                alt={cat.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-widest mb-8">
                  {cat.title}
                </h3>
                <Link to={cat.link} className="btn-outline border-white text-white hover:bg-white hover:text-black">
                  Xem Bộ Sưu Tập
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
