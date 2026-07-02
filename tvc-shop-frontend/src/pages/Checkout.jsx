import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import { formatPrice } from '../utils/formatPrice';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    phone: '',
    address: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState(false);

  const discountAmount = appliedCoupon ? (cartTotal * (appliedCoupon.discount_percentage / 100)) : 0;
  const finalTotal = cartTotal - discountAmount;

  // Protected Route: Buộc đăng nhập
  useEffect(() => {
    if (!user) {
      alert("Vui lòng đăng nhập để tiến hành thanh toán!");
      navigate('/login');
    } else {
      // Fetch user profile to prepopulate phone and address
      const fetchProfile = async () => {
        try {
          const response = await api.get('/users/profile');
          const data = response.data;
          setFormData(prev => ({
            ...prev,
            phone: data.phone || prev.phone,
            address: data.address || prev.address
          }));
        } catch (error) {
          console.error("Lỗi khi tải thông tin người dùng", error);
        }
      };
      fetchProfile();
    }
    if (cartItems.length === 0 && !success) {
      navigate('/shop');
    }
  }, [user, cartItems, navigate, success]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      const response = await api.get(`/coupons/validate?code=${couponCode}`);
      setAppliedCoupon(response.data.data);
      setCouponMessage(response.data.message);
      setCouponError(false);
    } catch (error) {
      setAppliedCoupon(null);
      setCouponMessage(error.response?.data?.message || 'Mã không hợp lệ');
      setCouponError(true);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fullAddress = `${formData.address}, ${formData.city}`;
      const payload = {
        shipping_address: fullAddress,
        payment_method: 'cod',
        coupon_id: appliedCoupon ? appliedCoupon.id : null,
        total_amount: finalTotal,
        items: cartItems.map(item => ({
          id: item.id,
          price: item.price,
          quantity: item.quantity
        }))
      };

      const response = await api.post('/orders', payload);
      
      if (response.status === 201) {
        setSuccess(true);
        clearCart();
      }
    } catch (error) {
      alert("Đặt hàng thất bại: " + (error.response?.data?.message || "Lỗi không xác định"));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; // Tránh nháy giao diện khi đang redirect

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-24 pb-20 bg-gray-50">
          <div className="text-center max-w-lg px-8 bg-white py-16 shadow-lg border-t-4 border-black">
            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-3xl font-bold uppercase tracking-widest mb-6">Cảm ơn bạn!</h1>
            <p className="text-gray-500 mb-10 leading-relaxed text-sm">Đơn hàng của bạn đã được lưu thành công vào cơ sở dữ liệu và đang trong quá trình xử lý. Chúng tôi sẽ liên hệ để xác nhận sớm nhất.</p>
            <Link to="/shop" className="btn-outline inline-block px-10">Tiếp Tục Mua Sắm</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 md:px-8 pt-32 pb-20">
        <Breadcrumb items={[
          { name: 'Trang chủ', path: '/' },
          { name: 'Thanh toán', path: '' }
        ]} />
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-10 border-b border-gray-200 pb-6">Thanh Toán</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Cột Trái: Thông tin giao hàng */}
          <div className="lg:w-2/3 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-8 border-l-4 border-black pl-3">Thông Tin Giao Hàng</h2>
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Họ và Tên</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full border-b border-gray-300 py-3 outline-none focus:border-black bg-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Số Điện Thoại</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full border-b border-gray-300 py-3 outline-none focus:border-black bg-transparent" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Thành Phố / Tỉnh</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full border-b border-gray-300 py-3 outline-none focus:border-black bg-transparent" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Địa Chỉ Chi Tiết (Số nhà, Đường)</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full border-b border-gray-300 py-3 outline-none focus:border-black bg-transparent" />
              </div>

              <div className="pt-8 border-t border-gray-100 mt-8">
                <h3 className="text-lg font-bold uppercase tracking-widest mb-6 border-l-4 border-black pl-3">Phương Thức Thanh Toán</h3>
                <label className="flex items-center space-x-4 p-5 border border-black bg-gray-50 cursor-pointer">
                  <input type="radio" checked readOnly className="form-radio text-black focus:ring-black accent-black w-5 h-5" />
                  <span className="font-bold text-sm uppercase tracking-wider">Thanh toán khi nhận hàng (COD)</span>
                </label>
              </div>
            </form>
          </div>

          {/* Cột Phải: Tóm tắt đơn hàng */}
          <div className="lg:w-1/3">
            <div className="bg-white p-8 shadow-sm sticky top-32 border border-gray-100">
              <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Tóm tắt Đơn Hàng ({cartItems.length})</h2>
              
              <div className="space-y-6 mb-8 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-20 bg-gray-100 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold uppercase tracking-wider line-clamp-1 w-32">{item.name}</p>
                        <p className="text-[10px] font-semibold text-gray-500 uppercase mt-1">MÀU: {item.color} | SIZE: {item.size} x {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-4 text-sm font-semibold uppercase tracking-widest">
                <div className="flex justify-between text-gray-500">
                  <span>Tạm tính</span>
                  <span className="text-black">{formatPrice(cartTotal)}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá ({appliedCoupon.discount_percentage}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-500">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
              </div>

              {/* Coupon Input */}
              <div className="mt-6 border-t border-gray-100 pt-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Mã Giảm Giá</label>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    value={couponCode} 
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={appliedCoupon !== null}
                    placeholder="Nhập mã..." 
                    className="flex-1 border border-gray-300 px-3 py-2 outline-none focus:border-black text-sm uppercase font-bold tracking-widest disabled:bg-gray-100" 
                  />
                  {appliedCoupon ? (
                    <button 
                      onClick={() => { setAppliedCoupon(null); setCouponCode(''); setCouponMessage(''); }}
                      className="bg-red-500 text-white px-4 font-bold uppercase tracking-widest text-xs hover:bg-red-600"
                    >
                      Hủy Mã
                    </button>
                  ) : (
                    <button 
                      onClick={handleApplyCoupon}
                      className="bg-black text-white px-4 font-bold uppercase tracking-widest text-xs hover:bg-gray-800"
                    >
                      Áp Dụng
                    </button>
                  )}
                </div>
                {couponMessage && (
                  <p className={`mt-2 text-xs font-bold uppercase tracking-wider ${couponError ? 'text-red-500' : 'text-green-500'}`}>
                    {couponMessage}
                  </p>
                )}
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6 flex justify-between items-center mb-8">
                <span className="font-bold uppercase tracking-widest text-lg">Tổng Cộng</span>
                <span className="text-3xl font-bold">{formatPrice(finalTotal)}</span>
              </div>

              <button 
                type="submit" 
                form="checkout-form"
                disabled={loading}
                className="w-full bg-black text-white font-bold uppercase tracking-widest py-5 hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Đang Xử Lý...' : 'Đặt Hàng Ngay'}
              </button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
