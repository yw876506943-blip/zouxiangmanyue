import React, { useRef } from 'react';
import { Camera } from '@/src/lib/icons';
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
        
        {userRole === 'creator' && (() => {
          const REGIONS: Record<string, string[]> = {
            '北京': ['北京市'],
            '上海': ['上海市'],
            '天津': ['天津市'],
            '重庆': ['重庆市'],
            '广东': ['广州市', '深圳市', '珠海市', '东莞市', '佛山市'],
            '浙江': ['杭州市', '宁波市', '温州市', '嘉兴市', '金华市'],
            '江苏': ['南京市', '无锡市', '徐州市', '常州市', '苏州市'],
            '四川': ['成都市', '绵阳市', '自贡市', '宜宾市'],
            '湖南': ['长沙市', '株洲市', '湘潭市'],
            '山东': ['济南市', '青岛市', '烟台市', '潍坊市'],
            '河南': ['郑州市', '洛阳市', '开封市'],
            '福建': ['福州市', '厦门市', '泉州市'],
            '安徽': ['合肥市', '芜湖市', '蚌埠市'],
            '湖北': ['武汉市', '黄石市', '宜昌市', '襄阳市'],
            '陕西': ['西安市', '宝鸡市', '咸阳市'],
          };
          const locationParts = (profile.location || '北京 北京市').split(' ');
          const province = REGIONS[locationParts[0]] ? locationParts[0] : '北京';
          const city = (REGIONS[province] && REGIONS[province].includes(locationParts[1])) ? locationParts[1] : REGIONS[province][0];

          return (
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
            
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">所在地区</label>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={province}
                  onChange={(e) => {
                    const newProv = e.target.value;
                    const newCity = REGIONS[newProv][0];
                    setProfile({...profile, location: `${newProv} ${newCity}`});
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500/50"
                >
                  {Object.keys(REGIONS).map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <select
                  value={city}
                  onChange={(e) => setProfile({...profile, location: `${province} ${e.target.value}`})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500/50"
                >
                  {REGIONS[province].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">电话号码</label>
                <input 
                  type="text" 
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500/50"
                />
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
          );
        })()}
      </div>
    </div>
  );
}
