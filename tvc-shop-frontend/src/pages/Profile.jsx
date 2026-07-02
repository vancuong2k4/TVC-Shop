import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import { User, ShoppingBag, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    dob: '',
    gender: '',
    password: ''
  });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      const data = response.data;
      setEmail(data.email);
      setFormData({
        full_name: data.full_name || '',
        phone: data.phone || '',
        address: data.address || '',
        dob: data.dob || '',
        gender: data.gender || '',
        password: '' // Keep password empty initially
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Không thể tải thông tin tài khoản.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      await api.put('/users/profile', formData);
      setMessage({ type: 'success', text: 'Đã cập nhật thông tin thành công.' });
      // Clear password field after success
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null; // Or a loading spinner

  const navItems = [
    { name: 'Tài Khoản', path: '/profile', icon: <User size={20} /> },
    { name: 'Đơn Hàng', path: '/orders', icon: <ShoppingBag size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 md:px-8 pt-32 pb-20">
        <Breadcrumb items={[
          { name: 'Trang chủ', path: '/' },
          { name: 'Tài khoản', path: '' }
        ]} />
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-10 border-b border-gray-200 pb-6">Quản Lý Tài Khoản</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white p-6 shadow-sm">
              <div className="mb-8 pb-6 border-b border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Xin chào,</p>
                <p className="text-xl font-bold uppercase truncate">{formData.full_name || 'Khách hàng'}</p>
              </div>
              <ul className="space-y-4">
                {navItems.map(item => (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className={`flex items-center space-x-3 text-sm font-bold uppercase tracking-widest transition-colors ${location.pathname === item.path ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
                <li className="pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => { logout(); navigate('/login'); }}
                    className="flex items-center space-x-3 text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors w-full text-left"
                  >
                    <LogOut size={20} />
                    <span>Đăng Xuất</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4 bg-white p-8 lg:p-12 shadow-sm">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-8 border-l-4 border-black pl-4">Hồ Sơ Của Tôi</h2>
            
            {message.text && (
              <div className={`p-4 mb-8 text-sm font-bold uppercase tracking-widest ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Đăng Nhập</label>
                <input 
                  type="email" 
                  value={email} 
                  disabled 
                  className="w-full border-b border-gray-200 py-3 text-gray-500 bg-gray-50 px-3 text-sm cursor-not-allowed" 
                />
                <p className="text-[10px] text-gray-400 mt-2">* Email không thể thay đổi</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Họ và Tên</label>
                  <input 
                    type="text" 
                    name="full_name" 
                    value={formData.full_name} 
                    onChange={handleChange} 
                    required 
                    className="w-full border-b border-gray-300 py-3 outline-none focus:border-black text-sm transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Số Điện Thoại</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    className="w-full border-b border-gray-300 py-3 outline-none focus:border-black text-sm transition-colors" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Giới tính</label>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} className="accent-black w-4 h-4" />
                      <span className="text-sm font-semibold uppercase tracking-wider">Nam</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} className="accent-black w-4 h-4" />
                      <span className="text-sm font-semibold uppercase tracking-wider">Nữ</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="gender" value="other" checked={formData.gender === 'other'} onChange={handleChange} className="accent-black w-4 h-4" />
                      <span className="text-sm font-semibold uppercase tracking-wider">Khác</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Ngày sinh</label>
                  <input 
                    type="date" 
                    name="dob" 
                    value={formData.dob} 
                    onChange={handleChange} 
                    className="w-full border-b border-gray-300 py-3 outline-none focus:border-black text-sm transition-colors uppercase" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Địa Chỉ Giao Hàng</label>
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  className="w-full border-b border-gray-300 py-3 outline-none focus:border-black text-sm transition-colors" 
                  placeholder="Thành phố, Quận/Huyện, Số nhà..."
                />
              </div>

              <div className="pt-8 border-t border-gray-100">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-6 border-l-4 border-black pl-3">Đổi Mật Khẩu</h3>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Mật khẩu mới (Bỏ trống nếu không muốn đổi)</label>
                  <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    className="w-full border-b border-gray-300 py-3 outline-none focus:border-black text-sm transition-colors" 
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-6 text-right">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="bg-black text-white px-10 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                >
                  {saving ? 'Đang Lưu...' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
