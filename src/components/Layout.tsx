import React from 'react';
import { Home, Briefcase, User } from '@/src/lib/icons';
import { cn } from '@/src/lib/utils';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

interface LayoutProps {
  userRole: 'creator' | 'user';
}

export function Layout({ userRole }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const activeTab = location.pathname.startsWith('/workbench') ? 'workbench' :
                    location.pathname.startsWith('/mine') ? 'mine' : 'home';

  return (
    <div className="flex flex-col min-h-[100dvh] max-w-md mx-auto bg-transparent relative">
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 z-50">
        <div className="glass-dark rounded-3xl flex items-center justify-around p-2 shadow-lg border border-white/20 backdrop-blur-xl bg-white/70">
          {userRole === 'creator' && (
            <NavItem 
              icon={<Briefcase size={22} />} 
              label="工作台" 
              isActive={activeTab === 'workbench'} 
              onClick={() => navigate('/workbench')} 
            />
          )}
          <NavItem 
            icon={<Home size={22} />} 
            label="首页" 
            isActive={activeTab === 'home'} 
            onClick={() => navigate('/home')} 
          />
          <NavItem 
            icon={<User size={22} />} 
            label="我的" 
            isActive={activeTab === 'mine'} 
            onClick={() => navigate('/mine')} 
          />
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-colors duration-300",
        isActive ? "text-lavender-600" : "text-slate-400 hover:text-slate-600"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute inset-0 bg-lavender-100/60 rounded-2xl -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <motion.div 
        animate={{ y: isActive ? -2 : 0, scale: isActive ? 1.1 : 1 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
        className="mb-1"
      >
        {icon}
      </motion.div>
      <span className={cn("text-[10px] font-bold transition-opacity duration-300", isActive ? "opacity-100" : "opacity-70")}>
        {label}
      </span>
    </button>
  );
}
