import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    imageFile: null,
    link: '',
    position: 'hero',
    is_active: true,
    order_index: 0
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await api.get('/admin/banners');
      setBanners(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách banner:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        image_url: banner.image_url || '',
        imageFile: null,
        link: banner.link || '',
        position: banner.position || 'hero',
        is_active: banner.is_active,
        order_index: banner.order_index || 0
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        subtitle: '',
        image_url: '',
        imageFile: null,
        link: '',
        position: 'hero',
        is_active: true,
        order_index: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      if (formData.title) data.append('title', formData.title);
      if (formData.subtitle) data.append('subtitle', formData.subtitle);
      if (formData.image_url) data.append('image_url', formData.image_url);
      if (formData.imageFile) data.append('image', formData.imageFile);
      if (formData.link) data.append('link', formData.link);
      data.append('position', formData.position);
      data.append('is_active', formData.is_active ? 1 : 0);
      data.append('order_index', formData.order_index);

      if (editingBanner) {
        data.append('_method', 'PUT');
        await api.post(`/admin/banners/${editingBanner.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Cập nhật banner thành công!');
      } else {
        await api.post('/admin/banners', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Thêm banner thành công!');
      }
      setIsModalOpen(false);
      fetchBanners();
    } catch (error) {
      console.error('Lỗi khi lưu banner:', error);
      alert('Có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      try {
        await api.delete(`/admin/banners/${id}`);
        alert('Đã xóa banner');
        fetchBanners();
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
        alert('Lỗi khi xóa banner');
      }
    }
  };

  const toggleStatus = async (banner) => {
    try {
      await api.put(`/admin/banners/${banner.id}`, {
        ...banner,
        is_active: !banner.is_active
      });
      fetchBanners();
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
    }
  };

  if (loading) return <div className="p-8 text-gray-500 font-bold uppercase tracking-widest">Đang tải dữ liệu...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold uppercase tracking-widest">Quản Lý Banner</h1>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-black text-white px-6 py-3 font-bold uppercase tracking-widest text-xs flex items-center hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} className="mr-2" /> Thêm Banner
        </button>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-widest text-gray-500">
              <th className="p-4 font-bold">Hình ảnh</th>
              <th className="p-4 font-bold">Tiêu đề</th>
              <th className="p-4 font-bold">Vị trí</th>
              <th className="p-4 font-bold">Trạng thái</th>
              <th className="p-4 font-bold text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {banners.map((banner) => (
              <tr key={banner.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="w-32 h-16 bg-gray-100 overflow-hidden relative">
                    <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="p-4 font-medium">{banner.title || '(Không có tiêu đề)'}</td>
                <td className="p-4 uppercase text-xs tracking-wider font-bold">
                  {banner.position === 'hero' ? 'Trang chủ (Slider)' : 'Khuyến mãi'}
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => toggleStatus(banner)}
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${banner.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}
                  >
                    {banner.is_active ? 'Đang bật' : 'Đã tắt'}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex justify-center space-x-3">
                    <button onClick={() => handleOpenModal(banner)} className="text-blue-500 hover:text-blue-700">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(banner.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {banners.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  Chưa có banner nào. Hãy thêm banner mới!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold uppercase tracking-widest">{editingBanner ? 'Cập Nhật Banner' : 'Thêm Banner Mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Hình ảnh Banner *</label>
                <div className="flex flex-col space-y-4">
                  {/* File Upload */}
                  <div className="border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center hover:border-black transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFormData({...formData, imageFile: file, image_url: ''});
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <ImageIcon size={32} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 font-bold">Kéo thả ảnh hoặc Click để tải lên</span>
                    {formData.imageFile && <span className="mt-2 text-xs text-green-600">Đã chọn: {formData.imageFile.name}</span>}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-400 font-bold uppercase">Hoặc</span>
                  </div>

                  {/* URL Input */}
                  <div className="flex items-center border border-gray-300 focus-within:border-black p-1">
                    <span className="p-2 text-gray-400"><ImageIcon size={18} /></span>
                    <input 
                      type="text" 
                      value={formData.image_url} 
                      onChange={(e) => setFormData({...formData, image_url: e.target.value, imageFile: null})}
                      className="w-full p-2 outline-none text-sm"
                      placeholder="Dán đường link ảnh (URL) vào đây..."
                      required={!formData.imageFile && !formData.image_url} 
                    />
                  </div>
                </div>

                {/* Preview */}
                {(formData.image_url || formData.imageFile) && (
                  <div className="mt-4 w-full h-40 bg-gray-100 overflow-hidden border border-gray-200">
                    <img 
                      src={formData.imageFile ? URL.createObjectURL(formData.imageFile) : formData.image_url} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => e.target.style.display = 'none'} 
                    />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Vị trí hiển thị *</label>
                  <select 
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full border border-gray-300 p-3 outline-none focus:border-black text-sm uppercase font-bold tracking-wider"
                  >
                    <option value="hero">Hero Slider (Đầu trang)</option>
                    <option value="promo">Promo Banner (Giữa trang)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Thứ tự hiển thị (Order)</label>
                  <input 
                    type="number" 
                    value={formData.order_index} 
                    onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value) || 0})}
                    className="w-full border border-gray-300 p-3 outline-none focus:border-black text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Tiêu đề chính</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-gray-300 p-3 outline-none focus:border-black text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Mô tả phụ (Subtitle)</label>
                <input 
                  type="text" 
                  value={formData.subtitle} 
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  className="w-full border border-gray-300 p-3 outline-none focus:border-black text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-2">Đường dẫn khi Click (Link)</label>
                <input 
                  type="text" 
                  value={formData.link} 
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full border border-gray-300 p-3 outline-none focus:border-black text-sm"
                  placeholder="/shop?category=1"
                />
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t">
                <input 
                  type="checkbox" 
                  id="isActive" 
                  checked={formData.is_active} 
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="w-5 h-5 cursor-pointer accent-black"
                />
                <label htmlFor="isActive" className="font-bold uppercase tracking-widest text-xs cursor-pointer">Bật Banner này</label>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-gray-300 font-bold uppercase tracking-widest text-xs hover:bg-gray-50">Hủy</button>
                <button type="submit" className="px-6 py-3 bg-black text-white font-bold uppercase tracking-widest text-xs hover:bg-gray-800 shadow-md">{editingBanner ? 'Cập Nhật' : 'Lưu Banner'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBanners;
