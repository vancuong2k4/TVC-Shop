import React from 'react';
import { X } from 'lucide-react';

const ShopSidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />
      
      {/* Sidebar Content */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white p-8 overflow-y-auto transition-transform duration-300 lg:transform-none lg:w-full lg:p-0 lg:block lg:border-none border-r border-gray-100 shadow-2xl lg:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="flex justify-between items-center mb-8 lg:hidden">
          <h2 className="text-xl font-bold uppercase tracking-widest">Bộ Lọc</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Categories Filter */}
        <div className="mb-10">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-200 pb-3">Danh Mục</h3>
          <ul className="space-y-4">
            <li><label className="flex items-center space-x-3 cursor-pointer group"><input type="checkbox" className="form-checkbox text-black focus:ring-black w-4 h-4" defaultChecked /> <span className="text-sm text-gray-600 group-hover:text-black transition-colors">Tất cả sản phẩm</span></label></li>
            <li><label className="flex items-center space-x-3 cursor-pointer group"><input type="checkbox" className="form-checkbox text-black focus:ring-black w-4 h-4" /> <span className="text-sm text-gray-600 group-hover:text-black transition-colors">Áo sơ mi & Áo phông</span></label></li>
            <li><label className="flex items-center space-x-3 cursor-pointer group"><input type="checkbox" className="form-checkbox text-black focus:ring-black w-4 h-4" /> <span className="text-sm text-gray-600 group-hover:text-black transition-colors">Quần âu & Quần Jeans</span></label></li>
            <li><label className="flex items-center space-x-3 cursor-pointer group"><input type="checkbox" className="form-checkbox text-black focus:ring-black w-4 h-4" /> <span className="text-sm text-gray-600 group-hover:text-black transition-colors">Áo khoác Blazer</span></label></li>
            <li><label className="flex items-center space-x-3 cursor-pointer group"><input type="checkbox" className="form-checkbox text-black focus:ring-black w-4 h-4" /> <span className="text-sm text-gray-600 group-hover:text-black transition-colors">Phụ kiện & Giày</span></label></li>
          </ul>
        </div>

        {/* Price Filter */}
        <div className="mb-10">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-200 pb-3">Mức Giá</h3>
          <ul className="space-y-4">
            <li><label className="flex items-center space-x-3 cursor-pointer group"><input type="radio" name="price" className="form-radio text-black focus:ring-black w-4 h-4" defaultChecked /> <span className="text-sm text-gray-600 group-hover:text-black transition-colors">Tất cả khoảng giá</span></label></li>
            <li><label className="flex items-center space-x-3 cursor-pointer group"><input type="radio" name="price" className="form-radio text-black focus:ring-black w-4 h-4" /> <span className="text-sm text-gray-600 group-hover:text-black transition-colors">Dưới 1.250.000 ₫</span></label></li>
            <li><label className="flex items-center space-x-3 cursor-pointer group"><input type="radio" name="price" className="form-radio text-black focus:ring-black w-4 h-4" /> <span className="text-sm text-gray-600 group-hover:text-black transition-colors">1.250.000 ₫ - 2.500.000 ₫</span></label></li>
            <li><label className="flex items-center space-x-3 cursor-pointer group"><input type="radio" name="price" className="form-radio text-black focus:ring-black w-4 h-4" /> <span className="text-sm text-gray-600 group-hover:text-black transition-colors">Trên 2.500.000 ₫</span></label></li>
          </ul>
        </div>

        {/* Size Filter */}
        <div className="mb-10">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-200 pb-3">Kích Cỡ</h3>
          <div className="flex flex-wrap gap-2">
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
              <button key={size} className="w-10 h-10 border border-gray-300 flex items-center justify-center text-xs hover:border-black hover:bg-black hover:text-white transition-colors">
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-gray-200 pb-3">Màu Sắc</h3>
          <div className="flex flex-wrap gap-4">
            <button className="w-7 h-7 rounded-full bg-black ring-2 ring-offset-2 ring-gray-300 cursor-pointer"></button>
            <button className="w-7 h-7 rounded-full bg-white border border-gray-300 cursor-pointer"></button>
            <button className="w-7 h-7 rounded-full bg-gray-400 cursor-pointer"></button>
            <button className="w-7 h-7 rounded-full bg-[#8b4513] cursor-pointer"></button>
            <button className="w-7 h-7 rounded-full bg-blue-900 cursor-pointer"></button>
            <button className="w-7 h-7 rounded-full bg-[#556b2f] cursor-pointer"></button>
          </div>
        </div>

      </div>
    </>
  );
};

export default ShopSidebar;
