import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Package, Users, DollarSign, ShoppingBag, TrendingUp, Calendar } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    total_orders: 0,
    total_users: 0,
    total_products: 0,
    revenue_chart: [],
    order_status_chart: []
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
      
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doanh thu - Cột rộng 2/3 */}
        <div className="bg-white p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-6">Doanh Thu 6 Tháng Gần Nhất</h3>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={stats.revenue_chart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis 
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6b7280', fontSize: 12}}
                  dx={-10}
                />
                <Tooltip 
                  formatter={(value) => formatPrice(value)}
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                />
                <Bar dataKey="revenue" fill="#111827" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trạng thái đơn - Cột rộng 1/3 */}
        <div className="bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-6">Trạng Thái Đơn Hàng</h3>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={stats.order_status_chart.filter(item => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.order_status_chart.filter(item => item.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
