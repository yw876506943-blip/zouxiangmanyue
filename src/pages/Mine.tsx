import React, { useState, useRef, useEffect } from 'react';
import { Settings, DollarSign, MessageSquare, Info, ChevronRight, Edit3, Camera, ChevronLeft, LayoutTemplate, X, Check, Plus, Clock, Lock, Briefcase, User, Phone, Headphones } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { MineEditProfile } from './MineEditProfile';
import { MineFeedback } from './MineFeedback';

function MineMain({ profile, setProfile, userRole, onBecomeCreator, showAuthPhoneModal, setShowAuthPhoneModal, showChangePhoneModal, setShowChangePhoneModal, showToast, menuItems }: any) {
  const navigate = useNavigate();

  return (
    <motion.div 
      key="main"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pb-24 bg-[#f8fafc] min-h-screen relative"
    >
      {/* Cover Background */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-lavender-200 to-misty-100 z-0" />
      
      <div className="relative z-10 px-4 pt-20 space-y-6">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 shadow-sm border border-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                <img 
                  src={profile.avatar} 
                  alt="Avatar" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">{profile.name}</h1>
                <p className="text-sm text-slate-500 mt-0.5">ID: {profile.id}</p>
              </div>
            </div>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/mine/edit-profile')}
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Edit3 size={18} />
            </motion.button>
          </div>
        </motion.div>

        {/* Menu List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100/50">
            {menuItems.map((item: any, index: number) => (
              <React.Fragment key={item.title}>
                <MenuItem 
                  icon={item.icon} 
                  title={item.title} 
                  subtitle={item.subtitle} 
                  onClick={item.onClick}
                />
                {index < menuItems.length - 1 && <div className="h-px bg-slate-50 mx-4" />}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function Mine({ profile, setProfile, userRole, onBecomeCreator, onLogout }: any) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAuthPhoneModal, setShowAuthPhoneModal] = useState(false);
  const [showChangePhoneModal, setShowChangePhoneModal] = useState(false);
  
  const [newPhone, setNewPhone] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleSendCode = () => {
    if (!newPhone || newPhone.length !== 11) {
      showToast('请输入正确的11位手机号');
      return;
    }
    setCountdown(60);
    showToast('验证码已发送');
  };

  const handleConfirmChangePhone = () => {
    if (!newPhone || newPhone.length !== 11) {
      showToast('请输入正确的11位手机号');
      return;
    }
    if (!verifyCode || verifyCode.length !== 6) {
      showToast('请输入6位验证码');
      return;
    }
    setProfile({ ...profile, phone: newPhone });
    setShowChangePhoneModal(false);
    setNewPhone('');
    setVerifyCode('');
    setCountdown(0);
    showToast('手机号修改成功');
  };

  const menuItems = userRole === 'user' ? [
    { icon: <User size={20} className="text-blue-500" />, title: '个人资料', onClick: () => navigate('/mine/edit-profile') },
    { icon: <Headphones size={20} className="text-rose-500" />, title: '联系客服', onClick: () => { navigator.clipboard.writeText('zxmymini'); showToast('客服微信号已复制：zxmymini'); } },
    { icon: <MessageSquare size={20} className="text-orange-500" />, title: '建议与反馈', onClick: () => navigate('/mine/feedback') },
    { icon: <Info size={20} className="text-teal-500" />, title: '关于我们', subtitle: 'v1.0.0', onClick: () => showToast('当前已是最新版本 v1.0.0') },
    { icon: <Briefcase size={20} className="text-lavender-500" />, title: '成为创作者', onClick: () => setShowAuthPhoneModal(true) },
  ] : [
    { icon: <Phone size={20} className="text-slate-500" />, title: '修改手机号', subtitle: profile.phone || '未绑定', onClick: () => setShowChangePhoneModal(true) },
    { icon: <Headphones size={20} className="text-rose-500" />, title: '联系客服', onClick: () => { navigator.clipboard.writeText('zxmymini'); showToast('客服微信号已复制：zxmymini'); } },
    { icon: <MessageSquare size={20} className="text-blue-500" />, title: '建议与反馈', onClick: () => navigate('/mine/feedback') },
    { icon: <Info size={20} className="text-misty-500" />, title: '关于我们', subtitle: 'v1.0.0', onClick: () => showToast('当前已是最新版本 v1.0.0') },
  ];

  return (
    <>
      <Routes>
        <Route path="/" element={<MineMain profile={profile} setProfile={setProfile} userRole={userRole} onBecomeCreator={onBecomeCreator} showAuthPhoneModal={showAuthPhoneModal} setShowAuthPhoneModal={setShowAuthPhoneModal} showChangePhoneModal={showChangePhoneModal} setShowChangePhoneModal={setShowChangePhoneModal} showToast={showToast} menuItems={menuItems} />} />
        <Route path="edit-profile" element={<MineEditProfile profile={profile} setProfile={setProfile} userRole={userRole} showToast={showToast} onLogout={onLogout} />} />
        <Route path="feedback" element={<MineFeedback showToast={showToast} />} />
      </Routes>

      {/* Auth Phone Modal */}
      <AnimatePresence>
        {showAuthPhoneModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuthPhoneModal(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <div className="w-16 h-16 bg-lavender-50 rounded-full flex items-center justify-center text-lavender-500 mx-auto mb-4">
                <Phone size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 text-center">授权手机号</h3>
              <p className="text-sm text-slate-500 text-center mb-6">成为创作者需要绑定您的手机号以便接单联系</p>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowAuthPhoneModal(false)}
                  className="flex-1 h-12 rounded-xl bg-slate-100 text-slate-600 font-bold text-[15px] active:scale-[0.98] transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    setShowAuthPhoneModal(false);
                    if (onBecomeCreator) onBecomeCreator();
                  }}
                  className="flex-1 h-12 rounded-xl bg-slate-800 text-white font-bold text-[15px] active:scale-[0.98] transition-all shadow-md shadow-slate-800/20"
                >
                  确认授权
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Phone Modal */}
      <AnimatePresence>
        {showChangePhoneModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowChangePhoneModal(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">修改手机号</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <input
                    type="tel"
                    placeholder="请输入新手机号"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    maxLength={11}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500/50"
                  />
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="请输入验证码"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    maxLength={6}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500/50"
                  />
                  <button
                    onClick={handleSendCode}
                    disabled={countdown > 0}
                    className="px-4 bg-lavender-50 text-lavender-600 rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {countdown > 0 ? `${countdown}s后重发` : '获取验证码'}
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowChangePhoneModal(false);
                    setNewPhone('');
                    setVerifyCode('');
                    setCountdown(0);
                  }}
                  className="flex-1 h-12 rounded-xl bg-slate-100 text-slate-600 font-bold text-[15px] active:scale-[0.98] transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmChangePhone}
                  className="flex-1 h-12 rounded-xl bg-slate-800 text-white font-bold text-[15px] active:scale-[0.98] transition-all shadow-md shadow-slate-800/20"
                >
                  确认修改
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Dialog */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogoutConfirm(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-lg font-bold text-slate-800 mb-2 text-center">确认退出登录？</h3>
              <p className="text-sm text-slate-500 text-center mb-6">退出后需要重新登录</p>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 h-12 rounded-xl bg-slate-100 text-slate-600 font-bold text-[15px] active:scale-[0.98] transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    if (onLogout) onLogout();
                  }}
                  className="flex-1 h-12 rounded-xl bg-rose-500 text-white font-bold text-[15px] active:scale-[0.98] transition-all shadow-md shadow-rose-500/20"
                >
                  确认退出
                </button>
              </div>
            </motion.div>
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
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-xl z-50 flex items-center space-x-2"
          >
            <Info size={16} className="text-lavender-300" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MenuItem({ icon, title, subtitle, onClick }: { icon: React.ReactNode, title: string, subtitle?: string, onClick?: () => void }) {
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer"
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-[15px] font-bold text-slate-800">{title}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-300" />
    </motion.div>
  );
}
