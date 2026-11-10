import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { formatPrice } from '../../utils/formatPrice';
import { X, Printer, Download, FileText, CheckCircle2 } from 'lucide-react';

const InvoiceModal = ({ orderId, isOpen, onClose }) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && orderId) {
      fetchInvoice();
    }
  }, [isOpen, orderId]);

  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/orders/${orderId}/invoice`);
      setInvoice(response.data);
    } catch (error) {
      console.error('Lỗi khi tải hóa đơn:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-black/10 relative print:p-0 print:m-0 print:max-w-none print:shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Actions (Hidden on Print) */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 px-6 flex justify-between items-center z-10 print:hidden">
          <div className="flex items-center space-x-2">
            <FileText size={18} className="text-black" />
            <span className="font-serif font-bold text-sm uppercase tracking-wider text-black">
              Hóa Đơn Điện Tử #{orderId}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors flex items-center space-x-1.5"
            >
              <Printer size={13} />
              <span>In Hóa Đơn</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-8 md:p-12 print:p-8 space-y-8 text-xs font-sans text-gray-800">
          {loading ? (
            <div className="py-24 text-center">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs uppercase tracking-widest text-gray-400">Đang xuất hóa đơn điện tử...</p>
            </div>
          ) : invoice && (
            <>
              {/* Header Company & Invoice Title */}
              <div className="flex justify-between items-start border-b-2 border-black pb-8">
                <div>
                  <h1 className="font-serif text-2xl font-bold uppercase tracking-tighter text-black">
                    TVC-SHOP
                  </h1>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-0.5">Cold Luxury Fashion</p>
                  <div className="text-[11px] text-gray-500 mt-3 space-y-0.5 leading-relaxed font-light">
                    <p>{invoice.company_info.name}</p>
                    <p>Mã số thuế: {invoice.company_info.tax_id}</p>
                    <p>{invoice.company_info.address}</p>
                    <p>Hotline: {invoice.company_info.hotline} • Email: {invoice.company_info.email}</p>
                  </div>
                </div>

                <div className="text-right">
                  <h2 className="font-serif text-xl font-bold uppercase tracking-widest text-black mb-1">
                    Hóa Đơn Bán Hàng
                  </h2>
                  <p className="font-mono text-xs font-bold text-gray-800">{invoice.invoice_number}</p>
                  <p className="text-[11px] text-gray-500 mt-1">Ngày xuất: {invoice.issue_date}</p>
                  <div className="mt-2 inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase">
                    <CheckCircle2 size={11} />
                    <span>Đã Thanh Toán</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-zinc-50 border border-zinc-200 p-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-2">
                  Thông Tin Người Nhận
                </span>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-bold text-black">{invoice.customer_info.name}</p>
                    <p className="text-gray-500 mt-0.5">{invoice.customer_info.phone} • {invoice.customer_info.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Địa chỉ giao hàng:</p>
                    <p className="text-black leading-relaxed font-medium mt-0.5">{invoice.customer_info.shipping_address || 'Địa chỉ tiêu chuẩn'}</p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-black text-[10px] uppercase font-bold tracking-widest text-gray-500 pb-2">
                    <tr>
                      <th className="py-2.5 w-10">STT</th>
                      <th className="py-2.5">Tên Sản Phẩm / Dịch Vụ</th>
                      <th className="py-2.5 text-center w-16">SL</th>
                      <th className="py-2.5 text-right w-28">Đơn Giá</th>
                      <th className="py-2.5 text-right w-32">Thành Tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {invoice.items.map((item) => (
                      <tr key={item.line_number}>
                        <td className="py-3 text-gray-400 font-mono">{item.line_number}</td>
                        <td className="py-3 font-serif font-medium text-black">{item.product_name}</td>
                        <td className="py-3 text-center font-mono">{item.quantity}</td>
                        <td className="py-3 text-right font-mono text-gray-600">{formatPrice(item.unit_price)}</td>
                        <td className="py-3 text-right font-mono font-bold text-black">{formatPrice(item.total_price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="border-t-2 border-black pt-4 space-y-2 max-w-xs ml-auto text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Cộng tiền hàng:</span>
                  <span className="font-mono">{formatPrice(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển (Freeship):</span>
                  <span className="font-mono text-emerald-600 font-bold">0 ₫</span>
                </div>
                <div className="flex justify-between text-base font-bold text-black border-t border-gray-200 pt-2">
                  <span>Tổng thanh toán:</span>
                  <span className="font-serif">{formatPrice(invoice.total_amount)}</span>
                </div>
              </div>

              {/* Footer Signatures */}
              <div className="pt-8 border-t border-gray-200 grid grid-cols-2 text-center text-xs">
                <div>
                  <p className="font-bold text-black uppercase tracking-wider text-[10px]">Người Mua Hàng</p>
                  <p className="text-[10px] text-gray-400 italic mt-1">(Ký, ghi rõ họ tên)</p>
                  <p className="mt-14 font-medium text-black">{invoice.customer_info.name}</p>
                </div>
                <div>
                  <p className="font-bold text-black uppercase tracking-wider text-[10px]">Đại Diện TVC-Shop</p>
                  <p className="text-[10px] text-gray-400 italic mt-1">(Đã ký số điện tử)</p>
                  <div className="mt-8 inline-block border-2 border-emerald-600 text-emerald-700 px-3 py-1 font-bold text-[10px] uppercase tracking-widest transform -rotate-3">
                    TVC Electronic Signature Valid
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
