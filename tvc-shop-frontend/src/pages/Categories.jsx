import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';

const Categories = () => {
  const categories = [
    {
      id: 1,
      title: "Thời Trang Nam",
      description: "Sự lịch lãm tối giản dành cho phái mạnh.",
      image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1887&auto=format&fit=crop",
      position: "left"
    },
    {
      id: 2,
      title: "Thời Trang Nữ",
      description: "Vẻ đẹp thanh lịch, tinh tế từ những thiết kế cơ bản.",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop",
      position: "right"
    },
    {
      id: 3,
      title: "Phụ Kiện",
      description: "Điểm nhấn hoàn hảo cho mọi phong cách.",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop",
      position: "center"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-0">
        <div className="container mx-auto px-4 md:px-8 mb-4">
          <Breadcrumb items={[
            { name: 'Trang chủ', path: '/' },
            { name: 'Bộ sưu tập', path: '' }
          ]} />
        </div>
        <div className="text-center py-16 px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold uppercase tracking-widest mb-4">Bộ Sưu Tập</h1>
          <p className="text-gray-500 max-w-xl mx-auto uppercase tracking-widest text-xs leading-relaxed">
            Khám phá các dòng sản phẩm chủ đạo được thiết kế với triết lý tối giản, tập trung vào chất liệu và phom dáng.
          </p>
        </div>

        <div className="flex flex-col w-full">
          {categories.map((cat, index) => (
            <Link 
              key={cat.id} 
              to={`/shop?category=${cat.id}`}
              className="relative w-full h-[60vh] md:h-[80vh] group overflow-hidden block"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-500" />
              
              {/* Content Box */}
              <div className={`absolute inset-0 flex flex-col justify-center px-8 md:px-24 
                ${cat.position === 'left' ? 'items-start text-left' : 
                  cat.position === 'right' ? 'items-end text-right' : 'items-center text-center'}`}
              >
                <div className="bg-white bg-opacity-90 p-8 md:p-12 max-w-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                  <h2 className="text-3xl md:text-5xl font-serif font-bold uppercase tracking-widest mb-4 text-black">{cat.title}</h2>
                  <p className="text-gray-600 mb-8 text-sm uppercase tracking-wider leading-relaxed">
                    {cat.description}
                  </p>
                  <span className="inline-block border-b-2 border-black pb-1 text-xs font-bold uppercase tracking-widest text-black hover:text-gray-500 transition-colors">
                    Khám phá ngay
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
