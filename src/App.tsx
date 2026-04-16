import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Workbench } from './pages/Workbench';
import { Home } from './pages/Home';
import { Mine } from './pages/Mine';
import { Login } from './pages/Login';

export default function App() {
  const [userRole, setUserRole] = useState<'creator' | 'user' | null>(null);
  const [creatorType, setCreatorType] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'workbench' | 'home' | 'mine'>('home');

  // Shared Profile State
  const [profile, setProfile] = useState({
    name: 'Kiko 妆造工作室',
    id: '8829103',
    avatar: 'https://picsum.photos/seed/avatar/150/150',
    bio: '擅长各类二次元、COS、日常妆造。用心对待每一次创作，接单请提前预约排期。',
    location: '上海市',
    experience: '5年经验',
    gender: 'female', // female, male, other
    phone: '13800138000',
    wechat: 'wxid_kiko123',
    tags: ['二次元', 'COS', '日常妆', '特效妆'],
    coverImage: 'https://picsum.photos/seed/cover/800/400'
  });

  // Shared Home Settings State
  const [homeSettings, setHomeSettings] = useState({
    showContact: true,
    showCollections: true,
    showLocation: true,
    showWechat: true,
    coverStyle: 'gradient' // gradient, image
  });

  // Shared Categories State
  const [categories, setCategories] = useState(['二次元妆', 'COS妆', '日常妆', '古风妆', '特效妆']);

  if (!userRole) {
    return (
      <Login 
        onLogin={(role, type) => {
          setUserRole(role);
          if (type) setCreatorType(type);
          setActiveTab(role === 'creator' ? 'workbench' : 'home');
        }} 
      />
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole}>
      {activeTab === 'workbench' && userRole === 'creator' && <Workbench categories={categories} setCategories={setCategories} profile={profile} />}
      {activeTab === 'home' && <Home profile={profile} setProfile={setProfile} homeSettings={homeSettings} setHomeSettings={setHomeSettings} categories={categories} setCategories={setCategories} userRole={userRole} />}
      {activeTab === 'mine' && <Mine profile={profile} setProfile={setProfile} homeSettings={homeSettings} setHomeSettings={setHomeSettings} userRole={userRole} onBecomeCreator={() => { setUserRole('creator'); setActiveTab('workbench'); }} onLogout={() => setUserRole(null)} />}
    </Layout>
  );
}
