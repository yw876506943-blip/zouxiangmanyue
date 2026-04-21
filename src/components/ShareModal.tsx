import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link, QrCode, MessageCircle, Check, Download, Search } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  portfolio?: any[];
}

export function ShareModal({ isOpen, onClose, profile, portfolio = [] }: ShareModalProps) {
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
              className="w-full max-w-[340px] relative pb-16"
            >
              <div 
                className="w-full bg-[#ffeaef] relative border-[3px] border-[#1c1c2e] overflow-hidden rounded-[2rem] shadow-[4px_4px_0px_#1c1c2e]"
              >
                {/* Background stars */}
                <div className="absolute top-4 left-4 text-yellow-400 text-xl">✨</div>
                <div className="absolute top-12 right-6 text-yellow-400 text-2xl">✨</div>
                <div className="absolute top-1/2 left-2 text-yellow-400 text-lg">✨</div>
                <div className="absolute bottom-16 right-4 text-yellow-400 text-xl">✨</div>

                <div className="pt-6 pb-4 px-4 flex flex-col items-center">
                  
                  {/* Top Header */}
                  <div className="w-full text-center mb-4">
                    <h2 
                      className="text-white font-black text-xl italic tracking-widest mb-1"
                      style={{ WebkitTextStroke: '1.5px #1c1c2e', textShadow: '2px 2px 0px #1c1c2e' }}
                    >
                      遇见你的专属二次元创作者！
                    </h2>
                    <div className="inline-flex items-center space-x-2 bg-white/60 rounded-full py-1.5 px-4 border-[2px] border-[#1c1c2e]">
                      <div className="w-6 h-6 bg-cyan-100 rounded-full border border-[#1c1c2e] flex items-center justify-center text-xs">🐘</div>
                      <span 
                        className="font-black text-white italic tracking-wider text-[17px]"
                        style={{ WebkitTextStroke: '1px #1c1c2e', textShadow: '2px 2px 0px #1c1c2e' }}
                      >
                        小程序：走象漫约
                      </span>
                    </div>
                  </div>

                  {/* Step 1 */}
                  <div className="w-full mb-3">
                    <div className="inline-flex items-center space-x-1.5 bg-[#7dd3fc] border-[2px] border-[#1c1c2e] rounded-full px-3 py-1 mb-2">
                       <span className="font-bold text-[#1c1c2e] text-[13px] flex items-center tracking-wide">1. <Search size={14} className="mx-1 stroke-[3]" /> 微信搜索：走象漫约</span>
                    </div>
                    <div className="bg-[#a5f3fc] border-[2px] border-[#1c1c2e] rounded-[1.25rem] p-4 flex justify-center h-28 relative overflow-hidden">
                       <div className="w-48 h-32 bg-[#e0e7ff] border-[2px] border-[#1c1c2e] rounded-t-[1.5rem] mt-2 relative overflow-hidden flex flex-col pt-3 px-3 shadow-inner">
                         <div className="w-full bg-white border-[2px] border-[#1c1c2e] rounded-full py-1 px-3 flex items-center shadow-sm">
                           <Search size={14} className="text-slate-400 mr-2" />
                           <span className="text-[13px] font-bold text-slate-800">走象漫约</span>
                         </div>
                       </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="w-full mb-3">
                    <div className="inline-flex items-center space-x-1.5 bg-[#7dd3fc] border-[2px] border-[#1c1c2e] rounded-full px-3 py-1 mb-2">
                       <span className="font-bold text-[#1c1c2e] text-[13px] flex items-center tracking-wide">2. <Search size={14} className="mx-1 stroke-[3]" /> 首页搜索【{profile?.name}】</span>
                    </div>
                    
                    {/* Profile Card */}
                    <div className="bg-white border-[2px] border-[#1c1c2e] rounded-2xl p-3 shadow-sm">
                      <div className="flex items-center space-x-3 mb-2">
                        <img 
                          src={profile?.avatar || "https://picsum.photos/seed/avatar/150/150"} 
                          className="w-12 h-12 rounded-full border-[2px] border-[#1c1c2e] object-cover shrink-0 bg-slate-100" 
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h3 className="font-bold text-base text-slate-800 leading-tight mb-1">{profile?.name}</h3>
                          <p className="text-[11px] text-slate-600 font-medium">技巧化妆师</p> 
                        </div>
                      </div>
                      
                      <p className="text-[12px] text-slate-700 leading-snug mb-3">
                        {profile?.bio || '擅长Lolita、古风、COSPLAY妆面，用心塑造每一个角色。'}
                      </p>
                      
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {(profile?.tags || ['妆娘', 'COSPLAY', 'Lolita', '古风']).slice(0, 4).map((tag: string, idx: number) => (
                           <span key={idx} className={`px-2 py-0.5 rounded-full text-white text-[11px] font-bold border border-[#1c1c2e] shadow-sm ${['bg-[#fbb6ce]', 'bg-[#5eead4]', 'bg-[#ffb3c6]', 'bg-[#c7d2fe]'][idx % 4]}`}>
                             {tag}
                           </span>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-1.5">
                        {(portfolio?.length ? portfolio : [
                           {images: ['https://picsum.photos/seed/1/300/400']},
                           {images: ['https://picsum.photos/seed/2/300/400']},
                           {images: ['https://picsum.photos/seed/3/300/400']}
                        ]).slice(0, 3).map((work, idx) => (
                          <div key={idx} className="aspect-[3/4] relative rounded-lg border border-[#1c1c2e] overflow-hidden bg-slate-100">
                             <img src={work.images?.[0] || 'https://picsum.photos/300'} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Bar */}
                  <div className="w-full bg-white border-[3px] border-[#1c1c2e] rounded-full py-2.5 flex items-center justify-center relative mt-3 shadow-[2px_2px_0px_#1c1c2e]">
                    <span className="font-black text-slate-800 text-[14px] tracking-widest pl-2">微信小程序搜索：走象漫约</span>
                    <div className="absolute right-2 w-8 h-8 rounded-full border border-slate-200 bg-cyan-50 shadow-sm flex items-center justify-center text-xs">🐘</div>
                  </div>
                </div>
              </div>
              
              {/* Save Button */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                <button 
                  onClick={handleSavePoster}
                  className="w-full max-w-[240px] h-12 bg-slate-800 text-white rounded-full font-bold text-[15px] active:scale-95 transition-transform flex items-center justify-center space-x-2 border-2 border-white/20 shadow-xl"
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
