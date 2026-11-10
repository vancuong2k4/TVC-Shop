import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import { Package, Clock, CheckCircle, XCircle, CreditCard, ShieldCheck, AlertCircle, ArrowRight, Truck } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';
import OrderTrackingModal from '../components/order/OrderTrackingModal';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingOrderId, setTrackingOrderId] = useState(null);

  // Check if returning from VNPay / Online payment
  const paymentStatus = searchParams.get('payment_status');
  const paidOrderId = searchParams.get('order_id');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (error) {
        console.error("Lỗi khi tải đơn hàng", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const getStatusDisplay = (status, paymentStatus = 'unpaid', paymentMethod = 'cod') => {
    switch (status) {
      case 'pending': 
        return { 
          text: 'Chờ xác nhận', 
          color: 'text-amber-600', 
          badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Clock size={16} /> 
        };
      case 'processing': 
        return { 
          text: 'Đang xử lý / Đã thanh toán', 
          color: 'text-blue-600', 
          badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <Package size={16} /> 
        };
      case 'shipped': 
        return { 
          text: 'Đang giao hàng', 
          color: 'text-purple-600', 
          badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: <Package size={16} /> 
        };
      case 'delivered': 
        return { 
          text: 'Đã giao thành công', 
          color: 'text-emerald-600', 
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle size={16} /> 
        };
      case 'cancelled': 
        return { 
          text: 'Đã hủy', 
          color: 'text-rose-600', 
          badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <XCircle size={16} /> 
        };
      default: 
        return { 
          text: status, 
          color: 'text-gray-500', 
          badgeBg: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: <Clock size={16} /> 
        };
    }
  };

  const getPaymentMethodLabel = (method, payStatus) => {
    let name = 'Thanh toán COD';
    if (method === 'vnpay') name = 'Cổng VNPay';
    else if (method === 'momo') name = 'Ví MoMo';
    else if (method === 'credit_card') name = 'Thẻ Quốc Tế';

    const isPaid = payStatus === 'paid';
    return {
      name,
      isPaid,
      label: isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'
    };
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 md:px-8 pt-32 pb-24 max-w-5xl">
        <Breadcrumb items={[
          { name: 'Trang chủ', path: '/' },
          { name: 'Tài khoản', path: '/profile' },
          { name: 'Đơn hàng', path: '' }
        ]} />

        {/* Payment Return Notification Banner */}
        {paymentStatus && (
          <div className={`mb-8 p-5 rounded-sm border flex items-start space-x-3.5 animate-slide-down ${
            paymentStatus === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            {paymentStatus === 'success' ? (
              <ShieldCheck size={24} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={24} className="text-rose-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h3 className="font-bold uppercase tracking-wider text-sm mb-1">
                {paymentStatus === 'success' 
                  ? 'Giao Dịch Trực Tuyến Thành Công!' 
                  : 'Giao Dịch Thanh Toán Không Thành Công'}
              </h3>
              <p className="text-xs leading-relaxed opacity-90">
                {paymentStatus === 'success'
                  ? `Đơn hàng #${paidOrderId || ''} của bạn đã được xác nhận thanh toán trực tuyến thành công. TVC-Shop đang chuẩn bị đóng gói sản phẩm!`
                  : `Thanh toán cho đơn hàng #${paidOrderId || ''} đã bị hủy hoặc có sự cố. Bạn có thể chọn thanh toán COD khi nhận hàng.`}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between sm:items-end border-b border-gray-200 pb-6 mb-10 gap-4">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 block mb-1">
              Lịch Sử Mua Hàng
            </span>
            <h1 className="text-3xl font-serif font-bold uppercase tracking-tight text-gray-900">
              Đơn Hàng Của Tôi
            </h1>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Tổng cộng: {orders.length} đơn
          </span>
        </div>

        {loading ? (
          <div className="text-center py-24 text-gray-400 uppercase tracking-widest font-bold text-xs animate-pulse">
            Đang tải dữ liệu đơn hàng...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-16 text-center border border-gray-200 shadow-sm rounded-sm">
            <Package size={56} className="mx-auto text-gray-300 mb-6" strokeWidth={1} />
            <p className="text-gray-500 uppercase tracking-widest mb-6 font-semibold text-sm">
              Bạn chưa có đơn hàng nào tại TVC-Shop.
            </p>
            <button 
              onClick={() => navigate('/shop')} 
              className="border border-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              Bắt Đầu Khám Phá Cửa Hàng
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map(order => {
              const statusDisplay = getStatusDisplay(order.status);
              const payInfo = getPaymentMethodLabel(order.payment_method, order.payment_status);

              return (
                <div 
                  key={order.id} 
                  className="bg-white shadow-sm border border-gray-200 rounded-sm overflow-hidden hover:border-gray-400 transition-all"
                >
                  {/* Header Order Card */}
                  <div className="bg-gray-50/70 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-bold uppercase tracking-widest text-gray-900">
                        Đơn hàng #{order.id}
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="text-xs text-gray-500 font-medium">
                        {formatDate(order.created_at)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Payment method badge */}
                      <span className="text-[11px] font-semibold text-gray-600 bg-white border border-gray-200 px-2.5 py-1 rounded-sm flex items-center space-x-1">
                        <CreditCard size={12} className="text-gray-400" />
                        <span>{payInfo.name}</span>
                        <span className={`ml-1 text-[10px] font-bold ${payInfo.isPaid ? 'text-emerald-600' : 'text-gray-400'}`}>
                          ({payInfo.label})
                        </span>
                      </span>

                      {/* Status Badge */}
                      <div className={`flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm border ${statusDisplay.badgeBg}`}>
                        {statusDisplay.icon}
                        <span>{statusDisplay.text}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Order Card: Items */}
                  <div className="p-6 divide-y divide-gray-100">
                    {order.items.map((item, index) => (
                      <div key={index} className="py-4 first:pt-0 last:pb-0 flex gap-5 items-center">
                        <div className="w-16 h-20 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0 border border-gray-100">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">No img</div>
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="font-serif font-medium text-sm text-gray-900 line-clamp-1 mb-1">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-gray-500 uppercase tracking-wider">
                            Số lượng: <span className="font-bold text-gray-900">{item.quantity}</span>
                          </p>
                        </div>
                        <div className="font-bold text-sm text-gray-900 flex-shrink-0">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer Order Card */}
                  <div className="bg-gray-50/30 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <button
                      onClick={() => setTrackingOrderId(order.id)}
                      className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-black hover:text-zinc-600 transition-colors py-1"
                    >
                      <Truck size={15} />
                      <span>Theo Dõi Vận Chuyển Real-time</span>
                    </button>

                    <div className="flex items-center space-x-4 self-end sm:self-auto">
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                        Tổng Thanh Toán:
                      </span>
                      <span className="text-xl font-bold text-gray-900 font-serif">
                        {formatPrice(order.total_amount)}
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Live Order Tracking Modal */}
      <OrderTrackingModal
        orderId={trackingOrderId}
        isOpen={trackingOrderId !== null}
        onClose={() => setTrackingOrderId(null)}
      />

      <Footer />
    </div>
  );
};

export default Orders;
