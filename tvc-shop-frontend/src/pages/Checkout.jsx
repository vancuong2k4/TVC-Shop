import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import { formatPrice } from '../utils/formatPrice';
import { 
  ShieldCheck, CreditCard, Truck, QrCode, CheckCircle2, 
  ExternalLink, ArrowRight, Lock, Check, MapPin, Plus
} from 'lucide-react';

const PAYMENT_METHODS = [
  {
    id: 'cod',
    title: 'Thanh toán khi nhận hàng (COD)',
    description: 'Thanh toán bằng tiền mặt trực tiếp cho nhân viên giao hàng khi nhận kiện.',
    icon: <Truck size={20} className="text-gray-700" />,
    badge: 'Phổ biến'
  },
  {
    id: 'vnpay',
    title: 'Cổng Thanh Toán VNPAY',
    description: 'Quét mã VNPAY-QR qua ứng dụng ngân hàng hoặc thẻ ATM nội địa.',
    icon: <QrCode size={20} className="text-blue-600" />,
    badge: 'Khuyên dùng'
  },
  {
    id: 'momo',
    title: 'Ví Điện Tử MoMo',
    description: 'Quét mã QR MoMo hoặc liên kết tài khoản ví tức thì.',
    icon: <CreditCard size={20} className="text-pink-600" />,
    badge: 'Tiện lợi'
  },
  {
    id: 'credit_card',
    title: 'Thẻ Quốc Tế (Visa / Master / JCB)',
    description: 'Mô phỏng thanh toán thẻ tín dụng / ghi nợ quốc tế an toàn chuẩn 3D-Secure.',
    icon: <Lock size={20} className="text-emerald-600" />,
    badge: 'Bảo mật'
  }
];

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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  
  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState(false);

  const discountAmount = appliedCoupon ? (cartTotal * (appliedCoupon.discount_percentage / 100)) : 0;
  const finalTotal = cartTotal - discountAmount;

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Protected Route: Buộc đăng nhập
  useEffect(() => {
    if (!user) {
      alert("Vui lòng đăng nhập để tiến hành thanh toán!");
      navigate('/login');
    } else {
      const fetchProfileAndAddresses = async () => {
        try {
          const [profileRes, addrRes] = await Promise.all([
            api.get('/users/profile'),
            api.get('/addresses').catch(() => ({ data: { data: [] } }))
          ]);

          const data = profileRes.data;
          const addrs = addrRes.data?.data || [];
          setSavedAddresses(addrs);

          if (addrs.length > 0) {
            const def = addrs.find(a => a.is_default) || addrs[0];
            setSelectedAddressId(def.id);
            setFormData(prev => ({
              ...prev,
              fullName: def.recipient_name || prev.fullName,
              phone: def.phone || prev.phone,
              address: def.address || prev.address,
              city: def.city || prev.city
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              phone: data.phone || prev.phone,
              address: data.address || prev.address
            }));
          }
        } catch (error) {
          console.error("Lỗi khi tải thông tin người dùng", error);
        }
      };
      fetchProfileAndAddresses();
    }
    if (cartItems.length === 0 && !success) {
      navigate('/shop');
    }
  }, [user, cartItems, navigate, success]);

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setFormData(prev => ({
      ...prev,
      fullName: addr.recipient_name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city
    }));
  };

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
        payment_method: selectedPaymentMethod,
        coupon_id: appliedCoupon ? appliedCoupon.id : null,
        total_amount: finalTotal,
        items: cartItems.map(item => ({
          id: item.id,
          price: item.price,
          quantity: item.quantity
        }))
      };

      // 1. Tạo đơn hàng cơ bản
      const response = await api.post('/orders', payload);
      const orderId = response.data.order_id;

      // 2. Xử lý theo phương thức thanh toán
      if (selectedPaymentMethod === 'vnpay') {
        // Gọi API sinh URL VNPay Sandbox
        try {
          const vnpayRes = await api.post('/payment/vnpay/create', {
            order_id: orderId,
            return_url: `${window.location.origin}/orders?payment_status=success&order_id=${orderId}`
          });

          if (vnpayRes.data?.payment_url) {
            clearCart();
            // Điều hướng sang cổng VNPay
            window.location.href = vnpayRes.data.payment_url;
            return;
          }
        } catch (payErr) {
          console.error("Lỗi khởi tạo cổng VNPay:", payErr);
          // Fallback sang mô phỏng nếu sandbox ngoài mạng bị chặn
          await api.post('/payment/simulate', { order_id: orderId, method: 'vnpay' });
        }
      } else if (selectedPaymentMethod === 'momo' || selectedPaymentMethod === 'credit_card') {
        // Mô phỏng thanh toán trực tuyến tức thì
        await api.post('/payment/simulate', { order_id: orderId, method: selectedPaymentMethod });
      }

      // 3. Hoàn tất thành công (COD hoặc thanh toán mô phỏng)
      clearCart();
      setCreatedOrder({ id: orderId, method: selectedPaymentMethod });
      setSuccess(true);
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      alert(error.response?.data?.message || "Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Màn hình hoàn tất thanh toán
  if (success && createdOrder) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-4">
          <div className="max-w-lg w-full text-center bg-gray-50/50 p-10 border border-gray-200 rounded-sm">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={36} strokeWidth={2} />
            </div>

            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 block mb-2">
              Xác Nhận Thành Công
            </span>
            <h1 className="text-3xl font-serif font-bold uppercase tracking-tight text-gray-900 mb-3">
              Đặt Hàng Hoàn Tất!
            </h1>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Cảm ơn bạn đã lựa chọn TVC-Shop. Mã đơn hàng của bạn là{' '}
              <strong className="text-black font-mono">#{createdOrder.id}</strong>.
              {createdOrder.method !== 'cod'
                ? ' Đơn hàng đã được thanh toán trực tuyến thành công.'
                : ' Bạn sẽ thanh toán khi nhân viên giao kiện hàng.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/orders')}
                className="bg-black text-white px-6 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Xem Đơn Hàng</span>
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="border border-black px-6 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
              >
                Tiếp Tục Mua Sắm
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 container mx-auto px-4 md:px-8 lg:px-12">
        <Breadcrumb items={[
          { name: 'Trang chủ', path: '/' },
          { name: 'Giỏ hàng', path: '/cart' },
          { name: 'Thanh toán', path: '' }
        ]} />

        <div className="border-b border-gray-200 pb-6 mb-12">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 block mb-1">
            Giao Dịch An Toàn
          </span>
          <h1 className="text-4xl font-serif font-bold uppercase tracking-tight text-gray-900">
            Thanh Toán Đơn Hàng
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Cột Trái: Thông tin giao hàng & Lựa chọn Cổng Thanh Toán */}
          <div className="flex-1 w-full space-y-10">
            
            {/* 1. Thông Tin Nhận Hàng */}
            <div className="bg-white">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
                <h2 className="text-lg font-bold uppercase tracking-widest">
                  1. Địa Chỉ Nhận Hàng
                </h2>
                <Link to="/profile" className="text-[10px] font-bold text-zinc-500 hover:text-black uppercase tracking-widest flex items-center space-x-1">
                  <MapPin size={12} />
                  <span>Quản lý sổ địa chỉ</span>
                </Link>
              </div>

              {/* Saved Address Selector */}
              {savedAddresses.length > 0 && (
                <div className="mb-6 space-y-3">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                    Chọn nhanh từ sổ địa chỉ đã lưu:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map((addr) => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => handleSelectSavedAddress(addr)}
                        className={`p-3.5 border text-left transition-all ${
                          selectedAddressId === addr.id
                            ? 'border-black bg-zinc-50 shadow-sm ring-1 ring-black'
                            : 'border-gray-200 bg-white hover:border-gray-400'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                            {addr.label || 'Địa chỉ'}
                          </span>
                          {addr.is_default && (
                            <span className="text-[9px] bg-black text-white px-1.5 py-0.5 font-bold uppercase">Mặc định</span>
                          )}
                        </div>
                        <p className="font-bold text-xs text-black font-serif truncate">{addr.recipient_name} - <span className="font-sans font-normal text-gray-600">{addr.phone}</span></p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{addr.address}, {addr.city}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Họ và Tên</label>
                    <input 
                      type="text" 
                      name="fullName" 
                      value={formData.fullName} 
                      onChange={handleChange} 
                      required 
                      className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Số Điện Thoại</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      required 
                      placeholder="0912 345 678"
                      className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Tỉnh / Thành Phố</label>
                    <input 
                      type="text" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleChange} 
                      required 
                      placeholder="Hà Nội, TP.HCM, Đà Nẵng..."
                      className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Địa Chỉ Chi Tiết (Số nhà, Tên đường)</label>
                    <input 
                      type="text" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleChange} 
                      required 
                      placeholder="Số 123, đường Lê Lợi, Phường 1..."
                      className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black" 
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* 2. Cổng Thanh Toán Trực Tuyến */}
            <div>
              <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-gray-200 pb-3 flex items-center justify-between">
                <span>2. Phương Thức Thanh Toán</span>
                <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest flex items-center space-x-1">
                  <ShieldCheck size={14} />
                  <span>Mã hóa SSL 256-bit</span>
                </span>
              </h2>

              <div className="space-y-3.5">
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = selectedPaymentMethod === method.id;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`p-4 border rounded-sm cursor-pointer transition-all duration-200 flex items-start space-x-4 ${
                        isSelected 
                          ? 'border-black bg-gray-50/80 shadow-sm ring-1 ring-black' 
                          : 'border-gray-200 hover:border-gray-400 bg-white'
                      }`}
                    >
                      <div className="mt-0.5">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          isSelected ? 'border-black bg-black' : 'border-gray-300'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>

                      <div className="p-2 bg-white rounded-sm border border-gray-100 flex-shrink-0">
                        {method.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                            {method.title}
                          </h4>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                            isSelected ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {method.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedPaymentMethod === 'vnpay' && (
                <div className="mt-4 p-4 bg-blue-50/70 border border-blue-200 rounded-sm text-xs text-blue-900 leading-relaxed flex items-center space-x-3">
                  <QrCode size={20} className="text-blue-600 flex-shrink-0" />
                  <span>
                    Sau khi ấn <strong>Đặt Hàng</strong>, hệ thống sẽ chuyển hướng bạn đến cổng VNPay Sandbox để xác thực giao dịch an toàn.
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Cột Phải: Tóm tắt đơn hàng */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-gray-50 p-6 md:p-8 border border-gray-200 rounded-sm sticky top-28">
              <h2 className="text-base font-bold uppercase tracking-widest mb-6 border-b border-gray-200 pb-4">
                Tóm Tắt Đơn Hàng ({cartItems.length})
              </h2>
              
              {/* Cart Items List */}
              <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-1 divide-y divide-gray-100">
                {cartItems.map((item, index) => (
                  <div key={index} className="pt-3 first:pt-0 flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-12 h-16 bg-gray-100 flex-shrink-0 rounded-sm overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold uppercase tracking-wider truncate w-36 text-gray-900">{item.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">SIZE: {item.size} | SL: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="border-t border-gray-200 pt-4 space-y-3 text-xs uppercase tracking-wider">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Tạm tính</span>
                  <span className="font-bold text-gray-900">{formatPrice(cartTotal)}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Giảm giá ({appliedCoupon.discount_percentage}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Phí vận chuyển</span>
                  <span className="text-emerald-600 font-bold">Miễn phí</span>
                </div>
              </div>

              {/* Coupon / Gift Card Input */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Mã Giảm Giá / Thẻ Quà Tặng
                  </label>
                  <Link to="/gift-cards" target="_blank" className="text-[10px] uppercase font-bold text-black hover:underline">
                    Mua E-Gift Card
                  </Link>
                </div>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    value={couponCode} 
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={appliedCoupon !== null}
                    placeholder="MÃ COUPON / E-GIFT CARD..." 
                    className="flex-1 border border-gray-300 p-2.5 outline-none focus:border-black text-xs uppercase font-bold tracking-widest bg-white disabled:bg-gray-100" 
                  />
                  {appliedCoupon ? (
                    <button 
                      type="button"
                      onClick={() => { setAppliedCoupon(null); setCouponCode(''); setCouponMessage(''); }}
                      className="bg-rose-500 text-white px-3 font-bold uppercase tracking-widest text-[10px] hover:bg-rose-600 transition-colors"
                    >
                      Hủy
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-black text-white px-4 font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors"
                    >
                      Áp Dụng
                    </button>
                  )}
                </div>
                {couponMessage && (
                  <p className={`mt-2 text-[11px] font-bold uppercase tracking-wider ${couponError ? 'text-rose-500' : 'text-emerald-600'}`}>
                    {couponMessage}
                  </p>
                )}
              </div>

              {/* Grand Total */}
              <div className="border-t border-gray-200 mt-6 pt-6 flex justify-between items-center mb-6">
                <span className="font-bold uppercase tracking-widest text-sm text-gray-900">Tổng Thanh Toán</span>
                <span className="text-2xl font-bold text-gray-900">{formatPrice(finalTotal)}</span>
              </div>

              {/* Submit Checkout Button */}
              <button 
                type="submit" 
                form="checkout-form"
                disabled={loading}
                className="w-full bg-black text-white font-bold uppercase tracking-widest py-4 text-xs hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2 shadow-sm"
              >
                <span>{loading ? 'Đang Xử Lý Giao Dịch...' : 'Xác Nhận & Đặt Hàng'}</span>
                {!loading && <ArrowRight size={14} />}
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
