import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from './Home/HeroSection';
import CategoryGrid from './Home/CategoryGrid';
import FeaturedProducts from './Home/FeaturedProducts';
import PromoBanner from './Home/PromoBanner';
import FlashSaleBanner from '../components/common/FlashSaleBanner';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FlashSaleBanner />
        <CategoryGrid />
        <FeaturedProducts />
        <PromoBanner />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
