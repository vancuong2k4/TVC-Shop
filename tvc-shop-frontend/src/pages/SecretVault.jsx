import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VaultItemCard from '../components/vault/VaultItemCard';
import VaultAcquireModal from '../components/vault/VaultAcquireModal';
import { formatPrice } from '../utils/formatPrice';

const SecretVault = () => {
    const [loading, setLoading] = useState(true);
    const [vaultData, setVaultData] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeTierFilter, setActiveTierFilter] = useState('all');

    useEffect(() => {
        fetchVaultData();
    }, []);

    const fetchVaultData = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/secret-vault/catalog');
            const data = await res.json();
            if (data.success) {
                setVaultData(data);
            }
        } catch (err) {
            console.error('Error fetching secret vault:', err);
        } finally {
            setLoading(false);
        }
    };

    const userStatus = vaultData?.user_status || {
        current_tier: 'gold',
        tier_name: 'Gold Heritage',
        points: 3450,
        total_spent: 52000000,
        vault_access: true,
    };

    const tiers = vaultData?.tiers_overview || {
        silver: { name: 'Silver Atelier', discount_percentage: 5 },
        gold: { name: 'Gold Heritage', discount_percentage: 10 },
        diamond: { name: 'Diamond Sovereign', discount_percentage: 15 },
    };

    const items = vaultData?.vault_items || [];

    const filteredItems = activeTierFilter === 'all'
        ? items
        : items.filter(i => i.required_tier === activeTierFilter);

    return (
        <div className="bg-black text-white min-h-screen pt-28 pb-20 selection:bg-amber-400 selection:text-black">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-950/20 to-transparent blur-3xl pointer-events-none -z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 border border-amber-500/30 bg-amber-950/20 rounded-full mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-amber-300">
                            High-Jewelry & Archival Couture Vault
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-white mb-4">
                        Hầm Tuyệt Tác & Đặc Quyền Kín
                    </h1>
                    <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto">
                        Kho lưu trữ những thiết kế lưu trữ (Archival Pieces), trang phục độc bản One-of-a-Kind và đặc quyền may đo cao cấp chỉ mở khóa cho hội viên thứ hạng danh giá của TVC Atelier.
                    </p>
                </div>

                {/* VIP Membership Bar */}
                <div className="border border-zinc-800 bg-zinc-950/60 backdrop-blur-md p-6 md:p-8 mb-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-900 pb-6 mb-6">
                        <div>
                            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
                                Trạng Thái Định Danh Khách Hàng
                            </span>
                            <div className="flex items-center space-x-3">
                                <h2 className="text-xl md:text-2xl font-serif text-white">{userStatus.tier_name}</h2>
                                <span className="px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-wider bg-amber-400 text-black font-semibold">
                                    Quyền Hầm Mở
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-8 font-mono text-xs">
                            <div>
                                <span className="text-[10px] text-zinc-500 uppercase block">Điểm tích lũy</span>
                                <span className="text-base text-amber-400 font-semibold">{userStatus.points.toLocaleString()} PTS</span>
                            </div>
                            <div className="border-l border-zinc-800 pl-8">
                                <span className="text-[10px] text-zinc-500 uppercase block">Tổng chi tiêu</span>
                                <span className="text-base text-white">{formatPrice(userStatus.total_spent)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tier Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(tiers).map(([key, t]) => (
                            <div 
                                key={key}
                                className={`p-4 border text-left transition-all ${
                                    userStatus.current_tier === key 
                                        ? 'border-amber-400/60 bg-amber-950/20' 
                                        : 'border-zinc-900 bg-black/40'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-xs uppercase tracking-widest font-mono text-white">{t.name}</h4>
                                    <span className="text-[10px] font-mono text-amber-400 font-semibold">-{t.discount_percentage}% OFF</span>
                                </div>
                                <ul className="text-[11px] text-zinc-400 font-light space-y-1.5 list-disc list-inside">
                                    {t.benefits && t.benefits.slice(0, 2).map((b, idx) => (
                                        <li key={idx} className="line-clamp-1">{b}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-900">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs uppercase tracking-widest text-zinc-400 mr-2">Bộ lọc Hầm:</span>
                        {['all', 'silver', 'gold', 'diamond'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setActiveTierFilter(t)}
                                className={`px-4 py-1.5 text-[11px] uppercase tracking-wider transition-all border ${
                                    activeTierFilter === t
                                        ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                                        : 'border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                                }`}
                            >
                                {t === 'all' ? 'Tất Cả Bản Lưu Trữ' : `Cấp Bậc ${t.toUpperCase()}`}
                            </button>
                        ))}
                    </div>

                    <span className="text-xs font-mono text-zinc-500">
                        Hiển thị {filteredItems.length} tác phẩm độc bản
                    </span>
                </div>

                {/* Vault Items Grid */}
                {loading ? (
                    <div className="py-24 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                        Đang giải mã hồ sơ bảo mật hầm kín...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredItems.map((item) => (
                            <VaultItemCard
                                key={item.id}
                                item={item}
                                userTier={userStatus.current_tier}
                                onAcquire={(it) => setSelectedItem(it)}
                            />
                        ))}
                    </div>
                )}

                {/* Vault Security Rules Accordion / Footer Note */}
                <div className="mt-20 border border-zinc-900 bg-zinc-950/40 p-8 max-w-4xl mx-auto">
                    <div className="flex items-center space-x-2 mb-4">
                        <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xs uppercase tracking-[0.2em] font-mono text-zinc-300">
                            Quy Ước Bảo Mật Hầm Lưu Trữ Atelier
                        </h3>
                    </div>
                    <ul className="text-xs text-zinc-500 font-light space-y-2 leading-relaxed list-disc list-inside">
                        {vaultData?.vault_rules?.map((rule, idx) => (
                            <li key={idx}>{rule}</li>
                        )) || (
                            <>
                                <li>Tất cả vật phẩm trong Hầm Bí Mật chỉ mở bán số lượng giới hạn và không bao giờ tái xuất bản thương mại.</li>
                                <li>Mỗi hội viên chỉ được sở hữu tối đa 01 vật phẩm của mỗi mã lưu trữ để bảo đảm giá trị sưu tập bất biến.</li>
                                <li>Sản phẩm được bảo hiểm vận chuyển bằng hòm chống sốc và bàn giao trực tiếp bởi chuyên viên TVC Atelier.</li>
                            </>
                        )}
                    </ul>
                </div>
            </div>

            {/* Acquire Modal */}
            {selectedItem && (
                <VaultAcquireModal
                    item={selectedItem}
                    userStatus={userStatus}
                    onClose={() => setSelectedItem(null)}
                    onSuccess={() => {
                        // refresh data or maintain modal open
                    }}
                />
            )}
        </div>
    );
};

export default SecretVault;
