import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Star, MessageSquare, Trash2, CheckCircle2, CornerDownRight, X, User } from 'lucide-react';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/reviews');
      setReviews(response.data.data || []);
    } catch (error) {
      console.error('Lỗi khi tải đánh giá:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReply = (review) => {
    setSelectedReview(review);
    setReplyText(review.admin_reply || '');
    setReplyModalOpen(true);
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!selectedReview) return;
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post(`/admin/reviews/${selectedReview.id}/reply`, { reply: replyText });
      setMessage({ type: 'success', text: 'Đã gửi phản hồi chính thức cho khách hàng thành công!' });
      setReplyModalOpen(false);
      fetchReviews();
    } catch (error) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi gửi phản hồi.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      setMessage({ type: 'success', text: 'Đã xóa đánh giá thành công.' });
      fetchReviews();
    } catch (error) {
      setMessage({ type: 'error', text: 'Không thể xóa đánh giá.' });
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-black">
            Quản Lý Đánh Giá & Phản Hồi
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Kiểm duyệt đánh giá của khách hàng và gửi phản hồi chính thức từ TVC-Shop
          </p>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 text-xs font-bold uppercase tracking-wider rounded ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Reviews Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs uppercase tracking-widest text-gray-400">Đang tải danh sách đánh giá...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-xs uppercase tracking-widest">
            Chưa có đánh giá nào từ khách hàng.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 uppercase font-bold text-gray-500 tracking-wider">
                <tr>
                  <th className="py-4 px-6">Khách hàng</th>
                  <th className="py-4 px-6">Sản phẩm</th>
                  <th className="py-4 px-6">Xếp hạng</th>
                  <th className="py-4 px-6">Nội dung đánh giá</th>
                  <th className="py-4 px-6">Phản hồi của Admin</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* User */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-gray-700">
                          {rev.user?.full_name ? rev.user.full_name.charAt(0) : <User size={14} />}
                        </div>
                        <div>
                          <p className="font-bold text-black">{rev.user?.full_name || 'Khách hàng'}</p>
                          <p className="text-[10px] text-gray-400">{rev.user?.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Product */}
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-800 line-clamp-1 max-w-[150px]">
                        {rev.product?.name || 'Sản phẩm'}
                      </p>
                    </td>

                    {/* Rating */}
                    <td className="py-4 px-6">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            fill={i < rev.rating ? 'currentColor' : 'none'}
                            className={i < rev.rating ? 'text-amber-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Comment & Images */}
                    <td className="py-4 px-6 max-w-xs">
                      <p className="text-gray-700 leading-relaxed line-clamp-2">{rev.comment}</p>
                      {rev.images && Array.isArray(rev.images) && rev.images.length > 0 && (
                        <div className="flex space-x-1.5 mt-2">
                          {rev.images.map((img, idx) => (
                            <img key={idx} src={img} alt="rev" className="w-7 h-9 object-cover rounded border" />
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Admin Reply */}
                    <td className="py-4 px-6 max-w-xs">
                      {rev.admin_reply ? (
                        <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded text-[11px] text-gray-700 space-y-1">
                          <p className="font-semibold text-black flex items-center space-x-1">
                            <CornerDownRight size={11} className="text-zinc-500" />
                            <span>TVC-Shop Official:</span>
                          </p>
                          <p className="line-clamp-2 italic">{rev.admin_reply}</p>
                        </div>
                      ) : (
                        <span className="text-[10px] uppercase font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                          Chưa phản hồi
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenReply(rev)}
                        className="px-3 py-1.5 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded hover:bg-zinc-800 transition-colors inline-flex items-center space-x-1"
                      >
                        <MessageSquare size={12} />
                        <span>{rev.admin_reply ? 'Sửa' : 'Trả lời'}</span>
                      </button>
                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded hover:bg-red-50"
                        title="Xóa đánh giá"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white max-w-lg w-full p-6 rounded-lg shadow-2xl relative">
            <button
              onClick={() => setReplyModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="font-bold text-base uppercase tracking-wider text-black mb-1">
              Phản Hồi Đánh Giá Khách Hàng
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Phản hồi chính thức sẽ xuất hiện trực tiếp dưới bài đánh giá tại trang chi tiết sản phẩm.
            </p>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded text-xs mb-4">
              <p className="font-bold text-black mb-1">{selectedReview.user?.full_name} ({selectedReview.rating} sao):</p>
              <p className="text-gray-600 italic">"{selectedReview.comment}"</p>
            </div>

            <form onSubmit={handleSubmitReply} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-600 mb-1">
                  Nội dung phản hồi từ TVC-Shop *
                </label>
                <textarea
                  rows="4"
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Cảm ơn quý khách đã tin tưởng và ủng hộ sản phẩm của TVC-Shop..."
                  className="w-full border border-gray-300 p-3 text-xs rounded focus:border-black focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-xs uppercase font-bold tracking-wider rounded hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-black text-white text-xs uppercase font-bold tracking-wider rounded hover:bg-zinc-800 transition-colors disabled:bg-gray-400"
                >
                  {submitting ? 'Đang gửi...' : 'Gửi Phản Hồi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
