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

  const handleGoogleLogin = async () => {
    try {
      const response = await api.get('/auth/google');
      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      setError('Không thể kết nối với Google. Vui lòng thử lại.');
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

            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-widest font-bold">Hoặc</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading || success}
              className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 border border-black hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Tiếp tục với Google
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
