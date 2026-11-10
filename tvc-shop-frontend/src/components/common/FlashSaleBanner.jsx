import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { formatPrice } from '../../utils/formatPrice';
import { Flame, Clock, Sparkles, ArrowRight, Zap } from 'lucide-react';

const FlashSaleBanner = () => {
  const [data, setData] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  useEffect(() => {
    fetchFlashSale();
  }, []);

  const fetchFlashSale = async () => {
    try {
      const response = await api.get('/flash-sale');
      setData(response.data);
    } catch (error) {
      console.error('Lỗi khi tải Flash Sale:', error);
    }
  };

  useEffect(() => {
    if (!data?.end_timestamp) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = data.end_timestamp - now;

      if (distance <= 0) {
        setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
        clearInterval(timer);
        return;
      }

      const hours = Math.floor((distance / (1000 * 60 * 60)));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: hours < 10 ? `0${hours}` : `${hours}`,
        minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
        seconds: seconds < 10 ? `0${seconds}` : `${seconds}`
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [data]);

  if (!data || !data.items || data.items.length === 0) return null;

  return (
    <section className="bg-black text-white py-16 border-y border-zinc-800 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        {/* Header with Title and Countdown */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12 border-b border-zinc-800 pb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-950/80 border border-red-800/40 text-[10px] font-bold uppercase tracking-[0.25em] text-red-300 mb-3">
              <Flame size={13} className="text-red-400 animate-pulse" />
              <span>Limited Time Offer</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-serif font-bold uppercase tracking-tight text-white">
              {data.campaign_title}
            </h2>
            <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1.5 font-light">
              {data.campaign_subtitle}
            </p>
          </div>

          {/* Countdown Clock Display */}
          <div className="flex items-center space-x-3 bg-zinc-900/90 border border-zinc-800 p-3 px-5 self-start md:self-auto shadow-inner">
            <Clock size={16} className="text-zinc-400 mr-2" />
            <div className="text-center">
              <span className="font-mono text-xl md:text-2xl font-bold tracking-widest text-white">
                {timeLeft.hours}
              </span>
              <span className="block text-[8px] uppercase tracking-wider text-zinc-500 font-sans">Giờ</span>
            </div>
            <span className="font-mono text-xl font-bold text-zinc-600">:</span>
            <div className="text-center">
              <span className="font-mono text-xl md:text-2xl font-bold tracking-widest text-white">
                {timeLeft.minutes}
              </span>
              <span className="block text-[8px] uppercase tracking-wider text-zinc-500 font-sans">Phút</span>
            </div>
            <span className="font-mono text-xl font-bold text-zinc-600">:</span>
            <div className="text-center">
              <span className="font-mono text-xl md:text-2xl font-bold tracking-widest text-amber-300">
                {timeLeft.seconds}
              </span>
              <span className="block text-[8px] uppercase tracking-wider text-zinc-500 font-sans">Giây</span>
            </div>
          </div>
        </div>

        {/* Product Cards Slider / Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {data.items.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="group bg-zinc-900/40 border border-zinc-800 hover:border-zinc-500 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <Link to={`/product/${item.id}`} className="block relative aspect-[3/4] overflow-hidden bg-zinc-950">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs uppercase tracking-widest">
                      TVC Luxe
                    </div>
                  )}

                  {/* Discount Badge */}
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                    -{item.discount_percent}%
                  </div>

                  {item.is_almost_sold_out && (
                    <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm text-amber-300 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border border-amber-300/30">
                      Sắp cháy hàng
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="p-4">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-1">
                    {item.category_name}
                  </p>
                  <Link
                    to={`/product/${item.id}`}
                    className="block font-serif font-medium text-sm text-white group-hover:text-zinc-300 transition-colors truncate mb-2"
                  >
                    {item.name}
                  </Link>

                  <div className="flex items-baseline space-x-2 mb-3">
                    <span className="font-serif font-bold text-base text-white">
                      {formatPrice(item.flash_price)}
                    </span>
                    <span className="text-xs text-zinc-500 line-through">
                      {formatPrice(item.original_price)}
                    </span>
                  </div>

                  {/* Stock Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>Đã bán {item.sold_percent}%</span>
                      <span>Còn {item.stock_remaining} chiếc</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-amber-400"
                        style={{ width: `${item.sold_percent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                <Link
                  to={`/product/${item.id}`}
                  className="w-full py-2.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors flex items-center justify-center space-x-1"
                >
                  <span>Săn Ngay</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashSaleBanner;
