import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, Users, LogOut, Tag, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Đơn Hàng', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Sản Phẩm', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Mã Giảm Giá', path: '/admin/coupons', icon: <Tag size={20} /> },
    { name: 'Tạp Chí (Blog)', path: '/admin/blogs', icon: <FileText size={20} /> },
    { name: 'Khách Hàng', path: '/admin/users', icon: <Users size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold uppercase tracking-widest text-white">TVC Shop<br/><span className="text-xs text-gray-400">Admin Panel</span></h1>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-bold tracking-wider uppercase text-sm ${isActive ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link to="/" className="flex items-center space-x-3 w-full px-4 py-3 text-gray-400 hover:text-white transition-colors uppercase text-sm font-bold tracking-wider hover:bg-gray-800 rounded-lg mb-2">
             <span>Về Trang Khách</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:text-red-300 transition-colors uppercase text-sm font-bold tracking-wider hover:bg-gray-800 rounded-lg"
          >
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
