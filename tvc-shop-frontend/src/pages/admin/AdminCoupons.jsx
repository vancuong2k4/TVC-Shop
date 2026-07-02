import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Trash2, X, Tag } from 'lucide-react';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount_percentage: '',
    max_uses: '',
    valid_until: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCoupons = async () => {
    try {
      const response = await api.get('/admin/coupons');
      setCoupons(response.data);
    } catch (error) {
      console.error("Lỗi khi tải mã giảm giá", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openModal = () => {
    setFormData({
      code: '',
      discount_percentage: '',
      max_uses: '',
      valid_until: ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/admin/coupons', formData);
      fetchCoupons();
      closeModal();
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra khi tạo mã.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này không?")) {
      try {
        await api.delete(`/admin/coupons?id=${id}`);
        fetchCoupons();
      } catch (error) {
        alert("Xóa thất bại!");
      }
    }
  };

  if (loading) return <div className="text-gray-500 font-bold uppercase tracking-widest">Đang tải dữ liệu...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold uppercase tracking-widest">Mã Giảm Giá</h2>
        <button 
          onClick={openModal}
          className="flex items-center space-x-2 bg-black text-white px-6 py-3 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg"
        >
          <Plus size={18} />
          <span>Tạo Mã Mới</span>
        </button>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Mã (Code)</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Giảm giá (%)</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Đã dùng / Tối đa</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Hạn sử dụng</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(coupon => (
              <tr key={coupon.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4">
                  <span className="font-bold text-sm uppercase tracking-widest bg-black text-white px-3 py-1 inline-flex items-center space-x-1">
                    <Tag size={12} />
                    <span>{coupon.code}</span>
                  </span>
                </td>
                <td className="p-4 font-bold text-lg text-green-600">{parseFloat(coupon.discount_percentage)}%</td>
                <td className="p-4 font-semibold text-sm">
                  {coupon.current_uses} / {coupon.max_uses ? coupon.max_uses : '∞'}
                </td>
                <td className="p-4 text-sm font-semibold text-gray-600">
                  {coupon.valid_until ? new Date(coupon.valid_until).toLocaleDateString('vi-VN') : 'Không thời hạn'}
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(coupon.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors mx-1">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest">Không có mã giảm giá nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-xl font-bold uppercase tracking-widest">Tạo Mã Mới</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Mã Giảm Giá (Code) <span className="text-red-500">*</span></label>
                  <input type="text" name="code" value={formData.code} onChange={handleInputChange} required placeholder="VD: BLACKFRIDAY" className="w-full border border-gray-300 p-4 outline-none focus:border-black text-sm font-bold uppercase tracking-widest" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Phần trăm giảm (%) <span className="text-red-500">*</span></label>
                  <input type="number" step="0.01" name="discount_percentage" value={formData.discount_percentage} onChange={handleInputChange} required placeholder="VD: 15" className="w-full border border-gray-300 p-4 outline-none focus:border-black text-sm" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Giới hạn số lượt dùng (Để trống nếu không giới hạn)</label>
                  <input type="number" name="max_uses" value={formData.max_uses} onChange={handleInputChange} placeholder="VD: 100" className="w-full border border-gray-300 p-4 outline-none focus:border-black text-sm" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Hạn sử dụng (Để trống nếu không thời hạn)</label>
                  <input type="datetime-local" name="valid_until" value={formData.valid_until} onChange={(e) => setFormData(prev => ({...prev, valid_until: e.target.value}))} className="w-full border border-gray-300 p-4 outline-none focus:border-black text-sm" />
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-100 space-x-4">
                <button type="button" onClick={closeModal} className="px-8 py-4 font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">Hủy</button>
                <button type="submit" disabled={isSubmitting} className="bg-black text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg disabled:bg-gray-400">
                  {isSubmitting ? 'Đang lưu...' : 'Tạo Mã'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
