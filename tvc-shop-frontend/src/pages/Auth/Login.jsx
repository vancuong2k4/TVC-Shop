import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data && response.data.token) {
        // Lưu token vào Context & LocalStorage
        login(response.data.token, response.data.user);
        navigate('/'); // Điều hướng về trang chủ
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Nửa trái: Ảnh thời trang cover */}
      <div className="hidden lg:block lg:w-1/2 relative bg-black">
        <img 
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop" 
          alt="Fashion Model" 
          className="w-full h-full object-cover opacity-80 grayscale-[20%]"
        />
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Link to="/" className="text-white text-5xl font-bold uppercase tracking-[0.3em] hover:scale-105 transition-transform duration-500">TVC-SHOP</Link>
        </div>
      </div>

      {/* Nửa phải: Form Đăng Nhập */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-8 sm:px-16 md:px-24 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-16">
            <ArrowLeft size={16} className="mr-3" /> Quay lại cửa hàng
          </Link>
          
          <h2 className="text-3xl font-bold uppercase tracking-widest mb-4">Đăng nhập</h2>
          <p className="text-gray-500 mb-10">Chào mừng bạn quay trở lại. Vui lòng nhập thông tin.</p>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 text-sm mb-6 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-b border-gray-300 py-3 text-lg outline-none focus:border-black transition-colors bg-transparent"
                placeholder="Nhập email của bạn"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Mật khẩu</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-b border-gray-300 py-3 text-lg outline-none focus:border-black transition-colors bg-transparent"
                placeholder="Nhập mật khẩu"
              />
            </div>

            <div className="flex justify-between items-center text-sm pt-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="form-checkbox text-black focus:ring-black accent-black w-4 h-4" />
                <span className="text-gray-500">Ghi nhớ tôi</span>
              </label>
              <a href="#" className="text-gray-500 hover:text-black underline">Quên mật khẩu?</a>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-black text-white font-bold uppercase tracking-widest py-4 hover:bg-gray-800 transition-colors disabled:bg-gray-400 mt-8"
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
            </button>
          </form>

          <p className="mt-12 text-center text-gray-500 text-sm">
            Chưa có tài khoản? <Link to="/register" className="text-black font-bold uppercase tracking-widest underline ml-2">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
