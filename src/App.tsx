import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Workbench } from './pages/Workbench';
import { Home } from './pages/Home';
import { Mine } from './pages/Mine';
import { Login } from './pages/Login';

function AppContent() {
  const [userRole, setUserRole] = useState<'creator' | 'user' | null>(null);
  const [creatorType, setCreatorType] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    if (!userRole && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [userRole, location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/login" element={
        !userRole ? (
          <Login 
            onLogin={(role, type) => {
              setUserRole(role);
              if (type) setCreatorType(type);
              navigate(role === 'creator' ? '/workbench' : '/home', { replace: true });
            }} 
          />
        ) : (
          <Navigate to={userRole === 'creator' ? '/workbench' : '/home'} replace />
        )
      } />
      
      {!userRole ? (
        <Route path="*" element={<Navigate to="/login" replace />} />
      ) : (
        <Route element={<Layout userRole={userRole} />}>
          <Route path="/" element={<Navigate to={userRole === 'creator' ? '/workbench' : '/home'} replace />} />
          {userRole === 'creator' && (
            <Route path="/workbench/*" element={<Workbench categories={categories} setCategories={setCategories} profile={profile} />} />
          )}
          <Route path="/home/*" element={<Home profile={profile} setProfile={setProfile} homeSettings={homeSettings} setHomeSettings={setHomeSettings} categories={categories} setCategories={setCategories} userRole={userRole} />} />
          <Route path="/mine/*" element={<Mine profile={profile} setProfile={setProfile} homeSettings={homeSettings} setHomeSettings={setHomeSettings} userRole={userRole} onBecomeCreator={() => { setUserRole('creator'); navigate('/workbench', { replace: true }); }} onLogout={() => { setUserRole(null); navigate('/login', { replace: true }); }} />} />
          <Route path="*" element={<Navigate to={userRole === 'creator' ? '/workbench' : '/home'} replace />} />
        </Route>
      )}
    </Routes>
  );
}

export default function App() {
  return <AppContent />;
}
