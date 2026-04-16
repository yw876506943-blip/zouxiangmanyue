import React, { useState, useRef, useEffect } from 'react';
import { Settings, DollarSign, MessageSquare, Info, ChevronRight, Edit3, Camera, ChevronLeft, LayoutTemplate, X, Check, Plus, Clock, Lock, Briefcase, User, Phone, Headphones } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { EditProfile } from '@/src/components/EditProfile';

export function Mine({ profile, setProfile, userRole, onBecomeCreator, onLogout }: any) {
  const [activePage, setActivePage] = useState<'main' | 'edit_profile' | 'feedback'>('main');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAuthPhoneModal, setShowAuthPhoneModal] = useState(false);
  const [showChangePhoneModal, setShowChangePhoneModal] = useState(false);
  
  const [newPhone, setNewPhone] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [countdown, setCountdown] = useState(0);

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
    { icon: <User size={20} className="text-blue-500" />, title: '个人资料', onClick: () => setActivePage('edit_profile') },
    { icon: <Headphones size={20} className="text-rose-500" />, title: '联系客服', onClick: () => { navigator.clipboard.writeText('zxmymini'); showToast('客服微信号已复制：zxmymini'); } },
    { icon: <MessageSquare size={20} className="text-orange-500" />, title: '建议与反馈', onClick: () => setActivePage('feedback') },
    { icon: <Info size={20} className="text-teal-500" />, title: '关于我们', subtitle: 'v1.0.0', onClick: () => showToast('当前已是最新版本 v1.0.0') },
    { icon: <Briefcase size={20} className="text-lavender-500" />, title: '成为创作者', onClick: () => setShowAuthPhoneModal(true) },
  ] : [
    { icon: <Phone size={20} className="text-slate-500" />, title: '修改手机号', subtitle: profile.phone || '未绑定', onClick: () => setShowChangePhoneModal(true) },
    { icon: <Headphones size={20} className="text-rose-500" />, title: '联系客服', onClick: () => { navigator.clipboard.writeText('zxmymini'); showToast('客服微信号已复制：zxmymini'); } },
    { icon: <MessageSquare size={20} className="text-blue-500" />, title: '建议与反馈', onClick: () => setActivePage('feedback') },
    { icon: <Info size={20} className="text-misty-500" />, title: '关于我们', subtitle: 'v1.0.0', onClick: () => showToast('当前已是最新版本 v1.0.0') },
  ];

  return (
    <AnimatePresence mode="wait">
      {activePage === 'main' && (
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
                  onClick={() => setActivePage('edit_profile')}
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
                {menuItems.map((item, index) => (
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

              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full py-4 mt-4 rounded-2xl bg-white text-rose-500 font-bold text-[15px] hover:bg-rose-50 active:scale-[0.98] transition-all shadow-sm border border-rose-100"
              >
                退出登录
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}

      {activePage === 'edit_profile' && (
        <EditProfilePage 
          key="edit_profile"
          profile={profile} 
          setProfile={setProfile} 
          userRole={userRole}
          onBack={() => setActivePage('main')} 
          showToast={showToast}
        />
      )}

      {activePage === 'feedback' && (
        <FeedbackPage 
          key="feedback"
          onBack={() => setActivePage('main')} 
          showToast={showToast}
        />
      )}

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
    </AnimatePresence>
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

function EditProfilePage({ profile, setProfile, userRole, onBack, showToast }: any) {
  const [formData, setFormData] = useState(profile);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed inset-0 z-50 bg-[#f8fafc] overflow-y-auto pb-24"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold text-slate-800">编辑资料</h2>
        <button 
          onClick={() => { 
            setProfile(formData); 
            onBack(); 
            showToast('资料已保存');
          }}
          className="text-[15px] font-bold text-lavender-600 px-2 active:scale-95 transition-transform"
        >
          保存
        </button>
      </div>

      <div className="p-4">
        <EditProfile profile={formData} setProfile={setFormData} userRole={userRole} />
      </div>
    </motion.div>
  );
}

function FeedbackPage({ onBack, showToast }: any) {
  const [feedbackType, setFeedbackType] = useState<'problem' | 'suggestion'>('problem');
  const [content, setContent] = useState('');
  const [contactType, setContactType] = useState<'wechat' | 'qq'>('wechat');
  const [contact, setContact] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file: File) => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const handleSubmit = () => {
    if (content.length < 5) {
      showToast('请填写至少5个字的反馈内容');
      return;
    }
    showToast('反馈提交成功，感谢您的建议！');
    onBack();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed inset-0 z-50 bg-[#f4f5f7] overflow-y-auto pb-24 flex flex-col"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-800">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-[17px] font-bold text-slate-800">功能建议与反馈</h2>
        <div className="w-8" />
      </div>

      <div className="px-4 py-4">
        <p className="text-[13px] text-slate-500 leading-relaxed">
          感谢您的宝贵功能建议/问题反馈，有效建议/反馈可获得积分奖励，并进入我们的共建榜单！
        </p>
      </div>

      <div className="flex-1 px-4 space-y-4">
        {/* Feedback Content Section */}
        <div className="bg-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
          {/* Gradient Background Decoration for Title */}
          <div className="absolute top-0 left-0 w-32 h-12 bg-gradient-to-r from-blue-100 via-yellow-100 to-transparent opacity-80 rounded-br-3xl" />
          
          <div className="relative z-10">
            <h3 className="text-[16px] font-bold text-slate-800 mb-5 flex items-center">
              反馈内容 <span className="ml-1 text-lg">✨</span>
            </h3>

            {/* Type Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button 
                onClick={() => setFeedbackType('problem')}
                className={cn(
                  "py-3 rounded-xl border flex items-center justify-center space-x-2 transition-all",
                  feedbackType === 'problem' ? "border-rose-400 bg-white text-rose-500" : "border-slate-100 bg-slate-50 text-slate-600"
                )}
              >
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold", feedbackType === 'problem' ? "bg-rose-100 text-rose-500" : "bg-slate-200 text-white")}>?</div>
                <span className="text-[15px]">问题反馈</span>
              </button>
              <button 
                onClick={() => setFeedbackType('suggestion')}
                className={cn(
                  "py-3 rounded-xl border flex items-center justify-center space-x-2 transition-all",
                  feedbackType === 'suggestion' ? "border-rose-400 bg-white text-rose-500" : "border-slate-100 bg-slate-50 text-slate-600"
                )}
              >
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold", feedbackType === 'suggestion' ? "bg-rose-100 text-rose-500" : "bg-slate-200 text-white")}>=</div>
                <span className="text-[15px]">功能建议</span>
              </button>
            </div>

            {/* Textarea */}
            <div className="relative mb-6">
              <textarea 
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="请填写5个字以上的功能建议或问题描述，以便我们为您提供更好的服务。"
                className="w-full h-24 bg-transparent border-none focus:ring-0 resize-none text-[14px] text-slate-800 placeholder:text-slate-400 p-0"
                maxLength={200}
              />
              <div className="absolute bottom-0 right-0 text-xs text-slate-400">
                {content.length}/200
              </div>
            </div>

            {/* Image Upload */}
            <div className="flex flex-wrap gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-100">
                  <img src={img} alt="upload" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center text-white"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {images.length < 4 && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-slate-600 active:bg-slate-100 transition-colors"
                >
                  <Plus size={24} className="mb-1" />
                  <span className="text-[11px]">上传图片</span>
                </button>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                multiple
                className="hidden" 
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-[15px] font-bold text-slate-800 mb-3">联系方式(选填)</h3>
          <div className="flex items-center space-x-3">
            <select 
              value={contactType}
              onChange={e => setContactType(e.target.value as 'wechat' | 'qq')}
              className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-400/50"
            >
              <option value="wechat">微信</option>
              <option value="qq">QQ</option>
            </select>
            <input 
              type="text" 
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder={`输入${contactType === 'wechat' ? '微信号' : 'QQ号'}，方便与您联系`}
              className="flex-1 py-2 px-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/50 text-[14px] text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-3 flex items-center space-x-4 z-10 pb-8">
        <button className="flex flex-col items-center justify-center text-slate-800 px-4">
          <Clock size={22} className="mb-1" />
          <span className="text-[11px] font-medium">我的反馈</span>
        </button>
        <button 
          onClick={handleSubmit}
          className="flex-1 py-3.5 bg-[#ff2b54] text-white font-bold rounded-full text-[16px] active:scale-[0.98] transition-transform shadow-md shadow-rose-500/20 mr-2"
        >
          提交反馈
        </button>
      </div>
    </motion.div>
  );
}
