import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link, QrCode, MessageCircle, Check, Download } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
}

export function ShareModal({ isOpen, onClose, profile }: ShareModalProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showPoster, setShowPoster] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://example.com/profile/123');
    showToast('链接已复制到剪贴板');
  };

  const handleWechatShare = () => {
    showToast('请点击右上角菜单发送给朋友');
  };

  const handleSavePoster = () => {
    showToast('海报已保存到相册');
    setTimeout(() => {
      setShowPoster(false);
    }, 1500);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && !showPoster && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[61] pb-safe"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-800">分享主页</h3>
                  <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600">
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <button onClick={handleWechatShare} className="flex flex-col items-center space-y-2">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 active:scale-95 transition-transform">
                      <MessageCircle size={28} />
                    </div>
                    <span className="text-xs text-slate-600 font-medium">微信好友</span>
                  </button>
                  
                  <button onClick={() => setShowPoster(true)} className="flex flex-col items-center space-y-2">
                    <div className="w-14 h-14 bg-lavender-50 rounded-2xl flex items-center justify-center text-lavender-500 active:scale-95 transition-transform">
                      <QrCode size={28} />
                    </div>
                    <span className="text-xs text-slate-600 font-medium">生成海报</span>
                  </button>

                  <button onClick={handleCopyLink} className="flex flex-col items-center space-y-2">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 active:scale-95 transition-transform">
                      <Link size={28} />
                    </div>
                    <span className="text-xs text-slate-600 font-medium">复制链接</span>
                  </button>
                </div>
                
                <button 
                  onClick={onClose}
                  className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold text-[15px] active:scale-[0.98] transition-transform"
                >
                  取消
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Poster Modal */}
      <AnimatePresence>
        {showPoster && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-6"
            onClick={() => setShowPoster(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl relative"
            >
              {/* Poster Content */}
              <div className="h-32 bg-gradient-to-br from-lavender-200 to-misty-200 relative">
                <div className="absolute -bottom-10 left-6">
                  <img 
                    src={profile?.avatar || "https://picsum.photos/seed/avatar/150/150"} 
                    alt="Avatar" 
                    className="w-20 h-20 rounded-full border-4 border-white shadow-sm object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="pt-12 pb-6 px-6">
                <h3 className="text-xl font-bold text-slate-800 mb-1">{profile?.name || '我的主页'}</h3>
                <p className="text-sm text-slate-500 mb-4">{profile?.bio || '承接各类妆造，欢迎预约~'}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {profile?.tags?.slice(0, 3).map((tag: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-slate-50 text-slate-500 text-xs rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between p-4 bg-lavender-50 rounded-2xl border border-lavender-100/50">
                  <div>
                    <p className="text-sm font-bold text-slate-800 mb-1">长按识别小程序码</p>
                    <p className="text-xs text-slate-500">查看我的完整作品与档期</p>
                  </div>
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-lavender-500 shadow-sm shrink-0">
                    <QrCode size={32} />
                  </div>
                </div>
              </div>
              
              {/* Save Button Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent pt-12">
                <button 
                  onClick={handleSavePoster}
                  className="w-full h-12 bg-slate-800 text-white rounded-xl font-bold text-[15px] active:scale-95 transition-transform shadow-lg shadow-slate-800/20 flex items-center justify-center space-x-2"
                >
                  <Download size={18} />
                  <span>保存海报到相册</span>
                </button>
              </div>
            </motion.div>
            
            <button 
              onClick={() => setShowPoster(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-xl z-[80] flex items-center space-x-2"
          >
            <Check size={16} className="text-emerald-400" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
