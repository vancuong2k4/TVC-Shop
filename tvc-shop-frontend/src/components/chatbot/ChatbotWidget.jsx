import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import api from '../../api/axios'; // Import axios instance đã được cấu hình sẵn

const ChatbotWidget = () => {
  // --- Các State quản lý trạng thái của Chatbot ---
  const [isOpen, setIsOpen] = useState(false); // Trạng thái đóng/mở cửa sổ chat
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Xin chào! Tôi là trợ lý thời trang của TVC-Shop. Tôi có thể giúp gì cho bạn hôm nay?' }
  ]); // Lưu trữ danh sách tin nhắn
  const [inputValue, setInputValue] = useState(''); // Lưu trữ nội dung người dùng đang gõ
  const [isLoading, setIsLoading] = useState(false); // Trạng thái "AI đang gõ..."
  
  // Tham chiếu đến phần tử cuối cùng để tự động cuộn xuống dưới
  const messagesEndRef = useRef(null);

  // Hàm tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Cuộn xuống mỗi khi danh sách tin nhắn thay đổi
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Hàm xử lý gửi tin nhắn
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // Nếu khung nhập trống thì không làm gì cả
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    
    // 1. Thêm tin nhắn của người dùng vào giao diện ngay lập tức
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputValue(''); // Xóa trắng khung nhập
    setIsLoading(true); // Hiển thị trạng thái AI đang suy nghĩ

    try {
      // 2. Gọi API Backend (Laravel) để xử lý logic AI
      const response = await api.post('/chatbot/chat', { message: userText });
      
      // 3. Thêm câu trả lời của AI vào giao diện
      setMessages(prev => [...prev, { sender: 'ai', text: response.data.reply }]);
    } catch (error) {
      console.error("Lỗi khi gọi AI Chatbot:", error);
      // Xử lý thông báo lỗi cho người dùng
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: 'Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau nhé!' 
      }]);
    } finally {
      setIsLoading(false); // Tắt trạng thái chờ
    }
  };

  return (
    <>
      {/* Nút bấm nổi (Floating Button) ở góc dưới cùng bên phải */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-black text-white rounded-full shadow-2xl hover:bg-gray-800 hover:scale-105 transition-all duration-300 z-50 ${isOpen ? 'scale-0 opacity-0 invisible' : 'scale-100 opacity-100 visible'}`}
        aria-label="Mở khung chat hỗ trợ"
      >
        <MessageSquare size={28} />
      </button>

      {/* Cửa sổ Chat (Chat Window) */}
      <div 
        className={`fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 transition-all duration-500 ease-in-out z-50 ${isOpen ? 'translate-y-0 opacity-100 visible' : 'translate-y-10 opacity-0 invisible pointer-events-none'}`}
      >
        {/* Tiêu đề (Header) của cửa sổ Chat */}
        <div className="bg-black text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold tracking-wider uppercase text-sm">TVC-Shop AI</h3>
              <p className="text-[10px] text-gray-300 uppercase tracking-widest">Trợ lý thời trang</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-300 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Khu vực hiển thị tin nhắn (Message List) */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col space-y-4 custom-scrollbar">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-black text-white rounded-tr-sm' 
                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {/* Hiển thị hiệu ứng "AI đang gõ..." */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center space-x-2">
                <Loader2 size={16} className="animate-spin text-gray-400" />
                <span className="text-xs text-gray-400 uppercase tracking-widest">AI đang suy nghĩ...</span>
              </div>
            </div>
          )}
          
          {/* Một thẻ div rỗng ở cuối để làm mốc cuộn */}
          <div ref={messagesEndRef} />
        </div>

        {/* Khu vực nhập tin nhắn (Input Area) */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Hỏi về thời trang..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm outline-none focus:border-black transition-colors"
              disabled={isLoading} // Vô hiệu hóa khi đang chờ AI trả lời
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} className="transform translate-x-[-1px] translate-y-[1px]" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatbotWidget;
