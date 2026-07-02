import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import { ArrowLeft } from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogDetail();
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <span className="uppercase tracking-widest text-sm text-gray-400">Đang tải...</span>
        </main>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <article className="max-w-3xl mx-auto px-4 md:px-8">
          
          <Breadcrumb items={[
            { name: 'Trang chủ', path: '/' },
            { name: 'Tạp chí', path: '/blog' },
            { name: blog.title, path: '' }
          ]} />

          <Link to="/blog" className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-12">
            <ArrowLeft size={16} />
            <span>Quay lại Tạp Chí</span>
          </Link>

          <header className="text-center mb-16">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
              {new Date(blog.created_at).toLocaleDateString('vi-VN')} — Đăng bởi {blog.author_name}
            </p>
            <h1 className="text-3xl md:text-5xl font-serif font-bold uppercase tracking-widest leading-tight mb-8">
              {blog.title}
            </h1>
          </header>

          {blog.image_url && (
            <div className="aspect-video w-full mb-16 bg-gray-100">
              <img 
                src={blog.image_url} 
                alt={blog.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-serif text-lg">
            {/* Nếu blog content có HTML thì dùng dangerouslySetInnerHTML, hiện tại dùng dạng text với css white-space pre-line để giữ dòng */}
            <div className="whitespace-pre-line">
              {blog.content}
            </div>
          </div>
          
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetail;
