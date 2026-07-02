import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); // null means ADD mode, object means EDIT mode
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discount_price: '',
    image_url: '',
    image_file: null,
    description: '',
    status: 'active'
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/products');
      setProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        id: product.id,
        name: product.name,
        price: product.price,
        discount_price: product.discount_price || '',
        image_url: product.image_url || '',
        image_file: null,
        description: product.description || '',
        status: product.status || 'active'
      });
      setImagePreview(product.image_url || null);
    } else {
      setCurrentProduct(null);
      setFormData({
        name: '',
        price: '',
        discount_price: '',
        image_url: '',
        image_file: null,
        description: '',
        status: 'active'
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      if (files && files[0]) {
        const file = files[0];
        setFormData(prev => ({ ...prev, image_file: file }));
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSend = new FormData();
      dataToSend.append('name', formData.name);
      dataToSend.append('price', formData.price);
      if (formData.discount_price) dataToSend.append('discount_price', formData.discount_price);
      if (formData.description) dataToSend.append('description', formData.description);
      dataToSend.append('status', formData.status);
      if (formData.image_file) {
        dataToSend.append('image', formData.image_file);
      }
      
      if (currentProduct) {
        // Edit
        dataToSend.append('id', formData.id);
        await api.post(`/admin/products/${currentProduct.id}?_method=PUT`, dataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Add
        await api.post('/admin/products', dataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      fetchProducts();
      closeModal();
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra khi lưu sản phẩm.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("CẢNH BÁO: Bạn có chắc chắn muốn xóa sản phẩm này không? Tất cả dữ liệu liên quan sẽ bị mất.")) {
      try {
        await api.delete(`/admin/products?id=${id}`);
        fetchProducts();
      } catch (error) {
        alert("Xóa thất bại!");
      }
    }
  };

  if (loading) return <div className="text-gray-500 font-bold uppercase tracking-widest">Đang tải dữ liệu...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold uppercase tracking-widest">Quản lý Sản phẩm</h2>
        <button 
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-black text-white px-6 py-3 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg"
        >
          <Plus size={18} />
          <span>Thêm Sản Phẩm</span>
        </button>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 w-24">Ảnh</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Tên Sản Phẩm</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Giá Bán</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Trạng Thái</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4">
                  <div className="w-16 h-20 bg-gray-100">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-gray-400 flex items-center justify-center h-full">No IMG</span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-bold text-sm uppercase tracking-wider">{product.name}</p>
                </td>
                <td className="p-4">
                  <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                  {product.discount_price && (
                    <span className="block text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1">
                      Sale: {formatPrice(product.discount_price)}
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                    {product.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => openModal(product)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors mx-1">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors mx-1">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
              <h3 className="text-xl font-bold uppercase tracking-widest">
                {currentProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Tên Sản Phẩm <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full border border-gray-300 p-4 outline-none focus:border-black text-sm" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Giá Gốc (VNĐ) <span className="text-red-500">*</span></label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="w-full border border-gray-300 p-4 outline-none focus:border-black text-sm" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Giá Khuyến Mãi (VNĐ)</label>
                  <input type="number" name="discount_price" value={formData.discount_price} onChange={handleInputChange} className="w-full border border-gray-300 p-4 outline-none focus:border-black text-sm" />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Hình Ảnh Sản Phẩm</label>
                  <div className="flex items-start space-x-6">
                    <div className="flex-1">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleInputChange} 
                        className="w-full border border-gray-300 p-3 outline-none focus:border-black text-sm bg-white" 
                      />
                      <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest font-bold">Kích thước tối đa: 2MB. Hỗ trợ: JPG, PNG, WEBP.</p>
                    </div>
                    {imagePreview && (
                      <div className="w-24 h-32 bg-gray-100 border border-gray-200 flex-shrink-0 relative group">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData(prev => ({ ...prev, image_file: null, image_url: '' }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Mô Tả Sản Phẩm</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="5" className="w-full border border-gray-300 p-4 outline-none focus:border-black text-sm custom-scrollbar"></textarea>
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Trạng Thái</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border border-gray-300 p-4 outline-none focus:border-black text-sm font-bold uppercase tracking-widest bg-white">
                    <option value="active">Đang Bán (Active)</option>
                    <option value="inactive">Ngừng Bán (Inactive)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-100 space-x-4">
                <button type="button" onClick={closeModal} className="px-8 py-4 font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
                  Hủy
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-black text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg disabled:bg-gray-400">
                  {isSubmitting ? 'Đang lưu...' : 'Lưu Sản Phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
