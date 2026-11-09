import React from 'react';
import { ArrowLeftRight, X } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';

const CompareFloatingBar = () => {
  const { compareItems, removeFromCompare, clearCompare, setIsCompareDrawerOpen } = useCompare();

  if (compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md border border-gray-300 shadow-2xl rounded-full px-5 py-2.5 flex items-center space-x-4 animate-slide-down">
      <div className="flex items-center space-x-2">
        <ArrowLeftRight size={16} className="text-gray-900" />
        <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
          So sánh ({compareItems.length}/4)
        </span>
      </div>

      {/* Mini previews */}
      <div className="flex items-center space-x-1.5 border-l border-gray-200 pl-3">
        {compareItems.map((item) => (
          <div key={item.id} className="relative w-8 h-10 rounded-xs overflow-hidden border border-gray-300 group">
            <img src={item.image || item.image_url} alt={item.name} className="w-full h-full object-cover" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFromCompare(item.id);
              }}
              className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={10} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2 border-l border-gray-200 pl-3">
        <button
          onClick={() => setIsCompareDrawerOpen(true)}
          className="bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors shadow-xs"
        >
          Xem Đối Chiếu
        </button>

        <button
          onClick={clearCompare}
          className="text-gray-400 hover:text-rose-600 p-1 transition-colors"
          title="Xóa danh sách"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default CompareFloatingBar;
