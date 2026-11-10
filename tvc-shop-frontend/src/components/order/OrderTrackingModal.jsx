import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { formatPrice } from '../../utils/formatPrice';
import { 
  X, Package, Truck, CheckCircle2, Clock, 
  MapPin, AlertCircle, Copy, Check, ShieldCheck, ArrowRight 
} from 'lucide-react';

const OrderTrackingModal = ({ orderId, isOpen, onClose }) => {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedTracking, setCopiedTracking] = useState(false);

  useEffect(() => {
    if (!isOpen || !orderId) return;

    const fetchTracking = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/orders/${orderId}/tracking`);
        setTrackingData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải thông tin hành trình đơn hàng.');
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
  }, [isOpen, orderId]);

  const copyTrackingNumber = () => {
    if (trackingData?.tracking_number) {
      navigator.clipboard.writeText(trackingData.tracking_number);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-black/10 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">
                Logistics & Live Tracking
              </span>
              <span className="px-2 py-0.5 bg-black text-white text-[9px] font-bold uppercase tracking-wider">
                Real-time
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold uppercase tracking-tight text-black mt-1">
              Hành Trình Đơn Hàng #{orderId}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition-colors p-1"
            title="Đóng modal"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-8">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs uppercase tracking-widest text-gray-400">
                Đang kết nối hệ thống vận chuyển...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-xs flex items-center space-x-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          ) : trackingData && (
            <>
              {/* Carrier & Tracking Code Bar */}
              <div className="bg-zinc-50 border border-zinc-200 p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-0.5">
                    Đơn vị vận chuyển
                  </p>
                  <p className="text-xs font-bold text-black font-serif">
                    {trackingData.carrier}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="font-mono text-xs font-semibold text-gray-700">
                      Mã vận đơn: {trackingData.tracking_number}
                    </span>
                    <button
                      onClick={copyTrackingNumber}
                      className="text-gray-400 hover:text-black transition-colors p-1"
                      title="Sao chép mã vận đơn"
                    >
                      {copiedTracking ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>

                <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-200">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-0.5">
                    Dự kiến giao hàng
                  </p>
                  <p className="text-sm font-bold text-emerald-700 font-serif">
                    {trackingData.estimated_delivery}
                  </p>
                </div>
              </div>

              {/* Timeline Container */}
              <div>
                <h3 className="text-xs uppercase font-bold tracking-[0.2em] text-gray-500 mb-6">
                  Tiến Trình Vận Chuyển Chi Tiết
                </h3>

                <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200">
                  {trackingData.timeline.map((item, idx) => (
                    <div key={idx} className="relative group">
                      {/* Node Circle */}
                      <div className={`absolute -left-[30px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white transition-all ${
                        item.is_cancelled
                          ? 'border-rose-500 text-rose-500 ring-4 ring-rose-100'
                          : item.completed
                          ? 'border-black text-black bg-black'
                          : 'border-gray-300 text-gray-300'
                      }`}>
                        {item.is_cancelled ? (
                          <X size={12} className="text-rose-500" />
                        ) : item.completed ? (
                          <Check size={12} className="text-white" />
                        ) : (
                          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                        )}
                      </div>

                      {/* Content block */}
                      <div className={`p-4 border transition-all ${
                        item.current
                          ? 'border-black bg-zinc-50 shadow-sm'
                          : 'border-gray-100 bg-white'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-1.5">
                          <h4 className={`text-xs uppercase font-bold tracking-wider ${
                            item.is_cancelled ? 'text-rose-600' : item.current ? 'text-black' : 'text-gray-700'
                          }`}>
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {item.time}
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 leading-relaxed mb-2 font-light">
                          {item.description}
                        </p>

                        <div className="flex items-center space-x-1.5 text-[10px] text-gray-400">
                          <MapPin size={11} className="flex-shrink-0" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address & Package Items Preview */}
              <div className="border-t border-gray-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                    Địa chỉ nhận kiện
                  </p>
                  <p className="text-gray-700 leading-relaxed font-medium">
                    {trackingData.shipping_address || 'Địa chỉ tiêu chuẩn của đơn hàng'}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                    Kiện hàng gồm ({trackingData.items?.length || 0} sản phẩm)
                  </p>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                    {trackingData.items?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-gray-600">
                        <span className="truncate max-w-[180px] text-[11px]">{item.name}</span>
                        <span className="font-mono text-[10px]">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;
