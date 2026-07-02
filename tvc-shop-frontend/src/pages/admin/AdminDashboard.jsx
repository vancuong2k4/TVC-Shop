import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Package, Users, DollarSign, ShoppingBag, TrendingUp, Calendar } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    total_orders: 0,
    total_users: 0,
    total_products: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error("Lỗi khi tải thống kê", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-gray-500 uppercase tracking-widest font-bold">Đang tải dữ liệu...</div>;

  const statCards = [
    { title: 'Doanh Thu', value: formatPrice(stats.revenue || 0), icon: <DollarSign size={24} className="text-green-500" /> },
    { title: 'Đơn Hàng', value: stats.total_orders, icon: <ShoppingBag size={24} className="text-blue-500" /> },
    { title: 'Khách Hàng', value: stats.total_users, icon: <Users size={24} className="text-purple-500" /> },
    { title: 'Sản Phẩm', value: stats.total_products, icon: <Package size={24} className="text-orange-500" /> }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold uppercase tracking-widest mb-8">Tổng Quan</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">{card.title}</p>
              <h3 className="text-2xl font-bold">{card.value}</h3>
            </div>
            <div className="bg-gray-50 p-3 rounded-full">
              {card.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
