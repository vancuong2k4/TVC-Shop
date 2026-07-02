import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, Search, Menu, X, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import CartDrawer from '../cart/CartDrawer';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  const { user, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchKeyword.trim())}`);
      setIsSearchOpen(false);
      setSearchKeyword('');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
    <nav className={`fixed w-full z-50 transition-all duration-300 border-b border-gray-100/20 ${isScrolled ? 'bg-white shadow-md py-4' : 'bg-white/80 backdrop-blur-md py-6 shadow-sm'}`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-[0.2em] uppercase">TVC-Shop</Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-10 text-sm font-semibold uppercase tracking-widest">
          <Link to="/" className="hover:text-gray-500 transition-colors">Trang chủ</Link>
          <Link to="/shop" className="hover:text-gray-500 transition-colors">Cửa hàng</Link>
          <Link to="/categories" className="hover:text-gray-500 transition-colors">Bộ sưu tập</Link>
          <Link to="/blog" className="hover:text-gray-500 transition-colors">Tạp chí</Link>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-6">
          {/* Search Toggle */}
          <div className="relative">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden md:block text-black hover:text-gray-500 transition-colors"
            >
              <Search size={20} />
            </button>
            
            {/* Search Dropdown */}
            <div className={`absolute right-0 top-full mt-6 bg-white shadow-2xl p-4 transition-all duration-300 w-72 border border-gray-100 ${isSearchOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input 
                  type="text" 
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full border-b border-gray-300 pb-2 outline-none text-sm focus:border-black pr-8"
                  autoFocus={isSearchOpen}
                />
                <button type="submit" className="absolute right-0 top-0 text-gray-400 hover:text-black">
                  <Search size={16} />
                </button>
              </form>
            </div>
          </div>
          
          {/* User Auth Handling */}
          {user ? (
            <div className="relative group hidden md:block">
              <button className="flex items-center space-x-2 text-black hover:text-gray-500 transition-colors">
                <User size={20} />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
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
            <Link to="/login" className="hidden md:block text-black hover:text-gray-500 transition-colors">
              <User size={20} />
            </Link>
          )}

          <Link to="/wishlist" className="hidden md:block text-black hover:text-gray-500 transition-colors relative">
            <Heart size={20} />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <button onClick={() => setIsCartOpen(true)} className="text-black hover:text-gray-500 transition-colors relative">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>
          
          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-black" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 py-6 px-4 flex flex-col space-y-6 text-sm font-semibold uppercase tracking-widest text-center">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Trang chủ</Link>
          <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Cửa hàng</Link>
          <Link to="/categories" onClick={() => setIsMobileMenuOpen(false)}>Bộ sưu tập</Link>
          
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
    </>
  );
};

export default Navbar;
