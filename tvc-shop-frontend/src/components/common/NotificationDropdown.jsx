import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, CheckCircle2, Clock, Truck, XCircle, 
  Sparkles, ChevronRight, CheckCheck, X 
} from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const NotificationDropdown = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unread_count || 0);
    } catch (error) {
      console.error('Lỗi khi tải thông báo:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Polling nhẹ mỗi 45 giây để cập nhật thông báo
    const interval = setInterval(fetchNotifications, 45000);
    return () => clearInterval(interval);
  }, [user]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  const renderIcon = (icon) => {
    switch (icon) {
      case 'check':
        return <CheckCircle2 size={16} className="text-emerald-600" />;
      case 'truck':
        return <Truck size={16} className="text-purple-600" />;
      case 'x':
        return <XCircle size={16} className="text-rose-600" />;
      case 'sparkles':
        return <Sparkles size={16} className="text-amber-500" />;
      default:
        return <Clock size={16} className="text-blue-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:opacity-70 transition-opacity p-1"
        title="Thông báo hoạt động"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-gray-200 shadow-2xl rounded-sm z-50 animate-slide-down text-black overflow-hidden">
          
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-900">
                Thông Báo
              </span>
              {unreadCount > 0 && (
                <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount} mới
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-gray-500 hover:text-black flex items-center space-x-1 uppercase tracking-wider"
              >
                <CheckCheck size={14} />
                <span>Đã đọc</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                Chưa có thông báo nào
              </div>
            ) : (
              notifications.map((item) => (
                <Link
                  key={item.id}
                  to={item.link || '/orders'}
                  onClick={() => setIsOpen(false)}
                  className={`p-4 flex items-start space-x-3.5 hover:bg-gray-50 transition-colors block ${
                    !item.is_read ? 'bg-gray-50/60' : 'bg-white'
                  }`}
                >
                  <div className="p-2 bg-white border border-gray-100 rounded-sm shadow-2xs mt-0.5">
                    {renderIcon(item.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${!item.is_read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'} line-clamp-1`}>
                      {item.title}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                  {!item.is_read && (
                    <span className="w-2 h-2 rounded-full bg-black flex-shrink-0 mt-2" />
                  )}
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
            <Link
              to="/orders"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold uppercase tracking-widest text-black hover:underline flex items-center justify-center space-x-1"
            >
              <span>Xem Lịch Sử Đơn Hàng</span>
              <ChevronRight size={13} />
            </Link>
          </div>

        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
