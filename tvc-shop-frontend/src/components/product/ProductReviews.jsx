import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const ProductReviews = ({ productId }) => {
  const { user } = useAuth();
  const [reviewsData, setReviewsData] = useState({ average_rating: 0, total_reviews: 0, reviews: [] });
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews?product_id=${productId}`);
      setReviewsData(res.data);
    } catch (error) {
      console.error("Lỗi khi tải đánh giá", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      await api.post('/reviews', { product_id: productId, rating, comment });
      setSuccessMsg("Đánh giá của bạn đã được ghi nhận. Cảm ơn bạn!");
      setComment('');
      fetchReviews(); // Reload data
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="mt-20 pt-16 border-t border-gray-200">
      <div className="flex flex-col md:flex-row gap-12">
        
        {/* Left Col: Review Summary & Form */}
        <div className="md:w-1/3">
          <h2 className="text-2xl font-bold uppercase tracking-widest mb-6">Đánh giá Sản phẩm</h2>
          
          <div className="flex items-end space-x-4 mb-8">
            <span className="text-5xl font-bold">{reviewsData.average_rating.toFixed(1)}</span>
            <div className="pb-1">
              <div className="flex text-yellow-400 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} className={star <= Math.round(reviewsData.average_rating) ? 'fill-yellow-400' : 'text-gray-300'} />
                ))}
              </div>
              <span className="text-sm text-gray-500 font-semibold">{reviewsData.total_reviews} bài đánh giá</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 border border-gray-100">
            <h3 className="font-bold uppercase tracking-widest text-sm mb-4">Viết đánh giá của bạn</h3>
            
            {!user ? (
              <p className="text-sm text-gray-500">Vui lòng <a href="/login" className="text-black font-bold underline">Đăng nhập</a> và đã từng mua sản phẩm này để đánh giá.</p>
            ) : (
              <form onSubmit={handleSubmit}>
                {errorMsg && <div className="bg-red-50 text-red-500 p-3 text-xs mb-4 border border-red-200">{errorMsg}</div>}
                {successMsg && <div className="bg-green-50 text-green-600 p-3 text-xs mb-4 border border-green-200">{successMsg}</div>}
                
                <div className="mb-4">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Chất lượng (Sao)</label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star 
                          size={24} 
                          className={(hoverRating || rating) >= star ? 'fill-black text-black' : 'text-gray-300'} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Bình luận</label>
                  <textarea 
                    rows="3" 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    className="w-full border border-gray-300 p-3 outline-none focus:border-black text-sm custom-scrollbar"
                    placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-4 hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                >
                  {submitting ? 'Đang gửi...' : 'Gửi Đánh Giá'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Col: Review List */}
        <div className="md:w-2/3">
          {loading ? (
            <p className="text-sm text-gray-500">Đang tải đánh giá...</p>
          ) : reviewsData.reviews.length === 0 ? (
            <div className="text-center py-10 border border-gray-100 bg-gray-50">
              <p className="text-sm text-gray-500 uppercase tracking-widest">Chưa có đánh giá nào cho sản phẩm này.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviewsData.reviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-sm uppercase tracking-wider">{review.full_name}</span>
                      <div className="flex text-black mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={12} className={star <= review.rating ? 'fill-black text-black' : 'text-gray-200'} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-semibold">{formatDate(review.created_at)}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mt-3">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductReviews;
