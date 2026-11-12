import React, { useState, useEffect } from 'react';
import MirrorCanvas from '../components/mirror/MirrorCanvas';
import SnapshotSavedModal from '../components/mirror/SnapshotSavedModal';
import { formatPrice } from '../utils/formatPrice';

const VirtualMirror = () => {
    const [loading, setLoading] = useState(true);
    const [catalog, setCatalog] = useState(null);
    const [activeCategory, setActiveCategory] = useState('eyewear');
    const [activeItem, setActiveItem] = useState(null);
    const [savedSnapshot, setSavedSnapshot] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchCatalog();
    }, []);

    const fetchCatalog = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/virtual-mirror/catalog');
            const data = await res.json();
            if (data.success) {
                setCatalog(data);
                if (data.items && data.items.length > 0) {
                    setActiveItem(data.items[0]);
                }
            }
        } catch (err) {
            console.error('Error fetching AR mirror catalog:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSnapshotTaken = async (item) => {
        setIsSaving(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/api/virtual-mirror/snapshot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ item_id: item.id })
            });
            const data = await res.json();
            if (data.success) {
                setSavedSnapshot(data.snapshot);
            }
        } catch (err) {
            console.error('Error saving snapshot:', err);
            setSavedSnapshot({
                snapshot_code: 'SNAP-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
                item_id: item.id,
                hash: '0x' + Math.random().toString(16).substring(2, 18)
            });
        } finally {
            setIsSaving(false);
        }
    };

    const items = catalog?.items || [];
    const filteredItems = items.filter(it => it.category === activeCategory);

    return (
        <div className="bg-black text-white min-h-screen pt-28 pb-20 selection:bg-white selection:text-black">
            {/* Ambient Lighting */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-zinc-800/20 to-transparent blur-3xl pointer-events-none -z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center space-x-2 px-3.5 py-1 border border-zinc-800 bg-zinc-950/60 rounded-full mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-zinc-400">
                            Atelier AR Virtual Mirror & Haute Joaillerie
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-white mb-4">
                        Gương Thử Đồ Thực Tế Ảo AR
                    </h1>
                    <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto">
                        Trải nghiệm ướm thử kính mắt điêu khắc và trang sức kim hoàn cao cấp trên khuôn mặt thời gian thực qua webcam hoặc người mẫu studio Atelier.
                    </p>
                </div>

                {/* Category Switcher Tabs */}
                <div className="flex justify-center space-x-3 mb-10">
                    <button
                        onClick={() => {
                            setActiveCategory('eyewear');
                            const first = items.find(i => i.category === 'eyewear');
                            if (first) setActiveItem(first);
                        }}
                        className={`px-6 py-2.5 uppercase font-mono tracking-widest text-xs transition-all border ${
                            activeCategory === 'eyewear'
                                ? 'border-white bg-white text-black'
                                : 'border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                        }`}
                    >
                        Kính Mắt Điêu Khắc (Eyewear)
                    </button>
                    <button
                        onClick={() => {
                            setActiveCategory('jewelry');
                            const first = items.find(i => i.category === 'jewelry');
                            if (first) setActiveItem(first);
                        }}
                        className={`px-6 py-2.5 uppercase font-mono tracking-widest text-xs transition-all border ${
                            activeCategory === 'jewelry'
                                ? 'border-white bg-white text-black'
                                : 'border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                        }`}
                    >
                        Trang Sức Kim Hoàn (Haute Joaillerie)
                    </button>
                </div>

                {/* Main Mirror & Selector Studio */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Interactive AR Mirror Canvas */}
                    <div className="lg:col-span-7">
                        <MirrorCanvas
                            activeItem={activeItem}
                            onSnapshotTaken={handleSnapshotTaken}
                        />
                    </div>

                    {/* Right: Accessory Selector & Specification Matrix */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Selected Item Info Dossier */}
                        {activeItem && (
                            <div className="p-6 border border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                                        Mã Sản Phẩm: {activeItem.id}
                                    </span>
                                    <span className="text-xs font-mono text-amber-400 font-semibold">
                                        {formatPrice(activeItem.price)}
                                    </span>
                                </div>

                                <h2 className="text-xl font-serif text-white mb-2">{activeItem.name}</h2>
                                <p className="text-xs text-zinc-400 font-light leading-relaxed mb-4">
                                    {activeItem.material}
                                </p>

                                <div className="p-3 bg-black/60 border border-zinc-900 text-xs mb-4">
                                    <span className="text-[10px] text-zinc-500 uppercase font-mono block mb-1">Tỷ Lệ Tương Thích Gương Mặt:</span>
                                    <p className="text-zinc-300 font-light">{activeItem.face_shape_fit}</p>
                                </div>

                                {/* Detailed Specs */}
                                <div className="space-y-1.5 py-3 border-t border-b border-zinc-900 text-[11px] mb-6">
                                    {activeItem.specs && Object.entries(activeItem.specs).map(([label, val]) => (
                                        <div key={label} className="flex justify-between text-zinc-400">
                                            <span className="text-zinc-600">{label}:</span>
                                            <span className="text-zinc-200">{val}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleSnapshotTaken(activeItem)}
                                    disabled={isSaving}
                                    className="w-full py-3 bg-white text-black hover:bg-zinc-200 uppercase tracking-[0.2em] text-xs font-medium transition-all flex items-center justify-center space-x-2 shadow-xl"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    </svg>
                                    <span>{isSaving ? 'Đang lưu bản chụp...' : 'Chụp Lưu Khoảnh Khắc AR'}</span>
                                </button>
                            </div>
                        )}

                        {/* Accessories Carousel list */}
                        <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-3">
                                Bộ Sưu Tập Phụ Kiện Có Sẵn Để Ướm Thử ({filteredItems.length})
                            </span>
                            <div className="grid grid-cols-2 gap-3">
                                {filteredItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveItem(item)}
                                        className={`p-3 border text-left transition-all ${
                                            activeItem?.id === item.id 
                                                ? 'border-white bg-zinc-900 ring-1 ring-white/20' 
                                                : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                                        }`}
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full aspect-[4/3] object-cover mb-2 border border-zinc-800"
                                        />
                                        <h4 className="text-xs font-serif text-white truncate">{item.name}</h4>
                                        <p className="text-[11px] font-mono text-zinc-400 mt-1">{formatPrice(item.price)}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* AR Guidelines */}
                <div className="mt-16 border border-zinc-900 bg-zinc-950/40 p-6 max-w-3xl mx-auto text-center">
                    <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
                        Chỉ Dẫn Trải Nghiệm AR
                    </span>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                        Để đạt độ chuẩn xác cao nhất: Đứng thẳng trước camera cách 50-70cm, giữ khuôn mặt ở vùng sáng đồng đều tự nhiên, hạn chế đeo kính hoặc phụ kiện khác khi ướm thử.
                    </p>
                </div>
            </div>

            {/* Saved Snapshot Modal */}
            {savedSnapshot && (
                <SnapshotSavedModal
                    item={activeItem}
                    snapshot={savedSnapshot}
                    onClose={() => setSavedSnapshot(null)}
                />
            )}
        </div>
    );
};

export default VirtualMirror;
