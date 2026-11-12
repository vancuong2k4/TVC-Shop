import React, { useState, useEffect } from 'react';
import ProvenanceDeedCard from '../components/transfer/ProvenanceDeedCard';
import TransferSignModal from '../components/transfer/TransferSignModal';

const OwnershipTransfer = () => {
    const [loading, setLoading] = useState(true);
    const [assetsData, setAssetsData] = useState(null);
    const [selectedAsset, setSelectedAsset] = useState(null);

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/ownership-transfer/assets');
            const data = await res.json();
            if (data.success) {
                setAssetsData(data);
            }
        } catch (err) {
            console.error('Error fetching transferable assets:', err);
        } finally {
            setLoading(false);
        }
    };

    const assets = assetsData?.assets || [];
    const protocolRules = assetsData?.protocol_rules || [];

    return (
        <div className="bg-black text-white min-h-screen pt-28 pb-20 selection:bg-amber-400 selection:text-black">
            {/* Ambient Lighting */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-950/20 to-transparent blur-3xl pointer-events-none -z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center space-x-2 px-3.5 py-1 border border-amber-500/30 bg-amber-950/20 rounded-full mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-amber-300">
                            Atelier Digital Provenance & Sovereign Heirship
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-white mb-4">
                        Văn Tự Chuyển Nhượng Quyền Sở Hữu
                    </h1>
                    <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto">
                        Cổng công chứng số hóa bất biến cho các kiệt tác Haute Couture và vật phẩm di sản TVC Atelier. Thực hiện nghi thức bàn giao quyền sở hữu, khắc lời đề từ truyền đời và chuyển giao trọn vẹn đặc quyền bảo dưỡng cho thế hệ kế tiếp.
                    </p>
                </div>

                {/* Transferable Assets Grid */}
                {loading ? (
                    <div className="py-24 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                        Đang đồng bộ hồ sơ văn tự sở hữu từ sổ cái di sản...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {assets.map((asset) => (
                            <ProvenanceDeedCard
                                key={asset.deed_id}
                                asset={asset}
                                onInitiateTransfer={(ast) => setSelectedAsset(ast)}
                            />
                        ))}
                    </div>
                )}

                {/* Protocol Rules & Legal Sovereign Ledger Accordion */}
                <div className="border border-zinc-900 bg-zinc-950/60 p-8 max-w-4xl mx-auto">
                    <div className="flex items-center space-x-2 mb-4">
                        <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-xs uppercase tracking-[0.2em] font-mono text-zinc-300">
                            Nguyên Tắc Pháp Lý & Sổ Cái Di Sản TVC Sovereign
                        </h3>
                    </div>
                    <ul className="text-xs text-zinc-400 font-light space-y-2.5 leading-relaxed list-disc list-inside">
                        {protocolRules.map((rule, idx) => (
                            <li key={idx}>{rule}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Modal */}
            {selectedAsset && (
                <TransferSignModal
                    asset={selectedAsset}
                    onClose={() => setSelectedAsset(null)}
                    onSuccess={() => {}}
                />
            )}
        </div>
    );
};

export default OwnershipTransfer;
