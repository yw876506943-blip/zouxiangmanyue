import React, { useState } from 'react';
import { ChevronLeft } from '@/src/lib/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { EditProfile } from '@/src/components/EditProfile';
import { useNavigate } from 'react-router-dom';

export function MineEditProfile({ profile, setProfile, userRole, showToast, onLogout }: any) {
  const [formData, setFormData] = useState(profile);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  
  const onBack = () => navigate(-1);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed inset-0 z-50 bg-[#f8fafc] overflow-y-auto pb-24"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 pt-12 pb-3 flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold text-slate-800">编辑资料</h2>
        <button 
          onClick={() => { 
            setProfile(formData); 
            onBack(); 
            if(showToast) showToast('资料已保存');
          }}
          className="text-[15px] font-bold text-lavender-600 px-2 active:scale-95 transition-transform"
        >
          保存
        </button>
      </div>

      <div className="p-4 space-y-6">
        <EditProfile profile={formData} setProfile={setFormData} userRole={userRole} />
        
        <div className="flex justify-center pt-8 pb-4">
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="text-xs text-slate-400 hover:text-rose-500 transition-colors px-4 py-2"
          >
            注销账号
          </button>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-lg font-bold text-slate-800 mb-2 text-center">确认注销账号？</h3>
              <p className="text-sm text-slate-500 text-center mb-6">注销后您的账号信息将被清除，需要重新登录</p>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-50 text-slate-600 font-bold text-sm active:scale-[0.98] transition-transform"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    if(showToast) showToast('账号已注销');
                    setTimeout(() => onLogout(), 1000);
                  }}
                  className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-bold text-sm active:scale-[0.98] transition-transform shadow-md shadow-rose-500/20"
                >
                  确认注销
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
