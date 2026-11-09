import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { 
  Package, Users, DollarSign, ShoppingBag, TrendingUp, TrendingDown,
  Calendar, ArrowUpRight, Clock, Award, ChevronRight, RefreshCw, Eye
} from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';

const TIME_RANGES = [
  { id: '7_days', label: '7 ngày qua' },
  { id: '30_days', label: '30 ngày qua' },
  { id: '6_months', label: '6 tháng qua' },
  { id: '1_year', label: '1 năm qua' }
];

const STATUS_LABELS = {
  pending: { label: 'Chờ xử lý', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  processing: { label: 'Đang xử lý', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  shipped: { label: 'Đang giao', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
  delivered: { label: 'Đã giao', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Đã hủy', bg: 'bg-rose-50 text-rose-700 border-rose-200' }
};

const AdminDashboard = () => {
  const [range, setRange] = useState('6_months');
  const [stats, setStats] = useState({
    revenue: 0,
    revenue_growth: 0,
    total_orders: 0,
    orders_growth: 0,
    total_users: 0,
    total_products: 0,
    aov: 0,
    revenue_chart: [],
    order_status_chart: [],
    top_products: [],
    recent_orders: []
  });
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('area'); // 'area' | 'bar'

  const fetchStats = async (selectedRange = range) => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/dashboard?range=${selectedRange}`);
      setStats(response.data);
    } catch (error) {
      console.error("Lỗi khi tải thống kê", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(range);
  }, [range]);

  const statCards = [
    { 
      title: 'Doanh Thu', 
      value: formatPrice(stats.revenue || 0), 
      growth: stats.revenue_growth,
      note: 'so với kỳ trước',
      icon: <DollarSign size={20} className="text-emerald-600" />,
      iconBg: 'bg-emerald-50'
    },
    { 
      title: 'Số Đơn Hàng', 
      value: stats.total_orders, 
      growth: stats.orders_growth,
      note: 'so với kỳ trước',
      icon: <ShoppingBag size={20} className="text-blue-600" />,
      iconBg: 'bg-blue-50'
    },
    { 
      title: 'Giá Trị Đơn TB (AOV)', 
      value: formatPrice(stats.aov || 0), 
      note: 'trên mỗi đơn thành công',
      icon: <TrendingUp size={20} className="text-amber-600" />,
      iconBg: 'bg-amber-50'
    },
    { 
      title: 'Tổng Khách Hàng', 
      value: stats.total_users, 
      subValue: `${stats.total_products} sản phẩm`,
      note: 'tài khoản đang hoạt động',
      icon: <Users size={20} className="text-purple-600" />,
      iconBg: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 block mb-1">
            Hệ Thống Quản Trị
          </span>
          <h2 className="text-3xl font-serif font-bold uppercase tracking-tight text-gray-900">
            Bảng Phân Tích & Doanh Thu
          </h2>
        </div>

        {/* Time Range Filter Bar */}
        <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-sm border border-gray-200">
          {TIME_RANGES.map((t) => (
            <button
              key={t.id}
              onClick={() => setRange(t.id)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all ${
                range === t.id
                  ? 'bg-black text-white shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {t.label}
            </button>
          ))}
          <button
            onClick={() => fetchStats(range)}
            className="p-1.5 text-gray-500 hover:text-black hover:rotate-180 transition-all duration-300"
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div 
            key={idx} 
            className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm hover:border-black transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-sm ${card.iconBg}`}>
                {card.icon}
              </div>
            </div>

            <div className="mb-2">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                {card.value}
              </h3>
            </div>

            <div className="flex items-center text-xs text-gray-500">
              {card.growth !== undefined ? (
                <span className={`inline-flex items-center font-bold mr-2 ${
                  card.growth >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {card.growth >= 0 ? (
                    <TrendingUp size={14} className="mr-0.5" />
                  ) : (
                    <TrendingDown size={14} className="mr-0.5" />
                  )}
                  {card.growth >= 0 ? `+${card.growth}%` : `${card.growth}%`}
                </span>
              ) : null}
              <span className="text-gray-400">{card.note}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doanh thu theo thời gian - 2/3 Cột */}
        <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">
                Xu Hướng Doanh Thu
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Biểu đồ biến động doanh thu theo thời gian</p>
            </div>

            {/* Chart Type Toggle */}
            <div className="flex items-center space-x-1 border border-gray-200 p-1 rounded-sm text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => setChartType('area')}
                className={`px-2.5 py-1 transition-colors ${chartType === 'area' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
              >
                Vùng (Area)
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-2.5 py-1 transition-colors ${chartType === 'bar' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
              >
                Cột (Bar)
              </button>
            </div>
          </div>

          <div style={{ width: '100%', height: 340 }}>
            {stats.revenue_chart && stats.revenue_chart.length > 0 ? (
              <ResponsiveContainer>
                {chartType === 'area' ? (
                  <AreaChart data={stats.revenue_chart} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#111827" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#111827" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#6B7280', fontSize: 11}} 
                      dy={8} 
                    />
                    <YAxis 
                      tickFormatter={(value) => value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : `${value}`} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#6B7280', fontSize: 11}}
                      dx={-8}
                    />
                    <Tooltip 
                      formatter={(value) => [formatPrice(value), 'Doanh thu']}
                      labelFormatter={(label) => `Thời gian: ${label}`}
                      contentStyle={{
                        borderRadius: '4px', 
                        border: '1px solid #E5E7EB', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        fontSize: '12px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#111827" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#revenueGrad)" 
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={stats.revenue_chart} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 11}} dy={8} />
                    <YAxis 
                      tickFormatter={(value) => value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : `${value}`} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#6B7280', fontSize: 11}}
                      dx={-8}
                    />
                    <Tooltip 
                      formatter={(value) => [formatPrice(value), 'Doanh thu']}
                      labelFormatter={(label) => `Thời gian: ${label}`}
                      contentStyle={{
                        borderRadius: '4px', 
                        border: '1px solid #E5E7EB', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="revenue" fill="#111827" radius={[4, 4, 0, 0]} maxBarSize={45} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                Chưa có dữ liệu giao dịch trong kỳ này
              </div>
            )}
          </div>
        </div>

        {/* Trạng thái Đơn hàng - 1/3 Cột */}
        <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-1">
              Trạng Thái Đơn Hàng
            </h3>
            <p className="text-xs text-gray-400 mb-4">Tỷ lệ các trạng thái đơn trong kỳ</p>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            {stats.order_status_chart && stats.order_status_chart.some(i => i.value > 0) ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={stats.order_status_chart.filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {stats.order_status_chart.filter(item => item.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} đơn`, name]}
                    contentStyle={{borderRadius: '4px', border: '1px solid #E5E7EB', fontSize: '12px'}}
                  />
                  <Legend iconType="circle" wrapperStyle={{fontSize: '11px', paddingTop: '10px'}} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                Không có dữ liệu đơn hàng
              </div>
            )}
          </div>

          {/* Quick Order Status List */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100 text-xs">
            {stats.order_status_chart.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between p-1.5 bg-gray-50 rounded-sm">
                <span className="flex items-center space-x-1.5 text-gray-600">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-[11px] font-medium">{s.name}</span>
                </span>
                <span className="font-bold text-gray-900">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Insights Row: Top Selling Products & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top 5 Sản Phẩm Bán Chạy */}
        <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <div className="flex items-center space-x-2">
              <Award size={18} className="text-amber-500" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">
                Top Sản Phẩm Bán Chạy
              </h3>
            </div>
            <Link 
              to="/admin/products" 
              className="text-xs font-bold uppercase tracking-wider text-black hover:underline flex items-center space-x-1"
            >
              <span>Kho sản phẩm</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {stats.top_products && stats.top_products.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {stats.top_products.map((item, index) => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <span className="text-xs font-bold text-gray-400 w-4">
                      0{index + 1}
                    </span>
                    <div className="w-12 h-14 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">No img</div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.name}
                      </h4>
                      <span className="text-[11px] text-gray-400 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {item.total_sold} đã bán
                    </p>
                    <p className="text-xs text-emerald-600 font-medium">
                      {formatPrice(item.total_revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400 text-xs">
              Chưa có dữ liệu bán hàng trong kỳ đã chọn
            </div>
          )}
        </div>

        {/* 5 Đơn Hàng Mới Nhất */}
        <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <div className="flex items-center space-x-2">
              <Clock size={18} className="text-blue-500" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">
                Đơn Hàng Gần Đây
              </h3>
            </div>
            <Link 
              to="/admin/orders" 
              className="text-xs font-bold uppercase tracking-wider text-black hover:underline flex items-center space-x-1"
            >
              <span>Xem tất cả đơn</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {stats.recent_orders && stats.recent_orders.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {stats.recent_orders.map((order) => {
                const statusBadge = STATUS_LABELS[order.status] || {
                  label: order.status,
                  bg: 'bg-gray-100 text-gray-700 border-gray-200'
                };
                return (
                  <div key={order.id} className="py-3.5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-gray-900">
                          #{order.id}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {order.customer_name}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400 block mt-0.5">
                        {order.created_at}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-bold text-gray-900">
                        {formatPrice(order.total_amount)}
                      </span>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-sm border ${statusBadge.bg}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400 text-xs">
              Chưa có đơn hàng nào
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
