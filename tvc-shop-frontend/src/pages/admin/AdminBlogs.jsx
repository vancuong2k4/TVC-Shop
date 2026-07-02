import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Trash2, Edit } from 'lucide-react';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    content: ''
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/admin/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách bài viết', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/blogs', formData);
      setIsModalOpen(false);
      setFormData({ title: '', image_url: '', content: '' });
      fetchBlogs();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        await api.delete(`/admin/blogs?id=${id}`);
        fetchBlogs();
      } catch (error) {
        alert('Có lỗi xảy ra khi xóa bài viết');
      }
    }
  };

  if (loading) return <div className="p-8">Đang tải...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold uppercase tracking-widest">Quản Lý Tạp Chí (Blog)</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-4 py-2 text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800"
        >
          <Plus size={18} /> Thêm Bài Viết
        </button>
      </div>

      <div className="bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 w-16">ID</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 w-24">Ảnh</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Tiêu đề</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Tác giả</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Ngày đăng</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-semibold">{blog.id}</td>
                <td className="p-4">
                  {blog.image_url ? (
                    <img src={blog.image_url} alt={blog.title} className="w-16 h-16 object-cover" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 flex items-center justify-center text-xs text-gray-400">No Image</div>
                  )}
                </td>
                <td className="p-4 font-bold max-w-xs truncate">{blog.title}</td>
                <td className="p-4 text-sm">{blog.author_name}</td>
                <td className="p-4 text-sm">{new Date(blog.created_at).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleDelete(blog.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                    title="Xóa"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500 uppercase tracking-widest text-sm">Chưa có bài viết nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm Bài Viết */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-6">Thêm Bài Viết Mới</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Tiêu đề</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  className="w-full border border-gray-300 p-3 outline-none focus:border-black"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Link Ảnh Bìa (Tùy chọn)</label>
                <input 
                  type="url" 
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full border border-gray-300 p-3 outline-none focus:border-black"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nội dung (Content)</label>
                <textarea 
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  required
                  rows="10"
                  className="w-full border border-gray-300 p-3 outline-none focus:border-black resize-none"
                  placeholder="Viết nội dung tại đây..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border border-gray-300 font-bold uppercase tracking-widest text-xs hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="bg-black text-white px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-gray-800"
                >
                  Đăng Bài
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
