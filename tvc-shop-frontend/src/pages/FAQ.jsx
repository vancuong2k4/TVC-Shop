import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import api from '../api/axios';
import { 
  HelpCircle, ChevronDown, Send, CheckCircle2, 
  Search, MessageSquare, Truck, ShieldCheck, CreditCard, Sparkles 
} from 'lucide-react';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState([1]); // Mặc định mở câu đầu tiên
  const [loading, setLoading] = useState(true);

  // Form liên hệ
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState('');

  useEffect(() => {
    fetchFaqs(activeCategory);
  }, [activeCategory]);

  const fetchFaqs = async (cat) => {
    setLoading(true);
    try {
      const response = await api.get(`/faqs?category=${cat}`);
      setFaqs(response.data.data || []);
      if (response.data.categories) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Lỗi khi tải FAQ:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (id) => {
    setOpenIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleInquiryChange = (e) => {
    setInquiryForm({ ...inquiryForm, [e.target.name]: e.target.value });
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setInquirySuccess('');

    try {
      const response = await api.post('/faqs/inquiry', inquiryForm);
      setInquirySuccess(response.data.message);
      setInquiryForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      alert('Có lỗi xảy ra khi gửi tin nhắn hỗ trợ.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#FAF9F6] min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-24 pb-24">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-5xl">
          <Breadcrumb items={[{ label: 'Trang chủ', link: '/' }, { label: 'Trung Tâm Hỗ Trợ & FAQ' }]} />

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-[0.25em] mb-4">
              <HelpCircle size={12} className="text-amber-300" />
              <span>Customer Care & Help Center</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-black mb-4">
              Câu Hỏi Thường Gặp
            </h1>
            <p className="text-xs md:text-sm text-gray-500 uppercase tracking-widest leading-relaxed">
              Giải đáp nhanh chóng mọi thắc mắc về vận chuyển, đổi trả, chọn size và dịch vụ khách hàng
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-xl mx-auto mb-10 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm câu hỏi (vận chuyển, đổi trả, mã giảm giá...)"
              className="w-full bg-white border border-gray-200 pl-11 pr-4 py-3 text-xs focus:border-black focus:outline-none shadow-sm"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeCategory === cat.id
                    ? 'bg-black text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-black'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="space-y-4 mb-20">
            {loading ? (
              <div className="py-16 text-center text-xs uppercase tracking-widest text-gray-400">
                Đang tải thông tin hỗ trợ...
              </div>
            ) : filteredFaqs.length === 0 ? (
              <div className="bg-white border border-gray-100 p-12 text-center text-gray-500 text-xs uppercase tracking-widest">
                Không tìm thấy câu trả lời phù hợp với từ khóa của bạn.
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openIds.includes(faq.id);
                return (
                  <div
                    key={faq.id}
                    className="bg-white border border-gray-100 overflow-hidden shadow-sm transition-all"
                  >
                    <button
                      onClick={() => toggleAccordion(faq.id)}
                      className="w-full p-6 text-left flex justify-between items-center space-x-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-zinc-100 text-zinc-600 flex-shrink-0">
                          {faq.category_name}
                        </span>
                        <h3 className="font-serif font-bold text-sm text-black truncate">
                          {faq.question}
                        </h3>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-black' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 pt-2 text-xs text-gray-600 leading-relaxed border-t border-gray-50 font-light">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Direct Support Contact Form */}
          <div className="bg-white border border-gray-100 p-8 md:p-12 shadow-sm max-w-3xl mx-auto">
            <div className="text-center max-w-md mx-auto mb-8">
              <MessageSquare size={28} className="mx-auto text-black mb-3" />
              <h3 className="font-serif font-bold text-xl uppercase tracking-tight text-black mb-1">
                Chưa Tìm Thấy Câu Trả Lời?
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Gửi câu hỏi trực tiếp cho đội ngũ hỗ trợ TVC-Shop. Chúng tôi sẽ phản hồi trong vòng 2 giờ.
              </p>
            </div>

            {inquirySuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 size={32} className="text-emerald-600 mx-auto" />
                <h4 className="font-serif font-bold text-sm text-emerald-900">Gửi Thắc Mắc Thành Công!</h4>
                <p className="text-xs text-emerald-700">{inquirySuccess}</p>
                <button
                  onClick={() => setInquirySuccess('')}
                  className="mt-3 px-4 py-1.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest"
                >
                  Gửi thêm câu hỏi
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-600 mb-1">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={inquiryForm.name}
                      onChange={handleInquiryChange}
                      placeholder="Nguyễn Văn A"
                      className="w-full border border-gray-200 px-3.5 py-2.5 text-xs focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-600 mb-1">
                      Email nhận phản hồi *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={inquiryForm.email}
                      onChange={handleInquiryChange}
                      placeholder="yourname@domain.com"
                      className="w-full border border-gray-200 px-3.5 py-2.5 text-xs focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-600 mb-1">
                    Chủ đề cần hỗ trợ *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={inquiryForm.subject}
                    onChange={handleInquiryChange}
                    placeholder="Vấn đề đơn hàng, kích thước, thanh toán..."
                    className="w-full border border-gray-200 px-3.5 py-2.5 text-xs focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-600 mb-1">
                    Nội dung chi tiết *
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    required
                    value={inquiryForm.message}
                    onChange={handleInquiryChange}
                    placeholder="Mô tả cụ thể thắc mắc của bạn để chúng tôi phục vụ chu đáo nhất..."
                    className="w-full border border-gray-200 px-3.5 py-2.5 text-xs focus:border-black focus:outline-none resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-black text-white text-xs uppercase font-bold tracking-[0.2em] hover:bg-zinc-800 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Gửi Câu Hỏi Cho Tư Vấn Viên</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
