import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { formatPrice } from '../../utils/formatPrice';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await api.put(`/admin/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái", error);
      alert("Cập nhật thất bại!");
    } finally {
      setUpdating(null);
    }
  };

  const statusColors = {
    pending: 'bg-orange-100 text-orange-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  if (loading) return <div className="text-gray-500 uppercase tracking-widest font-bold">Đang tải dữ liệu...</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold uppercase tracking-widest mb-8">Quản lý Đơn hàng</h2>

      <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Mã Đơn</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Khách Hàng</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Ngày Đặt</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Tổng Tiền</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Trạng Thái</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500 uppercase tracking-widest">Không có đơn hàng nào</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-bold">#{order.id}</td>
                  <td className="p-4">
                    <p className="font-bold text-sm uppercase tracking-wider">{order.full_name}</p>
                    <p className="text-xs text-gray-500">{order.email}</p>
                  </td>
                  <td className="p-4 text-sm font-semibold text-gray-600">{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                  <td className="p-4 font-bold text-lg">{formatPrice(order.total_amount)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select 
                      disabled={updating === order.id}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-xs font-bold uppercase tracking-wider outline-none focus:border-black bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
