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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 container mx-auto px-4 md:px-8">
        <Breadcrumb items={[
          { name: 'Trang chủ', path: '/' },
          { name: 'Tạp chí', path: '' }
        ]} />
        <div className="text-center py-12 px-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold uppercase tracking-[0.2em] mb-4">Tạp Chí</h1>
          <p className="text-gray-500 max-w-2xl mx-auto uppercase tracking-widest text-xs leading-relaxed">
            Nơi chia sẻ những góc nhìn sâu sắc về thời trang tối giản và phong cách sống hiện đại.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 uppercase tracking-widest text-sm text-gray-400">Đang tải...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="uppercase tracking-widest text-sm text-gray-400 mb-6">Chưa có bài viết nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {blogs.map(blog => (
              <article key={blog.id} className="group cursor-pointer">
                <Link to={`/blog/${blog.id}`} className="block">
                  <div className="aspect-[4/3] overflow-hidden mb-6 bg-gray-100 relative">
                    {blog.image_url ? (
                      <img 
                        src={blog.image_url} 
                        alt={blog.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <span className="uppercase tracking-widest text-xs font-bold">No Image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {new Date(blog.created_at).toLocaleDateString('vi-VN')} / {blog.author_name}
                    </p>
                    <h2 className="text-lg font-bold uppercase tracking-widest leading-snug group-hover:text-gray-600 transition-colors">
                      {blog.title}
                    </h2>
                    <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
                      {blog.content}
                    </p>
                    <div className="pt-4">
                      <span className="inline-block border-b border-black pb-1 text-xs font-bold uppercase tracking-widest text-black group-hover:text-gray-500 group-hover:border-gray-500 transition-colors">
                        Đọc tiếp
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
