import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, Search, Menu, X, Heart } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import CartDrawer from '../cart/CartDrawer';
import SearchModal from '../common/SearchModal';
import NotificationDropdown from '../common/NotificationDropdown';
import CompareModal from '../common/CompareModal';
import CompareFloatingBar from '../common/CompareFloatingBar';
import CurrencySwitcher from '../common/CurrencySwitcher';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  
  const { user, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Keyboard shortcut Ctrl+K / Cmd+K to open Search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Xác định CSS cho Navbar dựa trên trang hiện tại và trạng thái cuộn
  const navBgClass = isHomePage 
    ? (isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-8')
    : 'bg-white shadow-sm py-4'; // Luôn nền trắng ở các trang con
    
  const textClass = (isHomePage && !isScrolled) 
    ? 'text-white drop-shadow-sm' 
    : 'text-black'; // Luôn chữ đen ở các trang con hoặc khi đã cuộn

  return (
    <>
    <nav className={`fixed w-full z-50 transition-all duration-500 ${navBgClass}`}>
      <div className="container mx-auto px-6 md:px-12 lg:px-16 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className={`text-2xl lg:text-3xl font-serif font-bold tracking-tighter uppercase transition-colors duration-300 ${textClass}`}>
          TVC-SHOP
        </Link>

        {/* Desktop Menu */}
        <div className={`hidden md:flex space-x-10 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${textClass}`}>
          <Link to="/" className="hover:text-gray-500 transition-colors">Trang chủ</Link>
          <Link to="/shop" className="hover:text-gray-500 transition-colors">Cửa hàng</Link>
          <Link to="/occasions" className="hover:text-gray-500 transition-colors">Dịp diện</Link>
          <Link to="/private-salon" className="hover:text-gray-500 transition-colors flex items-center gap-1">Salon VIP</Link>
          <Link to="/stylist-quiz" className="hover:text-gray-500 transition-colors flex items-center gap-1">AI Stylist</Link>
          <Link to="/fitting-room" className="hover:text-gray-500 transition-colors flex items-center gap-1">Phòng thử 3D</Link>
          <Link to="/pre-orders" className="hover:text-gray-500 transition-colors flex items-center gap-1">Pre-Orders <span className="text-[9px] px-1 py-0.2 rounded bg-amber-400 text-black font-mono">30%</span></Link>
          <Link to="/lookbook" className="hover:text-gray-500 transition-colors flex items-center gap-1">Lookbook Reels <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span></Link>
          <Link to="/group-buy" className="hover:text-gray-500 transition-colors">Mua chung</Link>
          <Link to="/categories" className="hover:text-gray-500 transition-colors">Bộ sưu tập</Link>
          <Link to="/gift-cards" className="hover:text-gray-500 transition-colors">E-Gift Cards</Link>
          <Link to="/bespoke-box" className="hover:text-gray-500 transition-colors flex items-center gap-1">Hộp Quà Sơn Mài</Link>
          <Link to="/fabric-archive" className="hover:text-gray-500 transition-colors flex items-center gap-1">Hộ Chiếu Vải</Link>
          <Link to="/runway-voting" className="hover:text-gray-500 transition-colors flex items-center gap-1">Bầu Chọn Runway</Link>
          <Link to="/authenticity" className="hover:text-gray-500 transition-colors flex items-center gap-1">Chứng Thư Độc Bản</Link>
          <Link to="/community-lookbook" className="hover:text-gray-500 transition-colors flex items-center gap-1">Style Feed</Link>
          <Link to="/customizer" className="hover:text-gray-500 transition-colors flex items-center gap-1">May Đo Kim Khí</Link>
          <Link to="/secret-vault" className="hover:text-amber-400 transition-colors flex items-center gap-1">Hầm Kín VIP <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span></Link>
          <Link to="/measurement-ledger" className="hover:text-gray-500 transition-colors flex items-center gap-1">Sổ Thước Đo</Link>
          <Link to="/color-analysis" className="hover:text-cyan-400 transition-colors flex items-center gap-1">Màu Sắc 4 Mùa <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span></Link>
          <Link to="/circular-buyback" className="hover:text-emerald-400 transition-colors flex items-center gap-1">Thu Mua Tuần Hoàn <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span></Link>
          <Link to="/scent-profiler" className="hover:text-amber-300 transition-colors flex items-center gap-1">Hương Nước Hoa <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span></Link>
          <Link to="/virtual-mirror" className="hover:text-cyan-400 transition-colors flex items-center gap-1">Gương AR <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span></Link>
          <Link to="/jetsetter" className="hover:text-amber-400 transition-colors flex items-center gap-1">Vali Jetsetter <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span></Link>
          <Link to="/ownership-transfer" className="hover:text-amber-300 transition-colors flex items-center gap-1">Chuyển Nhượng Di Sản <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span></Link>
          <Link to="/swatch-box" className="hover:text-amber-200 transition-colors flex items-center gap-1">Hộp Vải Tại Gia <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span></Link>
          <Link to="/runway-forecast" className="hover:text-cyan-300 transition-colors flex items-center gap-1">Dự Báo Runway <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span></Link>
          <Link to="/virtual-flagship" className="hover:text-amber-400 transition-colors flex items-center gap-1">Flagship 3D <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span></Link>
          <Link to="/gold-embroidery" className="hover:text-amber-300 transition-colors flex items-center gap-1">Thêu Chỉ Vàng 24K <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span></Link>
          <Link to="/investment-calculator" className="hover:text-emerald-400 transition-colors flex items-center gap-1">Tính Khấu Hao <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span></Link>
          <Link to="/blog" className="hover:text-gray-500 transition-colors">Tạp chí</Link>
        </div>

        {/* Icons */}
        <div className={`flex items-center space-x-6 transition-colors duration-300 ${textClass}`}>
          {/* Currency Switcher */}
          <div className="hidden sm:block">
            <CurrencySwitcher lightMode={!isHomePage || isScrolled} />
          </div>

          {/* Search Button (Triggers Real-time Modal) */}
          <button 
            onClick={() => setIsSearchModalOpen(true)}
            className="hover:opacity-70 transition-opacity flex items-center space-x-2"
            title="Tìm kiếm (Ctrl + K)"
          >
            <Search size={20} />
            <span className="hidden xl:inline-block text-[10px] font-semibold uppercase tracking-widest text-gray-400 border border-current/20 px-1.5 py-0.5 rounded">
              ⌘K
            </span>
          </button>
          
          {/* User Auth Handling */}
          {user ? (
            <div className="relative group hidden md:block">
              <button className="flex items-center space-x-2 hover:opacity-70 transition-opacity">
                <User size={20} />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white text-black border border-gray-100 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Xin chào,</p>
                  <p className="text-sm font-bold truncate">{user.full_name}</p>
                </div>
                <Link to="/profile" className="block px-5 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-gray-50 transition-colors">Tài khoản</Link>
                <Link to="/orders" className="block px-5 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-gray-50 transition-colors">Đơn hàng</Link>
                <button onClick={logout} className="w-full text-left px-5 py-3 text-xs uppercase tracking-widest font-bold text-red-500 hover:bg-red-50 border-t border-gray-100 transition-colors">
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block hover:opacity-70 transition-opacity">
              <User size={20} />
            </Link>
          )}

          {/* Notification Dropdown for Logged In User */}
          <div className="hidden md:block">
            <NotificationDropdown />
          </div>

          <Link to="/wishlist" className="hidden md:block hover:opacity-70 transition-opacity relative">
            <Heart size={20} />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <button onClick={() => setIsCartOpen(true)} className="hover:opacity-70 transition-opacity relative">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>
          
          {/* Mobile Menu Toggle */}
          <button className="md:hidden hover:opacity-70 transition-opacity" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white text-black shadow-xl border-t border-gray-100 py-6 px-4 flex flex-col space-y-6 text-sm font-semibold uppercase tracking-widest text-center">
          <button 
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsSearchModalOpen(true);
            }} 
            className="flex items-center justify-center space-x-2 text-black bg-gray-50 py-3 border border-gray-200"
          >
            <Search size={16} />
            <span>Tìm kiếm sản phẩm</span>
          </button>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Trang chủ</Link>
          <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Cửa hàng</Link>
          <Link to="/group-buy" onClick={() => setIsMobileMenuOpen(false)}>Mua chung</Link>
          <Link to="/categories" onClick={() => setIsMobileMenuOpen(false)}>Bộ sưu tập</Link>
          <Link to="/gift-cards" onClick={() => setIsMobileMenuOpen(false)}>E-Gift Cards</Link>
          <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)}>Tạp chí</Link>
          
          <div className="border-t border-gray-100 pt-6">
            {user ? (
              <>
                <p className="text-gray-500 text-xs mb-4">Xin chào, {user.full_name}</p>
                <button onClick={() => {logout(); setIsMobileMenuOpen(false);}} className="text-red-500">Đăng xuất</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Đăng nhập / Đăng ký</Link>
            )}
          </div>
        </div>
      )}

    </nav>

      {/* Cart Drawer Component */}
      <CartDrawer />

      {/* Global Real-time Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />

      {/* Global Product Comparison Matrix Modal & Floating Bar */}
      <CompareModal />
      <CompareFloatingBar />
    </>
  );
};

export default Navbar;
