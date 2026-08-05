import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Categories = () => {
  const categories = [
    {
      id: 1,
      title: "Thời Trang Nữ",
      description: "Sự thanh lịch từ những phom dáng cơ bản nhất. Bộ sưu tập Nữ tôn vinh đường nét tự nhiên và chất liệu tinh xảo.",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop",
      slug: "women"
    },
    {
      id: 2,
      title: "Thời Trang Nam",
      description: "Chuẩn mực của sự lịch lãm. Thiết kế góc cạnh, tối giản và bền bỉ qua thời gian.",
      image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1887&auto=format&fit=crop",
      slug: "men"
    },
    {
      id: 3,
      title: "Phụ Kiện",
      description: "Điểm nhấn cuối cùng hoàn thiện mọi bản ngã thời trang.",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop",
      slug: "accessories"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-40 pb-20">
        
        {/* Header Section */}
        <section className="container mx-auto px-6 md:px-12 lg:px-16 mb-24 md:mb-40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h1 className="text-5xl md:text-7xl lg:text-[8rem] font-serif font-bold uppercase tracking-tighter leading-[0.9] text-black">
                Bộ Sưu<br/>Tập
              </h1>
            </div>
            <div className="lg:col-span-4 pb-4 lg:pb-8">
              <p className="text-gray-500 max-w-sm uppercase tracking-[0.15em] text-[11px] leading-loose font-bold">
                Khám phá các dòng sản phẩm chủ đạo được thiết kế với triết lý tối giản, tập trung vào chất liệu và phom dáng nguyên bản.
              </p>
            </div>
          </div>
        </section>

        {/* Flagship Category (Women) */}
        <section className="mb-24 md:mb-40">
          <Link to={`/shop?category=${categories[0].id}`} className="group block">
            <div className="container mx-auto px-6 md:px-12 lg:px-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-4 lg:col-start-2 order-2 lg:order-1 pt-8 lg:pt-0">
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 block mb-6">01 — Flagship</span>
                  <h2 className="text-4xl md:text-6xl font-serif font-bold uppercase tracking-tighter mb-8 text-black group-hover:text-gray-600 transition-colors duration-500">
                    {categories[0].title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-10 max-w-md">
                    {categories[0].description}
                  </p>
                  <span className="inline-block border-b border-black pb-1 text-xs font-bold uppercase tracking-[0.2em] text-black group-hover:border-gray-400 group-hover:text-gray-500 transition-all duration-300">
                    Khám phá {categories[0].title}
                  </span>
                </div>
                <div className="lg:col-span-6 lg:col-start-7 order-1 lg:order-2 overflow-hidden">
                  <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                    <img 
                      src={categories[0].image} 
                      alt={categories[0].title} 
                      className="w-full h-full object-cover object-center transform transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* Secondary Categories (Men & Accessories) */}
        <section className="container mx-auto px-6 md:px-12 lg:px-16 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
            
            {/* Category Men (Large Square) */}
            <div className="lg:col-span-7">
              <Link to={`/shop?category=${categories[1].id}`} className="group block">
                <div className="aspect-square overflow-hidden bg-gray-100 mb-8">
                  <img 
                    src={categories[1].image} 
                    alt={categories[1].title} 
                    className="w-full h-full object-cover object-center transform transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                <div className="px-2">
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 block mb-4">02 — Essential</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold uppercase tracking-tighter mb-4 text-black group-hover:text-gray-600 transition-colors duration-500">
                    {categories[1].title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-md">
                    {categories[1].description}
                  </p>
                  <span className="inline-block border-b border-black pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-black group-hover:border-gray-400 group-hover:text-gray-500 transition-all duration-300">
                    Khám phá
                  </span>
                </div>
              </Link>
            </div>

            {/* Category Accessories (Portrait) */}
            <div className="lg:col-span-4 lg:col-start-9 lg:mt-40">
              <Link to={`/shop?category=${categories[2].id}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden bg-gray-100 mb-8">
                  <img 
                    src={categories[2].image} 
                    alt={categories[2].title} 
                    className="w-full h-full object-cover object-center transform transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                <div className="px-2">
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 block mb-4">03 — Details</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold uppercase tracking-tighter mb-4 text-black group-hover:text-gray-600 transition-colors duration-500">
                    {categories[2].title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-sm">
                    {categories[2].description}
                  </p>
                  <span className="inline-block border-b border-black pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-black group-hover:border-gray-400 group-hover:text-gray-500 transition-all duration-300">
                    Khám phá
                  </span>
                </div>
              </Link>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Categories;
