import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration)
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
      
      {/* Toast Floating Notification Container */}
      <div className="fixed top-24 right-4 sm:right-8 z-50 flex flex-col space-y-3 pointer-events-none max-w-sm w-full">
        {toasts.map((t) => {
          let bg = 'bg-white border-gray-200 text-gray-900 shadow-xl';
          let icon = <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />;

          if (t.type === 'error') {
            icon = <AlertCircle size={18} className="text-rose-600 flex-shrink-0" />;
          } else if (t.type === 'warning') {
            icon = <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" />;
          } else if (t.type === 'info') {
            icon = <Info size={18} className="text-blue-600 flex-shrink-0" />;
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto p-4 rounded-sm border flex items-start space-x-3 transition-all duration-300 animate-slide-in-right ${bg}`}
            >
              <div className="mt-0.5">{icon}</div>
              <p className="text-xs font-medium leading-relaxed flex-1 text-gray-800">
                {t.message}
              </p>
              <button
                onClick={() => removeToast(t.id)}
                className="text-gray-400 hover:text-black p-0.5"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
