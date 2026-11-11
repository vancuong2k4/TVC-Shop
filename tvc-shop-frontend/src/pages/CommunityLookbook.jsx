import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Heart, MessageCircle, Share2, ShoppingBag, 
  MapPin, Camera, Plus, Send, Check, ArrowRight, User 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../api/axios';
import { formatPrice } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function CommunityLookbook() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    author_name: '',
    caption: '',
    location: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const res = await api.get('/community-lookbook/feed');
      if (res.data?.success) {
        setPosts(res.data.posts || []);
      }
    } catch (err) {
      console.error('Failed to load lookbook feed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));

    try {
      await api.post(`/community-lookbook/posts/${postId}/like`);
    } catch {
      // optimistic update
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.author_name || !newPost.caption) {
      showToast('Vui lòng điền tên và cảm nhận phối đồ của bạn', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/community-lookbook/posts', newPost);
      if (res.data?.success) {
        setPosts(prev => [res.data.post, ...prev]);
        setIsCreateOpen(false);
        setNewPost({ author_name: '', caption: '', location: '' });
        showToast('Đã đăng tải thành công bản phối phong cách của bạn!', 'success');
      }
    } catch {
      showToast('Có lỗi xảy ra khi đăng bài', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickAdd = async (productId, productName, productPrice) => {
    try {
      await addToCart({ id: productId, name: productName, price: productPrice }, 1, 'M', 'Black');
      showToast(`Đã thêm "${productName}" vào giỏ hàng!`, 'success');
    } catch {
      showToast('Không thể thêm sản phẩm vào giỏ', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 max-w-5xl mx-auto px-4 md:px-8 w-full flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono uppercase tracking-widest text-zinc-300 mb-3">
            <Sparkles size={13} className="text-amber-400" />
            Curated Style Archive & Community Feed
          </div>
          <h1 className="text-3xl md:text-5xl font-serif tracking-tight uppercase mb-3">
            Bảng Tin Phong Cách Khách Hàng
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed">
            Nơi hội tụ những bản phối thời trang thực tế từ giới tinh hoa yêu mến TVC-Shop. Khám phá cách các chủ nhân diện trang phục trong đời sống và mua ngay món đồ yêu thích.
          </p>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setIsCreateOpen(!isCreateOpen)}
              className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-lg"
            >
              <Camera size={14} /> Chia Sẻ Bản Phối Của Bạn
            </button>
          </div>
        </div>

        {/* Modal / Collapse Box to Post Lookbook */}
        {isCreateOpen && (
          <div className="w-full max-w-xl p-6 rounded-3xl bg-zinc-950 border border-white/20 mb-12 shadow-2xl animate-in fade-in duration-200">
            <h3 className="text-base font-serif uppercase tracking-wide mb-3">Đăng Tải Bản Phối Phong Cách</h3>
            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div>
                <input
                  type="text"
                  placeholder="Họ tên quý khách (Ví dụ: Thùy Trang)"
                  value={newPost.author_name}
                  onChange={e => setNewPost(p => ({ ...p, author_name: e.target.value }))}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Địa điểm diện đồ (Ví dụ: Sofitel Legend Metropole Hà Nội)"
                  value={newPost.location}
                  onChange={e => setNewPost(p => ({ ...p, location: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div>
                <textarea
                  rows={3}
                  placeholder="Chia sẻ cảm xúc khi khoác lên mình trang phục TVC-Shop..."
                  value={newPost.caption}
                  onChange={e => setNewPost(p => ({ ...p, caption: e.target.value }))}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/15 text-xs text-zinc-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-white text-black font-semibold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-colors"
                >
                  {submitting ? 'Đang tải...' : 'Đăng Bài Phối'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Feed Posts */}
        {loading ? (
          <div className="h-[400px] flex flex-col items-center justify-center text-zinc-500">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest text-zinc-400">Đang tải bảng tin phong cách...</p>
          </div>
        ) : (
          <div className="w-full max-w-2xl space-y-12">
            {posts.map((post) => {
              const isLiked = likedPosts[post.id];
              const likesCount = isLiked ? post.likes_count + 1 : post.likes_count;

              return (
                <div 
                  key={post.id}
                  className="rounded-3xl bg-zinc-950/80 border border-white/15 overflow-hidden shadow-2xl backdrop-blur-md"
                >
                  {/* Post Author Bar */}
                  <div className="p-4 flex items-center justify-between border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <img 
                        src={post.author_avatar} 
                        alt={post.author_name} 
                        className="w-10 h-10 rounded-full object-cover border border-white/20"
                      />
                      <div>
                        <h4 className="text-xs font-semibold text-white">{post.author_name}</h4>
                        <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                          <MapPin size={10} className="text-rose-400" /> {post.location}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">{post.created_at}</span>
                  </div>

                  {/* Post Image Showcase */}
                  <div className="aspect-[4/5] w-full overflow-hidden relative group">
                    <img 
                      src={post.image_url} 
                      alt="Lookbook Outfit"
                      className="w-full h-full object-cover"
                    />

                    {/* Tagged Shoppable Product Floating Pill */}
                    {post.tagged_product_name && (
                      <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/20 flex items-center justify-between shadow-2xl">
                        <div className="min-w-0 pr-3">
                          <span className="text-[9px] uppercase font-mono tracking-wider text-zinc-400 block">Sản phẩm trong ảnh</span>
                          <h5 className="text-xs font-semibold text-white truncate">{post.tagged_product_name}</h5>
                          <span className="text-xs font-mono font-bold text-amber-300">
                            {formatPrice(post.tagged_product_price)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleQuickAdd(post.tagged_product_id, post.tagged_product_name, post.tagged_product_price)}
                          className="px-3 py-2 rounded-xl bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-zinc-200 transition-colors flex items-center gap-1.5 flex-shrink-0"
                          title="Thêm nhanh vào giỏ hàng"
                        >
                          <ShoppingBag size={13} /> Thêm Giỏ
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Post Actions & Caption */}
                  <div className="p-5">
                    <div className="flex items-center gap-4 mb-3">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-rose-400 transition-colors"
                      >
                        <Heart size={18} className={isLiked ? "fill-rose-500 text-rose-500" : ""} />
                        <span className="font-mono">{likesCount}</span>
                      </button>

                      <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                        <MessageCircle size={18} />
                        <span className="font-mono">Atelier Verified</span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 font-light leading-relaxed">
                      <strong className="text-white font-semibold mr-2">{post.author_handle}</strong>
                      {post.caption}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
