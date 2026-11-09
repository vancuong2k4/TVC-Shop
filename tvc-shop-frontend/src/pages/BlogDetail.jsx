import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogDetail();
    fetchRelatedProducts();
  }, [id]);

  const fetchBlogDetail = async () => {
    try {
      const response = await api.get(`/blogs/${id}`);
      setBlog(response.data);
    } catch (error) {
      console.error('Lỗi khi tải bài viết:', error);
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await api.get('/products');
      // Lấy 4 sản phẩm ngẫu nhiên/nổi bật để làm mục "Shop the Look"
      const products = response.data;
      const shuffled = products.sort(() => 0.5 - Math.random());
      setRelatedProducts(shuffled.slice(0, 4));
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm liên quan:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
             <div className="w-8 h-8 border-t-2 border-black rounded-full animate-spin mb-4"></div>
             <span className="uppercase tracking-widest text-xs text-gray-400 font-bold">Đang tải...</span>
          </div>
        </main>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />
      
      <main className="flex-grow">
        {/* EDITORIAL HERO SECTION */}
        <section className="relative w-full min-h-[70vh] flex items-center justify-center bg-gray-100 mt-20 md:mt-24">
          {blog.image_url && (
            <img 
              src={blog.image_url} 
              alt={blog.title} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center mt-32">
            <Link to="/blog" className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors mb-8">
              <ArrowLeft size={14} />
              <span>Quay lại Tạp Chí</span>
            </Link>
            
            <p className="text-[10px] md:text-xs font-bold text-white/80 uppercase tracking-[0.2em] mb-4">
              {new Date(blog.created_at).toLocaleDateString('vi-VN')} — Đăng bởi {blog.author_name}
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold uppercase tracking-widest leading-tight text-white mb-6 drop-shadow-lg">
              {blog.title}
            </h1>
          </div>
        </section>

        {/* CONTENT SECTION */}
        <section className="max-w-3xl mx-auto px-6 py-20 md:py-32">
          {/* Dấu phẩy trích dẫn cách điệu (Drop cap style can be added via CSS if desired) */}
          <div className="prose prose-lg md:prose-xl max-w-none text-gray-800 font-serif leading-relaxed">
            <div className="whitespace-pre-line text-lg md:text-xl text-justify tracking-wide">
              {blog.content}
            </div>
          </div>
          
          <div className="mt-20 pt-10 border-t border-gray-200 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Share this article</p>
            <div className="flex justify-center space-x-6 mt-4">
               <span className="text-sm cursor-pointer hover:text-gray-500 transition-colors uppercase tracking-widest">Facebook</span>
               <span className="text-sm cursor-pointer hover:text-gray-500 transition-colors uppercase tracking-widest">Twitter</span>
               <span className="text-sm cursor-pointer hover:text-gray-500 transition-colors uppercase tracking-widest">Pinterest</span>
            </div>
          </div>
        </section>

        {/* SHOP THE LOOK SECTION */}
        {relatedProducts.length > 0 && (
          <section className="bg-gray-50 py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-serif font-bold uppercase tracking-[0.15em] mb-4">Shop The Look</h2>
                <p className="text-gray-500 uppercase tracking-widest text-xs">Sở hữu phong cách từ bài viết này</p>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                {relatedProducts.map(product => (
                  <Link to={`/product/${product.slug}`} key={product.id} className="group block">
                    <div className="aspect-[3/4] overflow-hidden bg-white mb-4 relative">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <span className="uppercase tracking-widest text-xs font-bold">No Image</span>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                         <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 bg-white text-black px-6 py-3 flex items-center space-x-2">
                            <ShoppingBag size={16} />
                            <span className="uppercase tracking-widest text-xs font-bold">Mua Ngay</span>
                         </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold uppercase tracking-wider text-sm truncate">{product.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">{parseInt(product.price).toLocaleString()}đ</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetail;
