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
        
        // Điều hướng dựa trên role
        if (response.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.');
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

            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-widest font-bold">Hoặc</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
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

          <p className="mt-12 text-center text-gray-500 text-sm">
            Chưa có tài khoản? <Link to="/register" className="text-black font-bold uppercase tracking-widest underline ml-2">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
