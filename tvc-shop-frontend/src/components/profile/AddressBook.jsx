import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  MapPin, Plus, Trash2, CheckCircle2, Home, Briefcase, 
  Building, Phone, User, Check, X, Shield 
} from 'lucide-react';

const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    recipient_name: '',
    phone: '',
    address: '',
    city: '',
    label: 'Nhà riêng',
    is_default: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/addresses');
      setAddresses(response.data.data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách địa chỉ:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.post('/addresses', formData);
      setAddresses(response.data.addresses || []);
      setShowAddModal(false);
      setFormData({
        recipient_name: '',
        phone: '',
        address: '',
        city: '',
        label: 'Nhà riêng',
        is_default: false
      });
      setMessage({ type: 'success', text: 'Đã thêm địa chỉ giao hàng mới.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Có lỗi xảy ra khi lưu địa chỉ.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const response = await api.put(`/addresses/${id}/default`);
      setAddresses(response.data.addresses || []);
      setMessage({ type: 'success', text: 'Đã cập nhật địa chỉ mặc định.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Không thể cập nhật địa chỉ mặc định.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;
    try {
      const response = await api.delete(`/addresses/${id}`);
      setAddresses(response.data.addresses || []);
      setMessage({ type: 'success', text: 'Đã xóa địa chỉ thành công.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Không thể xóa địa chỉ.' });
    }
  };

  const getLabelIcon = (label) => {
    if (label === 'Văn phòng') return <Briefcase size={14} className="text-blue-500" />;
    return <Home size={14} className="text-zinc-600" />;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[250px]">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-widest border-l-4 border-black pl-4">
            Sổ Địa Chỉ Giao Hàng
          </h2>
          <p className="text-xs text-gray-500 mt-1 pl-5">
            Quản lý các địa chỉ nhận hàng để thanh toán nhanh chóng hơn
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 bg-black text-white px-5 py-2.5 text-xs uppercase font-bold tracking-widest hover:bg-zinc-800 transition-colors"
        >
          <Plus size={14} />
          <span>Thêm Địa Chỉ Mới</span>
        </button>
      </div>

      {message.text && (
        <div className={`p-4 text-xs font-bold uppercase tracking-wider ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      {/* Address Grid */}
      {addresses.length === 0 ? (
        <div className="border border-dashed border-gray-200 p-12 text-center bg-zinc-50">
          <MapPin size={36} className="mx-auto text-gray-400 mb-3" />
          <h3 className="font-serif text-base font-bold text-gray-800 mb-1">Chưa có địa chỉ nào được lưu</h3>
          <p className="text-xs text-gray-500 mb-6">Thêm địa chỉ giao hàng để thuận tiện khi đặt hàng tại TVC-Shop.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2.5 bg-black text-white text-xs uppercase font-bold tracking-widest hover:bg-zinc-800 transition-colors"
          >
            Thêm địa chỉ ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((item) => (
            <div
              key={item.id}
              className={`p-6 border transition-all duration-300 relative flex flex-col justify-between ${
                item.is_default
                  ? 'border-black bg-zinc-50/50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-400'
              }`}
            >
              <div>
                {/* Header card */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-white border border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-700">
                      {getLabelIcon(item.label)}
                      <span>{item.label || 'Nhà riêng'}</span>
                    </span>
                    {item.is_default && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider">
                        <Check size={10} />
                        <span>Mặc định</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Xóa địa chỉ"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Recipient info */}
                <div className="space-y-1.5 text-xs text-gray-700 mb-6">
                  <div className="flex items-center space-x-2 text-sm font-bold text-black font-serif">
                    <User size={15} className="text-gray-400" />
                    <span>{item.recipient_name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Phone size={13} className="text-gray-400" />
                    <span className="font-mono">{item.phone}</span>
                  </div>
                  <div className="flex items-start space-x-2 pt-2 border-t border-gray-100 text-gray-600 leading-relaxed">
                    <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{item.address}, {item.city}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              {!item.is_default && (
                <div className="pt-3 border-t border-gray-100 text-right">
                  <button
                    onClick={() => handleSetDefault(item.id)}
                    className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-black transition-colors"
                  >
                    Thiết lập làm mặc định
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white max-w-lg w-full p-8 shadow-2xl border border-black/10 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="font-serif text-xl font-bold uppercase tracking-tight text-black mb-1">
              Thêm Địa Chỉ Nhận Hàng
            </h3>
            <p className="text-xs text-gray-500 mb-6 uppercase tracking-wider">
              Vui lòng nhập thông tin chính xác để quá trình giao hàng nhanh chóng
            </p>

            <form onSubmit={handleAddAddress} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-600 mb-1">
                    Tên người nhận *
                  </label>
                  <input
                    type="text"
                    name="recipient_name"
                    required
                    value={formData.recipient_name}
                    onChange={handleInputChange}
                    placeholder="Nguyễn Văn A"
                    className="w-full border border-gray-200 px-3 py-2 text-xs focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-600 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0987654321"
                    className="w-full border border-gray-200 px-3 py-2 text-xs focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-600 mb-1">
                  Tỉnh / Thành phố *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Hà Nội / TP. Hồ Chí Minh / Đà Nẵng..."
                  className="w-full border border-gray-200 px-3 py-2 text-xs focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-600 mb-1">
                  Địa chỉ chi tiết (Số nhà, tên đường, phường/xã) *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Phố Huế, Phường Hàng Bài, Quận Hoàn Kiếm"
                  className="w-full border border-gray-200 px-3 py-2 text-xs focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-600 mb-1">
                  Nhãn địa chỉ
                </label>
                <div className="flex space-x-3">
                  {['Nhà riêng', 'Văn phòng'].map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, label: lbl }))}
                      className={`px-4 py-2 border text-xs font-semibold uppercase tracking-wider transition-all ${
                        formData.label === lbl
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_default"
                    checked={formData.is_default}
                    onChange={handleInputChange}
                    className="accent-black w-4 h-4 rounded"
                  />
                  <span>Đặt làm địa chỉ nhận hàng mặc định</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 border border-gray-200 text-xs uppercase font-bold tracking-widest hover:bg-gray-50 transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-black text-white text-xs uppercase font-bold tracking-widest hover:bg-zinc-800 transition-colors disabled:bg-gray-400"
                >
                  {submitting ? 'Đang Lưu...' : 'Lưu Địa Chỉ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressBook;
