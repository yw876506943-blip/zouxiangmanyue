import React from 'react';
import { User, Briefcase, Phone, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const CREATOR_TYPES = ['妆娘', '毛娘', '摄影', '后期', '画师', '手作', '道具师', '服装师'];

export function Login({ onLogin }: { onLogin: (role: 'creator' | 'user', type?: string) => void }) {
  return (
    <div className="min-h-[100dvh] bg-[#f8fafc] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-lavender-200/50 to-transparent -z-10" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-lavender-300/20 rounded-full blur-3xl -z-10" />
      <div className="absolute top-32 -left-24 w-48 h-48 bg-emerald-300/20 rounded-full blur-3xl -z-10" />

      {/* Logo & Branding */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-12"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-lavender-400 to-lavender-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-lavender-500/30 mb-5 relative">
          <Sparkles size={40} className="absolute" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">走象漫约</h1>
        <p className="text-sm font-medium text-slate-500 bg-white/60 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white shadow-sm">
          作品一键发光，档期从不慌张。
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-sm space-y-4"
      >
        {/* User Login */}
        <button 
          onClick={() => onLogin('user')} 
          className="w-full bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-4 active:scale-[0.98] transition-transform hover:shadow-md"
        >
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shrink-0">
            <User size={24} />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-bold text-slate-800">我是普通用户</h2>
            <p className="text-xs text-slate-500 mt-0.5">浏览作品、预约服务，免手机号快捷登录</p>
          </div>
        </button>

        {/* Creator Login */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-12 h-12 bg-lavender-50 rounded-full flex items-center justify-center text-lavender-500 shrink-0">
              <Briefcase size={24} />
            </div>
            <div className="text-left">
              <h2 className="text-lg font-bold text-slate-800">我是创作者</h2>
              <p className="text-xs text-slate-500 mt-0.5">接单、展示作品、管理排期</p>
            </div>
          </div>

          <div className="bg-slate-50/50 rounded-2xl p-3 border border-slate-100/50">
            <p className="text-[11px] font-medium text-slate-400 mb-2">支持以下及更多身份入驻：</p>
            <div className="flex flex-wrap gap-1.5">
              {CREATOR_TYPES.map(type => (
                <span
                  key={type}
                  className="px-2 py-1 rounded-lg text-[11px] font-medium bg-white text-slate-600 border border-slate-100 shadow-sm"
                >
                  {type}
                </span>
              ))}
              <span className="px-2 py-1 rounded-lg text-[11px] font-medium bg-transparent text-slate-400 border border-dashed border-slate-200">
                等...
              </span>
            </div>
          </div>

          <button
            onClick={() => onLogin('creator')}
            className="w-full py-3.5 rounded-2xl font-bold text-[14px] flex items-center justify-center space-x-2 transition-all bg-slate-800 text-white shadow-lg shadow-slate-800/20 active:scale-[0.98] hover:bg-slate-700"
          >
            <Phone size={18} />
            <span>授权手机号登录</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
