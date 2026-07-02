import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { ArrowLeft } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', { 
        email: formData.email, 
        password: formData.password,
        full_name: formData.fullName
      });
      
      setSuccess(response.data.message || 'Đăng ký thành công!');
      // Tự động chuyển hướng về trang Login sau 2 giây
      setTimeout(() => navigate('/login'), 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      
      {/* Nửa trái: Form Đăng Ký */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-8 sm:px-16 md:px-24 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-12">
            <ArrowLeft size={16} className="mr-3" /> Quay lại cửa hàng
          </Link>
          
          <h2 className="text-3xl font-bold uppercase tracking-widest mb-4">Tạo Tài Khoản</h2>
          <p className="text-gray-500 mb-8">Gia nhập cùng chúng tôi để trải nghiệm mua sắm tốt nhất.</p>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 text-sm mb-6 border border-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-4 text-sm mb-6 border border-green-200">
              {success} Đang chuyển hướng...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Họ và Tên</label>
              <input 
                type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
                className="w-full border-b border-gray-300 py-2 text-lg outline-none focus:border-black transition-colors bg-transparent"
                placeholder="Nhập họ và tên"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
              <input 
                type="email" name="email" value={formData.email} onChange={handleChange} required
                className="w-full border-b border-gray-300 py-2 text-lg outline-none focus:border-black transition-colors bg-transparent"
                placeholder="Nhập địa chỉ email"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Mật khẩu</label>
              <input 
                type="password" name="password" value={formData.password} onChange={handleChange} required
                className="w-full border-b border-gray-300 py-2 text-lg outline-none focus:border-black transition-colors bg-transparent"
                placeholder="Tạo mật khẩu"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nhập Lại Mật khẩu</label>
              <input 
                type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                className="w-full border-b border-gray-300 py-2 text-lg outline-none focus:border-black transition-colors bg-transparent"
                placeholder="Nhập lại mật khẩu"
              />
            </div>

            <button 
              type="submit" disabled={isLoading || success}
              className="w-full bg-black text-white font-bold uppercase tracking-widest py-4 hover:bg-gray-800 transition-colors disabled:bg-gray-400 mt-8"
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng Ký Tài Khoản'}
            </button>
          </form>

          <p className="mt-10 text-center text-gray-500 text-sm">
            Đã có tài khoản? <Link to="/login" className="text-black font-bold uppercase tracking-widest underline ml-2">Đăng nhập</Link>
          </p>
        </div>
      </div>

      {/* Nửa phải: Ảnh thời trang detail */}
      <div className="hidden lg:block lg:w-1/2 relative bg-black">
        <img 
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop" 
          alt="Fashion Detail" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-20 bg-gradient-to-t from-black/90 to-transparent">
          <h3 className="text-white text-3xl font-bold uppercase tracking-widest mb-4">TVC-SHOP</h3>
          <p className="text-gray-400 max-w-md leading-relaxed">Bộ sưu tập thời trang định hình phong cách sống hiện đại. Trải nghiệm mua sắm mượt mà cùng chúng tôi ngay hôm nay.</p>
        </div>
      </div>

    </div>
  );
};

export default Register;
