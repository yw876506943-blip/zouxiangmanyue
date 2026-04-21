import React, { useState, useRef } from 'react';
import { ChevronLeft, X, Plus, Clock } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function MineFeedback({ showToast }: any) {
  const [feedbackType, setFeedbackType] = useState<'problem' | 'suggestion'>('problem');
  const [content, setContent] = useState('');
  const [contactType, setContactType] = useState<'wechat' | 'qq'>('wechat');
  const [contact, setContact] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const onBack = () => navigate('/mine');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file: File) => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const handleSubmit = () => {
    if (content.length < 5) {
      if(showToast) showToast('请填写至少5个字的反馈内容');
      return;
    }
    if(showToast) showToast('反馈提交成功，感谢您的建议！');
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
