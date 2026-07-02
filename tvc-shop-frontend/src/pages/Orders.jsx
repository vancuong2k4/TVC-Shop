import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'pending': return { text: 'Chờ xác nhận', color: 'text-orange-500', icon: <Clock size={16} /> };
      case 'processing': return { text: 'Đang xử lý', color: 'text-blue-500', icon: <Package size={16} /> };
      case 'shipped': return { text: 'Đang giao hàng', color: 'text-purple-500', icon: <Package size={16} /> };
      case 'delivered': return { text: 'Đã giao thành công', color: 'text-green-500', icon: <CheckCircle size={16} /> };
      case 'cancelled': return { text: 'Đã hủy', color: 'text-red-500', icon: <XCircle size={16} /> };
      default: return { text: status, color: 'text-gray-500', icon: <Clock size={16} /> };
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 md:px-8 pt-32 pb-20 max-w-5xl">
        <Breadcrumb items={[
          { name: 'Trang chủ', path: '/' },
          { name: 'Tài khoản', path: '/profile' },
          { name: 'Đơn hàng', path: '' }
        ]} />
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-10 border-b border-gray-200 pb-6">Đơn Hàng Của Tôi</h1>

        {loading ? (
          <div className="text-center py-20 text-gray-500 uppercase tracking-widest">Đang tải dữ liệu...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-16 text-center shadow-sm">
            <Package size={56} className="mx-auto text-gray-300 mb-6" strokeWidth={1} />
            <p className="text-gray-500 uppercase tracking-widest mb-8 font-semibold">Bạn chưa có đơn hàng nào.</p>
            <button onClick={() => navigate('/shop')} className="btn-outline px-10">Bắt Đầu Mua Sắm</button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map(order => {
              const statusDisplay = getStatusDisplay(order.status);
              return (
                <div key={order.id} className="bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  
                  {/* Header Order Card */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest">Mã Đơn: #{order.id}</p>
                      <p className="text-xs text-gray-500 mt-1 font-semibold">{formatDate(order.created_at)}</p>
                    </div>
                    <div className={`flex items-center space-x-2 text-sm font-bold uppercase tracking-widest ${statusDisplay.color}`}>
                      {statusDisplay.icon}
                      <span>{statusDisplay.text}</span>
                    </div>
                  </div>

                  {/* Body Order Card */}
                  <div className="p-6">
                    <div className="space-y-6">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex gap-6 items-center">
                          <div className="w-20 h-28 bg-gray-100 flex-shrink-0">
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow">
                            <p className="font-bold text-sm uppercase tracking-wider mb-2">{item.name}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Số lượng: {item.quantity}</p>
                          </div>
                          <div className="font-bold text-lg">
                            {formatPrice(item.price)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Order Card */}
                  <div className="bg-white px-6 py-5 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Tổng Tiền</span>
                    <span className="text-2xl font-bold">{formatPrice(order.total_amount)}</span>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
