import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Lỗi khi tải bài viết:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredBlog = blogs.length > 0 ? blogs[0] : null;
  const standardBlogs = blogs.length > 1 ? blogs.slice(1) : [];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 container mx-auto px-4 md:px-8 max-w-7xl">
        <Breadcrumb items={[
          { name: 'Trang chủ', path: '/' },
          { name: 'Tạp chí', path: '' }
        ]} />
        
        <div className="text-center py-12 md:py-20 px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold uppercase tracking-[0.2em] mb-6">Editorial</h1>
          <p className="text-gray-500 max-w-2xl mx-auto uppercase tracking-widest text-xs md:text-sm leading-relaxed">
            Khám phá xu hướng, phong cách sống và những câu chuyện đằng sau các bộ sưu tập tối giản.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 uppercase tracking-widest text-sm text-gray-400">Đang tải...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="uppercase tracking-widest text-sm text-gray-400 mb-6">Chưa có bài viết nào.</p>
          </div>
        ) : (
          <div className="space-y-16 md:space-y-32">
            
            {/* HERO POST - Featured Article */}
            {featuredBlog && (
              <article className="group cursor-pointer">
                <Link to={`/blog/${featuredBlog.id}`} className="block">
                  <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden mb-8 bg-gray-100 relative w-full">
                    {featuredBlog.image_url ? (
                      <img 
                        src={featuredBlog.image_url} 
                        alt={featuredBlog.title} 
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <span className="uppercase tracking-widest text-xs font-bold">No Image</span>
                      </div>
                    )}
                    {/* Overlay gradient for text readability if needed */}
                    <div className="absolute inset-0 bg-black bg-opacity-10 transition-opacity duration-700 group-hover:bg-opacity-20" />
                  </div>
                  
                  <div className="max-w-4xl mx-auto text-center space-y-4 px-4">
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {new Date(featuredBlog.created_at).toLocaleDateString('vi-VN')} / {featuredBlog.author_name}
                    </p>
                    <h2 className="text-2xl md:text-4xl font-serif font-bold uppercase tracking-widest leading-snug text-black group-hover:text-gray-600 transition-colors">
                      {featuredBlog.title}
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base line-clamp-3 leading-relaxed max-w-2xl mx-auto mt-4">
                      {featuredBlog.content}
                    </p>
                    <div className="pt-6">
                      <span className="inline-block border-b border-black pb-1 text-xs font-bold uppercase tracking-widest text-black group-hover:text-gray-500 group-hover:border-gray-500 transition-all duration-300">
                        Khám phá
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            )}

            {/* ASYMMETRICAL GRID for remaining posts */}
            {standardBlogs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 items-start">
                {standardBlogs.map((blog, index) => {
                  // Xen kẽ aspect ratio để tạo cảm giác bất đối xứng (Editorial Lookbook)
                  const isTall = index % 2 === 0; 
                  
                  return (
                    <article key={blog.id} className={`group cursor-pointer ${isTall ? 'md:mt-0' : 'md:mt-24'}`}>
                      <Link to={`/blog/${blog.id}`} className="block">
                        <div className={`overflow-hidden mb-6 bg-gray-100 relative ${isTall ? 'aspect-[3/4]' : 'aspect-square'}`}>
                          {blog.image_url ? (
                            <img 
                              src={blog.image_url} 
                              alt={blog.title} 
                              className="w-full h-full object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <span className="uppercase tracking-widest text-xs font-bold">No Image</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-3 pr-4">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {new Date(blog.created_at).toLocaleDateString('vi-VN')}
                          </p>
                          <h2 className="text-xl font-serif font-bold uppercase tracking-widest leading-snug group-hover:text-gray-600 transition-colors">
                            {blog.title}
                          </h2>
                          <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed pt-2">
                            {blog.content}
                          </p>
                          <div className="pt-4">
                            <span className="inline-block border-b border-black pb-1 text-[10px] font-bold uppercase tracking-widest text-black group-hover:text-gray-500 transition-colors">
                              Đọc tiếp
                            </span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}
            
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
