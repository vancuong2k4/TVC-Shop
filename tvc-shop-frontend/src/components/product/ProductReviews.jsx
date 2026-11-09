import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, Image, X, UploadCloud, ThumbsUp, CheckCircle, 
  Filter, AlertCircle, Camera, Check, ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const STAR_FILTERS = [
  { value: 'all', label: 'Tất Cả' },
  { value: '5', label: '5 Sao' },
  { value: '4', label: '4 Sao' },
  { value: '3', label: '3 Sao' },
  { value: '2', label: '2 Sao' },
  { value: '1', label: '1 Sao' },
  { value: 'with_image', label: 'Có Hình Ảnh' }
];

const ProductReviews = ({ productId }) => {
  const { user } = useAuth();
  
  // Data states
  const [reviewsData, setReviewsData] = useState({ 
    average_rating: 0, 
    total_reviews: 0, 
    rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    reviews: [] 
  });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  // Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef(null);

  // Modal zoom image
  const [previewZoomImage, setPreviewZoomImage] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('product_id', productId);
      params.append('sort', sortOrder);

      if (activeFilter === 'with_image') {
        params.append('has_image', '1');
      } else if (activeFilter !== 'all') {
        params.append('rating', activeFilter);
      }

      const res = await api.get(`/reviews?${params.toString()}`);
      setReviewsData(res.data);
    } catch (error) {
      console.error("Lỗi khi tải đánh giá", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, activeFilter, sortOrder]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Tối đa 4 ảnh
    const remainingSlots = 4 - selectedImages.length;
    const newFiles = files.slice(0, remainingSlots);

    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    setSelectedImages(prev => [...prev, ...newFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeSelectedImage = (index) => {
    setSelectedImages(prev => prev.filter((_, idx) => idx !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('product_id', productId);
      formData.append('rating', rating);
      formData.append('comment', comment);

      selectedImages.forEach(img => {
        formData.append('images[]', img);
      });

      await api.post('/reviews', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMsg("Cảm ơn bạn! Đánh giá và hình ảnh thực tế của bạn đã được ghi nhận thành công.");
      setComment('');
      setSelectedImages([]);
      setImagePreviews([]);
      setRating(5);
      fetchReviews();
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Có lỗi xảy ra khi gửi bài đánh giá. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const calculatePercentage = (count) => {
    if (!reviewsData.total_reviews) return 0;
    return Math.round((count / reviewsData.total_reviews) * 100);
  };

  return (
    <div className="mt-24 pt-16 border-t border-gray-200">
      
      {/* Title */}
      <div className="mb-12">
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 block mb-1">
          Trải Nghiệm Khách Hàng
        </span>
        <h2 className="text-3xl font-serif font-bold uppercase tracking-tight text-gray-900">
          Đánh Giá & Phản Hồi ({reviewsData.total_reviews})
        </h2>
      </div>

      {/* Review Analytics Summary Card */}
      <div className="bg-gray-50/70 p-6 md:p-10 border border-gray-200 rounded-sm mb-12 flex flex-col lg:flex-row items-center gap-10">
        
        {/* Left: Big Rating Number */}
        <div className="text-center lg:text-left flex-shrink-0 lg:border-r lg:border-gray-200 lg:pr-12">
          <div className="text-6xl font-bold font-serif text-gray-900 mb-2">
            {reviewsData.average_rating ? Number(reviewsData.average_rating).toFixed(1) : '5.0'}
          </div>
          <div className="flex justify-center lg:justify-start text-amber-500 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={20} 
                className={star <= Math.round(reviewsData.average_rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} 
              />
            ))}
          </div>
          <p className="text-xs uppercase font-bold tracking-widest text-gray-500">
            Dựa trên {reviewsData.total_reviews} lượt đánh giá
          </p>
        </div>

        {/* Center: Rating Distribution Bars */}
        <div className="flex-1 w-full max-w-md space-y-2.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviewsData.rating_distribution?.[stars] || 0;
            const percentage = calculatePercentage(count);
            return (
              <div key={stars} className="flex items-center space-x-3 text-xs">
                <span className="w-12 font-bold text-gray-700 flex items-center space-x-1">
                  <span>{stars}</span>
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-black rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-gray-400 font-medium">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Right: Verified Notice */}
        <div className="lg:border-l lg:border-gray-200 lg:pl-10 text-center lg:text-left max-w-xs">
          <div className="flex items-center justify-center lg:justify-start space-x-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
            <ShieldCheck size={18} />
            <span>100% Đánh Giá Thật</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Chỉ những khách hàng đã đặt mua sản phẩm thành công tại TVC-Shop mới có quyền gửi phản hồi và đăng tải hình ảnh trải nghiệm.
          </p>
        </div>
      </div>

      {/* Main Grid: Form (Left) & Reviews Feed (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column (5 Cols): Review Submission Form */}
        <div className="lg:col-span-5 bg-white p-6 md:p-8 border border-gray-200 rounded-sm shadow-sm sticky top-28">
          <h3 className="text-base font-bold uppercase tracking-widest mb-4 border-b border-gray-100 pb-3 flex items-center space-x-2">
            <Camera size={18} />
            <span>Gửi Đánh Giá Của Bạn</span>
          </h3>

          {!user ? (
            <div className="p-6 bg-gray-50 text-center rounded-sm">
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                Vui lòng đăng nhập bằng tài khoản đã từng mua sản phẩm này để chia sẻ cảm nhận và hình ảnh thực tế.
              </p>
              <a 
                href="/login" 
                className="inline-block bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
              >
                Đăng Nhập Ngay
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-sm border border-rose-200 flex items-start space-x-2">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-sm border border-emerald-200 flex items-start space-x-2">
                  <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Mức Độ Hài Lòng
                </label>
                <div className="flex items-center space-x-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none transition-transform hover:scale-125"
                    >
                      <Star 
                        size={28} 
                        className={(hoverRating || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} 
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-700 ml-2">
                    {rating === 5 ? 'Tuyệt vời' : rating === 4 ? 'Hài lòng' : rating === 3 ? 'Bình thường' : rating === 2 ? 'Kém' : 'Rất tệ'}
                  </span>
                </div>
              </div>

              {/* Comment Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Cảm Nhận Chi Tiết
                </label>
                <textarea 
                  rows="4" 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  placeholder="Chất liệu vải ra sao? Form dáng có chuẩn với số đo của bạn không?..."
                  className="w-full border border-gray-300 p-3 text-xs outline-none focus:border-black"
                />
              </div>

              {/* Multi-Image Upload */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    Ảnh Chụp Thực Tế (Tối đa 4 ảnh)
                  </label>
                  <span className="text-[10px] text-gray-400 font-bold">{selectedImages.length}/4</span>
                </div>

                {/* Previews */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative aspect-square bg-gray-100 rounded-sm overflow-hidden border border-gray-200 group">
                      <img src={src} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeSelectedImage(idx)}
                        className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full hover:bg-black transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {selectedImages.length < 4 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square border border-dashed border-gray-300 hover:border-black flex flex-col items-center justify-center text-gray-400 hover:text-black transition-colors rounded-sm"
                    >
                      <UploadCloud size={20} className="mb-1" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Thêm ảnh</span>
                    </button>
                  )}
                </div>

                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleImageChange} 
                  className="hidden" 
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-4 hover:bg-gray-800 transition-colors disabled:bg-gray-400 shadow-sm"
              >
                {submitting ? 'Đang Tải Đánh Giá...' : 'Đăng Đánh Giá'}
              </button>
            </form>
          )}
        </div>

        {/* Right Column (7 Cols): Filter Bar & Reviews Feed */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Filter Bar & Sort dropdown */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gray-50 p-4 border border-gray-200 rounded-sm">
            <div className="flex flex-wrap gap-1.5">
              {STAR_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all ${
                    activeFilter === f.value 
                      ? 'bg-black text-white shadow-sm' 
                      : 'bg-white text-gray-600 hover:text-black border border-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="text-xs font-bold uppercase tracking-wider border border-gray-300 bg-white p-2 outline-none focus:border-black cursor-pointer"
            >
              <option value="newest">Mới nhất</option>
              <option value="highest">Đánh giá cao nhất</option>
              <option value="lowest">Đánh giá thấp nhất</option>
            </select>
          </div>

          {/* Reviews Feed */}
          {loading ? (
            <div className="text-center py-20 text-gray-400 text-xs uppercase tracking-widest font-bold animate-pulse">
              Đang tải đánh giá...
            </div>
          ) : reviewsData.reviews.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-gray-200 bg-gray-50/50 p-8 rounded-sm">
              <Camera size={36} className="mx-auto text-gray-300 mb-4" />
              <p className="text-sm font-serif italic text-gray-800 mb-1">Chưa có đánh giá nào phù hợp với bộ lọc</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Hãy là người đầu tiên trải nghiệm và chia sẻ hình ảnh feedback!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviewsData.reviews.map((review) => (
                <div 
                  key={review.id} 
                  className="bg-white p-6 border border-gray-200 rounded-sm hover:border-gray-400 transition-all shadow-sm"
                >
                  {/* Top user info */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-black text-white font-bold text-xs flex items-center justify-center uppercase overflow-hidden">
                        {review.user_avatar ? (
                          <img src={review.user_avatar} alt={review.full_name} className="w-full h-full object-cover" />
                        ) : (
                          review.full_name?.charAt(0) || 'U'
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs uppercase tracking-wider text-gray-900">
                            {review.full_name}
                          </span>
                          <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center space-x-0.5">
                            <Check size={10} strokeWidth={3} />
                            <span>Đã mua hàng</span>
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400 mt-0.5 block">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={14} 
                          className={star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-gray-700 leading-relaxed mt-2 mb-4">
                    {review.comment}
                  </p>

                  {/* Feedback Images Gallery */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                      {review.images.map((imgUrl, imgIdx) => (
                        <div 
                          key={imgIdx} 
                          onClick={() => setPreviewZoomImage(imgUrl)}
                          className="w-20 h-20 bg-gray-100 rounded-sm overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                        >
                          <img src={imgUrl} alt="Feedback thực tế" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Lightbox Modal phóng to ảnh review */}
      {previewZoomImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewZoomImage(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-transparent" onClick={(e) => e.stopPropagation()}>
            <img src={previewZoomImage} alt="Zoom" className="max-w-full max-h-[80vh] rounded-sm object-contain" />
            <button 
              onClick={() => setPreviewZoomImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 p-1"
            >
              <X size={26} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductReviews;
