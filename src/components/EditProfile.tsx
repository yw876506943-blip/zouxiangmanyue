import React, { useRef } from 'react';
import { Camera } from 'lucide-react';
import { motion } from 'framer-motion';

export function EditProfile({ profile, setProfile, userRole }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, avatar: imageUrl });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-5">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center justify-center pt-2 mb-6">
        <div className="relative cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
          <img src={profile.avatar} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-black/30 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={20} className="text-white mb-1" />
            <span className="text-white text-[10px] font-medium">更换头像</span>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleAvatarChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">名称</label>
          <input 
            type="text" 
            value={profile.name}
            onChange={(e) => setProfile({...profile, name: e.target.value})}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500/50"
          />
        </div>
        
        {userRole === 'creator' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">性别</label>
                <select 
                  value={profile.gender}
                  onChange={(e) => setProfile({...profile, gender: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500/50"
                >
                  <option value="female">女</option>
                  <option value="male">男</option>
                  <option value="other">不展示</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">工作经验</label>
                <input 
                  type="text" 
                  value={profile.experience || ''}
                  onChange={(e) => setProfile({...profile, experience: e.target.value})}
                  placeholder="如：5年经验"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500/50"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">地址</label>
                <input 
                  type="text" 
                  value={profile.location}
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500/50"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">电话号码</label>
                <input 
                  type="text" 
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500/50"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">微信号</label>
              <input 
                type="text" 
                value={profile.wechat || ''}
                onChange={(e) => setProfile({...profile, wechat: e.target.value})}
                placeholder="输入微信号"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500/50"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">标签 (用逗号分隔)</label>
              <input 
                type="text" 
                value={profile.tags.join(', ')}
                onChange={(e) => setProfile({...profile, tags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean)})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500/50"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">简介</label>
              <textarea 
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500/50 resize-none"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
