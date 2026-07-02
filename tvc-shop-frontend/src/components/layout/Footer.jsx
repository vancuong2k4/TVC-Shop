import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black text-white pt-24 pb-12 overflow-hidden border-t border-gray-800">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-50"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gray-800 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-800 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          {/* Brand & Contact */}
          <div className="space-y-8">
            <Link to="/" className="inline-block group">
              <h3 className="text-4xl font-extrabold tracking-tighter uppercase mb-2">
                TVC<span className="font-light text-gray-400 group-hover:text-white transition-colors duration-300">Shop</span>
              </h3>
              <div className="h-1 w-12 bg-white rounded-full transform origin-left group-hover:scale-x-150 transition-transform duration-300"></div>
            </Link>
            
            <p className="text-gray-400 text-base leading-relaxed pr-4">
              Định hình phong cách tối giản. Chúng tôi mang đến những sản phẩm thời trang cao cấp với thiết kế tinh tế và chất lượng vượt trội.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Hotline CSKH</p>
                  <p className="text-base font-medium text-gray-200 group-hover:text-white transition-colors">0326 570 425</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Tổng đài dịch vụ</p>
                  <p className="text-base font-medium text-gray-200 group-hover:text-white transition-colors">1900 xxxx</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email hỗ trợ</p>
                  <p className="text-base font-medium text-gray-200 group-hover:text-white transition-colors">cuongtran190404@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Links 1 */}
          <div className="lg:pl-8">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-white relative inline-block">
              Khám Phá
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-gray-600"></span>
            </h4>
            <ul className="space-y-4 text-base text-gray-400">
              <li><Link to="/shop" className="inline-block hover:-translate-y-1 hover:text-white transition-all duration-300">Sản phẩm mới</Link></li>
              <li><Link to="/shop" className="inline-block hover:-translate-y-1 hover:text-white transition-all duration-300">Bán chạy nhất</Link></li>
              <li><Link to="/categories" className="inline-block hover:-translate-y-1 hover:text-white transition-all duration-300">Bộ sưu tập</Link></li>
              <li><Link to="/blog" className="inline-block hover:-translate-y-1 hover:text-white transition-all duration-300">Tạp chí thời trang</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-white relative inline-block">
              Hỗ Trợ
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-gray-600"></span>
            </h4>
            <ul className="space-y-4 text-base text-gray-400">
              <li><Link to="#" className="inline-block hover:-translate-y-1 hover:text-white transition-all duration-300">Chính sách đổi trả</Link></li>
              <li><Link to="#" className="inline-block hover:-translate-y-1 hover:text-white transition-all duration-300">Câu hỏi thường gặp (FAQ)</Link></li>
              <li><Link to="#" className="inline-block hover:-translate-y-1 hover:text-white transition-all duration-300">Hướng dẫn chọn size</Link></li>
              <li><Link to="#" className="inline-block hover:-translate-y-1 hover:text-white transition-all duration-300">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-white relative inline-block">
              Bản Tin TVC
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-gray-600"></span>
            </h4>
            <p className="text-base text-gray-400 mb-6 leading-relaxed">Đăng ký để nhận thông tin về bộ sưu tập mới và ưu đãi độc quyền 10%.</p>
            
            <form className="relative mt-4">
              <input 
                type="email" 
                placeholder="Nhập email của bạn..." 
                className="w-full bg-gray-900 border border-gray-700 rounded-full py-4 pl-6 pr-32 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
              />
              <button 
                type="submit" 
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-white text-black px-6 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-gray-200 hover:scale-105 transition-all duration-300"
              >
                Đăng ký
              </button>
            </form>

            {/* Socials */}
            <div className="flex space-x-4 mt-10">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-black hover:bg-white hover:border-white transition-all duration-300 hover:-translate-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-black hover:bg-white hover:border-white transition-all duration-300 hover:-translate-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-black hover:bg-white hover:border-white transition-all duration-300 hover:-translate-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 font-medium">
          <p className="mb-4 md:mb-0">&copy; 2026 TVC-Shop. Tất cả các quyền được bảo lưu.</p>
          <div className="flex space-x-6">
            <Link to="#" className="hover:text-white transition-colors duration-300 relative group">
              Điều khoản sử dụng
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="#" className="hover:text-white transition-colors duration-300 relative group">
              Chính sách bảo mật
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
