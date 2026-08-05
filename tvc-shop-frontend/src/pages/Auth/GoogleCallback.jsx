import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const GoogleCallback = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        login(token, user);
        
        // Dùng window.location.href để reload và chuyển hướng chắc chắn nhất
        if (user.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      } catch (err) {
        setError('Đã có lỗi xảy ra khi xác thực tài khoản Google.');
        setTimeout(() => { window.location.href = '/login'; }, 3000);
      }
    } else {
      setError('Đăng nhập thất bại hoặc bị hủy bỏ.');
      setTimeout(() => { window.location.href = '/login'; }, 3000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {error ? (
          <div className="text-red-500 font-bold uppercase tracking-widest">{error}</div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 size={40} className="animate-spin text-black" />
            <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
              Đang xác thực tài khoản Google...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
