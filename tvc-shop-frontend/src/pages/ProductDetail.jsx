import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import { ChevronRight, Star, Heart, Share2, Ruler, Minus, Plus } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductReviews from '../components/product/ProductReviews';
import { formatPrice } from '../utils/formatPrice';
import api from '../api/axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isLiked = isInWishlist(id || 1);

  // Scroll to top when changing products
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products`);
        const allProducts = response.data;
        const currentProduct = allProducts.find(p => String(p.id) === String(id));
        setProduct(currentProduct);
        
        // Find related products (same category or randomly selected)
        if (currentProduct) {
          const related = allProducts.filter(p => String(p.id) !== String(id) && p.category_id === currentProduct.category_id).slice(0, 4);
          if (related.length < 4) {
             const more = allProducts.filter(p => String(p.id) !== String(id) && !related.find(r => r.id === p.id)).slice(0, 4 - related.length);
             setRelatedProducts([...related, ...more]);
          } else {
             setRelatedProducts(related);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        window.productDebugError = error.toString();
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="animate-pulse text-gray-500 font-bold tracking-widest uppercase">Đang tải...</div></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="text-gray-500 font-bold tracking-widest uppercase">Không tìm thấy sản phẩm</div></div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20 container mx-auto px-4 md:px-8">
        <Breadcrumb items={[
          { name: 'Trang chủ', path: '/' },
          { name: 'Cửa hàng', path: '/shop' },
          { name: product.name, path: '' }
        ]} />
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-24">
            
            {/* Images (Left Column) */}
            <div className="lg:w-1/2 flex flex-col-reverse lg:flex-row gap-6">
              {/* Thumbnails */}
              <div className="flex lg:flex-col gap-4 overflow-x-auto lg:w-24 flex-shrink-0 hide-scrollbar">
                {[1,2,3,4].map(num => (
                  <button key={num} className="w-24 h-32 lg:w-full lg:h-32 bg-gray-100 flex-shrink-0 border-b-2 lg:border-b-0 lg:border-l-2 border-transparent hover:border-gray-400 focus:border-black transition-all">
                    <img src={product.image} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              {/* Main Image */}
              <div className="w-full lg:h-[600px] xl:h-[700px] aspect-[4/5] lg:aspect-auto bg-gray-50 relative group cursor-zoom-in flex-grow">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover object-top" />
              </div>
            </div>

            {/* Info (Right Column) */}
            <div className="lg:w-1/2 flex flex-col justify-center">
              <h1 className="text-3xl md:text-5xl font-serif font-bold uppercase tracking-widest mb-6 leading-tight">{product.name}</h1>
              
              <div className="flex items-center space-x-6 mb-8 border-b border-gray-100 pb-8">
                <div className="flex text-black">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <span className="text-sm text-gray-500 underline cursor-pointer hover:text-black transition-colors">Xem đánh giá</span>
                <span className="text-gray-300">|</span>
                <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-black transition-colors">
                  <Share2 size={16} /> <span>Chia sẻ</span>
                </button>
              </div>

              <div className="text-3xl font-medium mb-8">
                {product.discount_price ? (
                  <>
                    <span className="text-gray-400 text-xl line-through mr-3 font-normal">{formatPrice(product.price)}</span>
                    {formatPrice(product.discount_price)}
                  </>
                ) : (
                  formatPrice(product.price)
                )}
              </div>

              <p className="text-gray-500 leading-relaxed mb-10 max-w-lg">
                {product.description || "Thiết kế tối giản với phom dáng chuẩn mực, mang đến vẻ ngoài thanh lịch và chuyên nghiệp. Chất liệu vải cao cấp, phù hợp cho nhiều hoàn cảnh."}
              </p>

              {/* Color Selection */}
              <div className="mb-10">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-5">Màu sắc: <span className="text-gray-500 font-normal ml-2">{selectedColor}</span></h3>
                <div className="flex space-x-5">
                  <button onClick={() => setSelectedColor('Black')} className={`w-10 h-10 rounded-full bg-black ring-2 ring-offset-4 transition-all ${selectedColor === 'Black' ? 'ring-black' : 'ring-transparent border border-gray-300'}`}></button>
                  <button onClick={() => setSelectedColor('White')} className={`w-10 h-10 rounded-full bg-white border ring-2 ring-offset-4 transition-all ${selectedColor === 'White' ? 'ring-black border-transparent' : 'ring-transparent border-gray-300'}`}></button>
                  <button onClick={() => setSelectedColor('Navy')} className={`w-10 h-10 rounded-full bg-blue-900 ring-2 ring-offset-4 transition-all ${selectedColor === 'Navy' ? 'ring-black' : 'ring-transparent border border-gray-300'}`}></button>
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-12">
                <div className="flex justify-between items-end mb-5 max-w-md">
                  <h3 className="text-xs font-bold uppercase tracking-widest">Kích cỡ</h3>
                  <button className="flex items-center space-x-2 text-xs text-gray-500 hover:text-black transition-colors underline">
                    <Ruler size={16} /> <span>Bảng kích cỡ</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-4 max-w-md">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <button 
                      key={size} 
                      onClick={() => setSelectedSize(size)}
                      className={`w-16 h-14 border flex items-center justify-center text-sm font-medium transition-colors ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-600 hover:border-black hover:text-black'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Cart Actions */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12 max-w-md">
                <div className="flex items-center border border-black w-full sm:w-1/3 justify-between">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 hover:bg-gray-100 transition-colors"><Minus size={18} /></button>
                  <span className="font-semibold text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-4 hover:bg-gray-100 transition-colors"><Plus size={18} /></button>
                </div>
                <button 
                  onClick={() => addToCart(product, quantity, selectedSize, selectedColor)}
                  className="bg-black text-white px-8 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors duration-300 flex-grow"
                >
                  Thêm Vào Giỏ
                </button>
                <button 
                  onClick={() => toggleWishlist(id || 1)}
                  className="border border-black p-4 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                >
                  <Heart size={24} strokeWidth={1.5} className={isLiked ? "fill-red-500 text-red-500" : ""} />
                </button>
              </div>

              {/* Additional Info Accordions */}
              <div className="border-t border-gray-200 max-w-md">
                <details className="group border-b border-gray-200 py-6 cursor-pointer">
                  <summary className="flex justify-between items-center font-bold uppercase tracking-widest text-xs outline-none">
                    Chất liệu & Bảo quản
                    <span className="transition duration-300 group-open:rotate-180">
                      <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="text-gray-500 mt-5 text-sm leading-relaxed">
                    70% Polyester, 30% Viscose. Giặt tay nhẹ nhàng bằng nước lạnh. Không sử dụng thuốc tẩy. Ủi ở nhiệt độ thấp. Tránh phơi trực tiếp dưới ánh nắng gay gắt.
                  </p>
                </details>
                <details className="group border-b border-gray-200 py-6 cursor-pointer">
                  <summary className="flex justify-between items-center font-bold uppercase tracking-widest text-xs outline-none">
                    Giao hàng & Đổi trả
                    <span className="transition duration-300 group-open:rotate-180">
                      <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="text-gray-500 mt-5 text-sm leading-relaxed">
                    Giao hàng miễn phí cho đơn hàng từ {formatPrice(100)}. Đổi trả dễ dàng trong vòng 30 ngày kể từ ngày nhận hàng. Vui lòng giữ nguyên tem mác và tình trạng sản phẩm.
                  </p>
                </details>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="border-t border-gray-200 pt-24">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-center mb-16">Có Thể Bạn Cũng Thích</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

        {/* --- Phần Hiển thị Reviews --- */}
        <ProductReviews productId={id || 1} />
        
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
