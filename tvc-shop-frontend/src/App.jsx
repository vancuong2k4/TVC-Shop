import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { CompareProvider } from './context/CompareContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { CurrencyProvider } from './context/CurrencyContext';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import GoogleCallback from './pages/Auth/GoogleCallback';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import GiftCards from './pages/GiftCards';
import GroupBuy from './pages/GroupBuy';
import FAQ from './pages/FAQ';
import SharedCart from './pages/SharedCart';
import OccasionOutfits from './pages/OccasionOutfits';
import LookbookReels from './pages/LookbookReels';
import Preorders from './pages/Preorders';
import VirtualFittingRoom from './pages/VirtualFittingRoom';
import StylistQuiz from './pages/StylistQuiz';
import PrivateSalon from './pages/PrivateSalon';
import GarmentCare from './pages/GarmentCare';
import BespokeBox from './pages/BespokeBox';
import FabricArchive from './pages/FabricArchive';
import ChatbotWidget from './components/chatbot/ChatbotWidget';
import SocialProofPopup from './components/common/SocialProofPopup';
import LuckyWheelButton from './components/common/LuckyWheelButton';

// Admin Imports
import AdminRoute from './components/common/AdminRoute';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminBanners from './pages/admin/AdminBanners';
import AdminReviews from './pages/admin/AdminReviews';

import AdminUsers from './pages/admin/AdminUsers';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
            <CompareProvider>
              <RecentlyViewedProvider>
                <CurrencyProvider>
                <Router>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/gift-cards" element={<GiftCards />} />
          <Route path="/group-buy" element={<GroupBuy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/cart/shared/:code" element={<SharedCart />} />
          <Route path="/occasions" element={<OccasionOutfits />} />
          <Route path="/lookbook" element={<LookbookReels />} />
          <Route path="/pre-orders" element={<Preorders />} />
          <Route path="/fitting-room" element={<VirtualFittingRoom />} />
          <Route path="/stylist-quiz" element={<StylistQuiz />} />
          <Route path="/private-salon" element={<PrivateSalon />} />
          <Route path="/garment-care" element={<GarmentCare />} />
          <Route path="/bespoke-box" element={<BespokeBox />} />
          <Route path="/fabric-archive" element={<FabricArchive />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminLayout><AdminProducts /></AdminLayout></AdminRoute>} />
          <Route path="/admin/coupons" element={<AdminRoute><AdminLayout><AdminCoupons /></AdminLayout></AdminRoute>} />
          <Route path="/admin/blogs" element={<AdminRoute><AdminLayout><AdminBlogs /></AdminLayout></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
          <Route path="/admin/banners" element={<AdminRoute><AdminLayout><AdminBanners /></AdminLayout></AdminRoute>} />
          <Route path="/admin/reviews" element={<AdminRoute><AdminLayout><AdminReviews /></AdminLayout></AdminRoute>} />

          <Route path="/auth/google/callback" element={<GoogleCallback />} />
        </Routes>
        <ChatbotWidget />
        <SocialProofPopup />
        <LuckyWheelButton />
        </Router>
        </CurrencyProvider>
        </RecentlyViewedProvider>
        </CompareProvider>
        </ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
