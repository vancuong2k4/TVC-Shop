import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import MintVaultModal from '../../components/admin/MintVaultModal';
import { formatPrice } from '../../utils/formatPrice';

const AdminArchivalAppraisals = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [selectedDossierForMint, setSelectedDossierForMint] = useState(null);
    const [updatingTicket, setUpdatingTicket] = useState(null);

    useEffect(() => {
        fetchAppraisalDossiers();
    }, []);

    const fetchAppraisalDossiers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:8000/api/admin/archival-appraisals', {
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
            console.error('Error fetching appraisal dossiers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateVerdict = async (ticketCode, newStatus) => {
        setUpdatingTicket(ticketCode);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://127.0.0.1:8000/api/admin/archival-appraisals/${ticketCode}`, {
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
                setData(prev => ({
                    ...prev,
                    dossiers: prev.dossiers.map(d => 
                        d.ticket_code === ticketCode ? { ...d, appraisal_status: newStatus } : d
                    )
                }));
            }
        } catch (err) {
            console.error('Update verdict error:', err);
        } finally {
            setUpdatingTicket(null);
        }
    };

    const stats = data?.stats || {
        pending_review: 6,
        approved_for_resale: 18,
        restoration_in_progress: 4,
        total_buyback_capital_deployed: 380000000,
        average_payout_rate: '58.5%'
    };

    const dossiers = data?.dossiers || [];

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
                    <div>
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 block mb-1">
                            Circular Luxury & Archival Curation
                        </span>
                        <h1 className="text-2xl font-bold font-serif text-gray-900">
                            Thẩm Định Thu Mua Tuần Hoàn & Phục Chế Archive
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">
                            Kiểm duyệt trang phục cũ gửi về xưởng, giải ngân Store Credit và trực tiếp đúc các kiệt tác phục chế vào Hầm Tuyệt Tác Kín.
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <span className="px-3 py-1.5 bg-emerald-950 text-emerald-400 text-xs font-mono uppercase tracking-wider rounded-lg border border-emerald-800">
                            Hệ Sinh Thái Tuần Hoàn Di Sản
                        </span>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-xs font-medium text-gray-500 block mb-1">Vốn Thu Mua Đã Giải Ngân</span>
                        <span className="text-xl font-bold text-gray-900 font-serif">
                            {formatPrice(stats.total_buyback_capital_deployed)}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-mono block mt-1">Tỷ lệ hoàn vốn: 134%</span>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-xs font-medium text-gray-500 block mb-1">Chờ Kiểm Định Vật Lý</span>
                        <span className="text-xl font-bold text-amber-600 font-serif">
                            {stats.pending_review} Hồ Sơ
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono block mt-1">Đang chuyển về xưởng</span>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-xs font-medium text-gray-500 block mb-1">Đang Phục Chế Bề Mặt</span>
                        <span className="text-xl font-bold text-indigo-600 font-serif">
                            {stats.restoration_in_progress} Trang Phục
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono block mt-1">Hấp hơi & đính lại cúc</span>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-xs font-medium text-gray-500 block mb-1">Đã Đúc Vào Hầm Kín</span>
                        <span className="text-xl font-bold text-emerald-600 font-serif">
                            {stats.approved_for_resale} Kiệt Tác
                        </span>
                        <span className="text-[10px] text-emerald-600 font-mono block mt-1">Sẵn sàng mở bán kín</span>
                    </div>
                </div>

                {/* Dossiers Data Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                            Danh Sách Hồ Sơ Thẩm Định Cần Xử Lý
                        </h2>
                        <span className="text-xs font-mono text-gray-500">
                            {dossiers.length} Hồ Sơ Trong Kỳ
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-100/70 text-gray-600 uppercase text-[10px] tracking-wider font-semibold">
                                <tr>
                                    <th className="px-6 py-3.5">Mã Hồ Sơ & Khách Hàng</th>
                                    <th className="px-6 py-3.5">Trang Phục & Tình Trạng</th>
                                    <th className="px-6 py-3.5">Định Giá Ban Đầu</th>
                                    <th className="px-6 py-3.5">Hình Thức Chi Trả</th>
                                    <th className="px-6 py-3.5">Ghi Chú Kiểm Định</th>
                                    <th className="px-6 py-3.5">Trạng Thái Giám Định</th>
                                    <th className="px-6 py-3.5 text-right">Tác Vụ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                                {dossiers.map((d) => (
                                    <tr key={d.ticket_code} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-mono text-gray-400 block">{d.ticket_code}</span>
                                            <span className="font-bold text-gray-900 text-sm">{d.customer_name}</span>
                                            <span className="text-[10px] text-gray-500 font-mono block">{d.phone}</span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{d.product_title}</p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-mono">
                                                    Năm {d.purchase_year}
                                                </span>
                                                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-mono">
                                                    {d.declared_condition}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 font-mono">
                                            <span className="text-gray-900 font-bold text-sm block">
                                                {formatPrice(d.preliminary_valuation)}
                                            </span>
                                            <span className="text-[10px] text-gray-400 line-through">
                                                Gốc: {formatPrice(d.original_price)}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded border ${
                                                d.payout_preference === 'store_credit' 
                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800' 
                                                    : 'border-blue-200 bg-blue-50 text-blue-800'
                                            }`}>
                                                {d.payout_preference === 'store_credit' ? 'Store Credit (+15%)' : 'Ngân Hàng Trực Tiếp'}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 max-w-[220px]">
                                            <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                                                {d.inspection_notes}
                                            </p>
                                        </td>

                                        <td className="px-6 py-4">
                                            <select
                                                value={d.appraisal_status}
                                                disabled={updatingTicket === d.ticket_code}
                                                onChange={(e) => handleUpdateVerdict(d.ticket_code, e.target.value)}
                                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border focus:outline-none ${
                                                    d.appraisal_status === 'APPROVED_FOR_RESALE' 
                                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                                        : d.appraisal_status === 'IN_RESTORATION' 
                                                        ? 'bg-indigo-50 text-indigo-800 border-indigo-200' 
                                                        : 'bg-amber-50 text-amber-800 border-amber-200'
                                                }`}
                                            >
                                                <option value="PENDING_PHYSICAL_INSPECTION">Chờ Kiểm Định</option>
                                                <option value="IN_RESTORATION">Đang Phục Chế</option>
                                                <option value="APPROVED_FOR_RESALE">Đạt Chuẩn Resale</option>
                                                <option value="PAID_OUT">Đã Giải Ngân</option>
                                                <option value="REJECTED">Từ Chối Tiếp Nhận</option>
                                            </select>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedDossierForMint(d)}
                                                className="px-3 py-1.5 bg-black text-white hover:bg-amber-500 hover:text-black rounded text-[10px] uppercase font-bold tracking-wider transition-colors inline-flex items-center space-x-1"
                                            >
                                                <span>Đúc Vào Hầm Kín</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Mint to Secret Vault Modal */}
            {selectedDossierForMint && (
                <MintVaultModal
                    dossier={selectedDossierForMint}
                    onClose={() => setSelectedDossierForMint(null)}
                    onMinted={() => {}}
                />
            )}
        </AdminLayout>
    );
};

export default AdminArchivalAppraisals;
