import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import VipInvitationModal from '../../components/admin/VipInvitationModal';
import { formatPrice } from '../../utils/formatPrice';

const AdminVipConcierge = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [selectedClientForInvite, setSelectedClientForInvite] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchConciergeData();
    }, []);

    const fetchConciergeData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:8000/api/admin/vip-concierge', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const json = await res.json();
            if (json.success) {
                setData(json);
            }
        } catch (err) {
            console.error('Error fetching VIP concierge data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        setUpdatingId(id);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://127.0.0.1:8000/api/admin/vip-concierge/appointments/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const json = await res.json();
            if (json.success) {
                // Update local list
                setData(prev => ({
                    ...prev,
                    appointments: prev.appointments.map(apt => 
                        apt.id === id ? { ...apt, status: newStatus } : apt
                    )
                }));
            }
        } catch (err) {
            console.error('Update status error:', err);
        } finally {
            setUpdatingId(null);
        }
    };

    const summary = data?.summary || {
        total_vip_clients: 84,
        diamond_sovereigns: 12,
        gold_heritages: 28,
        silver_ateliers: 44,
        active_bespoke_commissions: 9,
        total_vip_lifetime_spend: 2450000000,
        average_vip_aov: 38500000
    };

    const appointments = data?.appointments || [];

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
                    <div>
                        <span className="text-xs font-mono uppercase tracking-widest text-amber-600 block mb-1">
                            Atelier High-Value Client Relationship
                        </span>
                        <h1 className="text-2xl font-bold font-serif text-gray-900">
                            Quản Lý Khách Hàng VIP & Lịch Hẹn Salon 1-1
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">
                            Theo dõi hồ sơ chi tiêu trọn đời, điều phối nghệ nhân may đo và phát hành thư mời đặc quyền cho giới tinh hoa.
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <span className="px-3 py-1.5 bg-black text-white text-xs font-mono uppercase tracking-wider rounded-lg shadow-sm">
                            Hệ Thống Quản Gia 24/7
                        </span>
                    </div>
                </div>

                {/* VIP Analytics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-xs font-medium text-gray-500 block mb-1">Tổng Chi Tiêu VIP</span>
                        <span className="text-xl font-bold text-gray-900 font-serif">
                            {formatPrice(summary.total_vip_lifetime_spend)}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-mono block mt-1">+18.4% tháng này</span>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-xs font-medium text-gray-500 block mb-1">Diamond Sovereign</span>
                        <span className="text-xl font-bold text-cyan-600 font-serif">
                            {summary.diamond_sovereigns} Hội Viên
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono block mt-1">Hạng tối thượng (100tr+)</span>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-xs font-medium text-gray-500 block mb-1">Gold & Silver</span>
                        <span className="text-xl font-bold text-amber-600 font-serif">
                            {summary.gold_heritages + summary.silver_ateliers} Hội Viên
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono block mt-1">Khách thân thiết</span>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-xs font-medium text-gray-500 block mb-1">Đơn May Đo Đang Chế Tác</span>
                        <span className="text-xl font-bold text-indigo-600 font-serif">
                            {summary.active_bespoke_commissions} Tác Phẩm
                        </span>
                        <span className="text-[10px] text-indigo-500 font-mono block mt-1">Đang hoàn thiện xưởng</span>
                    </div>
                </div>

                {/* VIP Appointments Priority Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                            Danh Sách Lịch Hẹn Private Salon & Dịch Vụ Quản Gia
                        </h2>
                        <span className="text-xs font-mono text-gray-500">
                            {appointments.length} Lịch Trình Đang Chờ
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-100/70 text-gray-600 uppercase text-[10px] tracking-wider font-semibold">
                                <tr>
                                    <th className="px-6 py-3.5">Mã & Khách Hàng</th>
                                    <th className="px-6 py-3.5">Cấp Bậc & Chi Tiêu</th>
                                    <th className="px-6 py-3.5">Dịch Vụ & Địa Điểm</th>
                                    <th className="px-6 py-3.5">Nghệ Nhân Phụ Trách</th>
                                    <th className="px-6 py-3.5">Thời Gian Hẹn</th>
                                    <th className="px-6 py-3.5">Trạng Thái</th>
                                    <th className="px-6 py-3.5 text-right">Tác Vụ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                                {appointments.map((apt) => (
                                    <tr key={apt.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-mono text-gray-400 block">{apt.id}</span>
                                            <span className="font-bold text-gray-900 text-sm">{apt.client_name}</span>
                                            <p className="text-[10px] text-gray-400 italic line-clamp-1 max-w-[180px] mt-0.5">
                                                "{apt.special_preferences}"
                                            </p>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded border ${
                                                apt.tier === 'diamond' 
                                                    ? 'border-cyan-200 bg-cyan-50 text-cyan-800' 
                                                    : apt.tier === 'gold' 
                                                    ? 'border-amber-200 bg-amber-50 text-amber-800' 
                                                    : 'border-gray-200 bg-gray-50 text-gray-700'
                                            }`}>
                                                {apt.tier}
                                            </span>
                                            <span className="font-mono text-xs text-gray-900 block mt-1 font-semibold">
                                                {formatPrice(apt.lifetime_spend)}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{apt.service}</p>
                                            <span className="text-[10px] text-gray-500 font-mono block mt-0.5">{apt.salon_location}</span>
                                        </td>

                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {apt.dedicated_tailor}
                                        </td>

                                        <td className="px-6 py-4 font-mono text-xs text-gray-600">
                                            {apt.scheduled_at}
                                        </td>

                                        <td className="px-6 py-4">
                                            <select
                                                value={apt.status}
                                                disabled={updatingId === apt.id}
                                                onChange={(e) => handleUpdateStatus(apt.id, e.target.value)}
                                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border focus:outline-none ${
                                                    apt.status === 'CONFIRMED' 
                                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                                        : apt.status === 'DISPATCHED' 
                                                        ? 'bg-indigo-50 text-indigo-800 border-indigo-200' 
                                                        : 'bg-amber-50 text-amber-800 border-amber-200'
                                                }`}
                                            >
                                                <option value="PENDING_CONFIRMATION">Chờ Xác Nhận</option>
                                                <option value="CONFIRMED">Đã Xác Nhận</option>
                                                <option value="DISPATCHED">Đang Điều Phối Xe</option>
                                                <option value="COMPLETED">Đã Hoàn Tất</option>
                                                <option value="CANCELLED">Hủy Lịch</option>
                                            </select>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedClientForInvite(apt)}
                                                className="px-3 py-1.5 bg-black text-white hover:bg-gray-800 rounded text-[10px] uppercase font-bold tracking-wider transition-colors inline-flex items-center space-x-1"
                                            >
                                                <span>Gửi Thư Mời</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Direct Invitation Modal */}
            {selectedClientForInvite && (
                <VipInvitationModal
                    client={selectedClientForInvite}
                    onClose={() => setSelectedClientForInvite(null)}
                    onSent={() => {}}
                />
            )}
        </AdminLayout>
    );
};

export default AdminVipConcierge;
