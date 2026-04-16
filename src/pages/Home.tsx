import React, { useState, useEffect } from 'react';
import { Heart, Phone, Share, MapPin, Star, MessageCircle, ChevronLeft, ChevronRight, X, Settings, Plus, Trash2, GripVertical, Layers, User, FolderHeart, ImagePlus, Camera } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

import { EditProfile } from '@/src/components/EditProfile';
import { ShareModal } from '@/src/components/ShareModal';

const CATEGORIES = ['全部', '二次元妆', 'COS妆', '日常妆', '古风妆', '特效妆'];

const MOCK_PORTFOLIO = [
  { id: 1, height: 'h-64', images: ['https://picsum.photos/seed/p1/400/600', 'https://picsum.photos/seed/p1_2/400/600', 'https://picsum.photos/seed/p1_3/400/600'], title: '雷电将军 COS妆', likes: 128, category: 'COS妆' },
  { id: 2, height: 'h-48', images: ['https://picsum.photos/seed/p2/400/400', 'https://picsum.photos/seed/p2_2/400/400'], title: '日常通勤淡妆', likes: 56, category: '日常妆' },
  { id: 3, height: 'h-56', images: ['https://picsum.photos/seed/p3/400/500', 'https://picsum.photos/seed/p3_2/400/500'], title: '神里绫华 漫展返图', likes: 342, category: '二次元妆' },
  { id: 4, height: 'h-72', images: ['https://picsum.photos/seed/p4/400/700', 'https://picsum.photos/seed/p4_2/400/700', 'https://picsum.photos/seed/p4_3/400/700'], title: '原创古风 狐妖', likes: 89, category: '古风妆' },
  { id: 5, height: 'h-48', images: ['https://picsum.photos/seed/p5/400/400', 'https://picsum.photos/seed/p5_2/400/400'], title: '初音未来 魔法未来', likes: 210, category: '二次元妆' },
  { id: 6, height: 'h-64', images: ['https://picsum.photos/seed/p6/400/600', 'https://picsum.photos/seed/p6_2/400/600'], title: '万圣节 特效妆', likes: 45, category: '特效妆' },
];

const MOCK_COLLECTIONS = [
  { id: 1, title: '原神系列', description: '一次天空之城的宝宝', count: 2, images: ['https://picsum.photos/seed/genshin1/400/600', 'https://picsum.photos/seed/genshin2/400/600', 'https://picsum.photos/seed/genshin3/400/600'], works: [1, 3], isPrivate: false, singleColumn: false },
  { id: 2, title: '日常清透', description: '日常通勤淡妆合集', count: 1, images: ['https://picsum.photos/seed/daily1/400/600', 'https://picsum.photos/seed/daily2/400/600'], works: [2], isPrivate: false, singleColumn: false },
  { id: 3, title: '古风汉服', description: '原创古风妆造', count: 1, images: ['https://picsum.photos/seed/hanfu1/400/600', 'https://picsum.photos/seed/hanfu2/400/600', 'https://picsum.photos/seed/hanfu3/400/600'], works: [4], isPrivate: false, singleColumn: false },
  { id: 4, title: '万圣特辑', description: '万圣节特效妆', count: 1, images: ['https://picsum.photos/seed/halloween1/400/600', 'https://picsum.photos/seed/halloween2/400/600'], works: [6], isPrivate: false, singleColumn: false },
];

const ALL_SYSTEM_COLLECTIONS = [
  ...MOCK_COLLECTIONS,
  { id: 5, title: '赛博朋克', description: '赛博朋克风', count: 0, images: ['https://picsum.photos/seed/cyber1/400/600'], works: [], isPrivate: false, singleColumn: false },
  { id: 6, title: 'Lolita 裙装', description: 'Lolita 裙装搭配', count: 0, images: ['https://picsum.photos/seed/lolita1/400/600'], works: [], isPrivate: false, singleColumn: false },
];

const ALL_SYSTEM_PORTFOLIO = [
  ...MOCK_PORTFOLIO,
  { id: 7, height: 'h-56', images: ['https://picsum.photos/seed/p7/400/500'], title: '赛博朋克 边缘行者', likes: 512, category: 'COS妆' },
  { id: 8, height: 'h-64', images: ['https://picsum.photos/seed/p8/400/600'], title: 'Lolita 甜系', likes: 120, category: '日常妆' },
];

export function Home({ profile, setProfile, homeSettings, setHomeSettings, categories, setCategories, userRole }: any) {
  const displayCategories = ['全部', ...categories];
  const [activeCategory, setActiveCategory] = useState('全部');
  const [activeSettingsCategory, setActiveSettingsCategory] = useState('全部');
  const [isFollowing, setIsFollowing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [collections, setCollections] = useState(MOCK_COLLECTIONS);
  const [showHomeSettings, setShowHomeSettings] = useState(false);
  const [settingsPage, setSettingsPage] = useState<'main' | 'profile' | 'display' | 'collections' | 'portfolio' | 'collection_detail' | 'work_detail'>('main');
  const [selectedCollectionForEdit, setSelectedCollectionForEdit] = useState<any>(null);
  const [selectedWorkForEdit, setSelectedWorkForEdit] = useState<any>(null);
  const [showCollectionActionSheet, setShowCollectionActionSheet] = useState(false);
  const [portfolio, setPortfolio] = useState(MOCK_PORTFOLIO);
  const [isSortingCollections, setIsSortingCollections] = useState(false);
  const [isSortingPortfolio, setIsSortingPortfolio] = useState(false);
  const [showAddCollectionModal, setShowAddCollectionModal] = useState(false);
  const [showAddPortfolioModal, setShowAddPortfolioModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  // Handle scroll for sticky header shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredPortfolio = portfolio.filter(
    item => activeCategory === '全部' || item.category === activeCategory
  );

  if (userRole === 'user') {
    const followedCreators = [
      { 
        id: 1, 
        name: '小樱', 
        avatar: 'https://picsum.photos/seed/1/100/100', 
        bio: '擅长各类二次元COS妆造，可接特化与日常。',
        works: [
          'https://picsum.photos/seed/w1/200/200',
          'https://picsum.photos/seed/w2/200/200',
          'https://picsum.photos/seed/w3/200/200'
        ]
      },
      { 
        id: 2, 
        name: 'Kiko', 
        avatar: 'https://picsum.photos/seed/2/100/100', 
        bio: '常驻广州，主拍漫展场照、正片，擅长情绪光影。',
        works: [
          'https://picsum.photos/seed/w4/200/200',
          'https://picsum.photos/seed/w5/200/200',
          'https://picsum.photos/seed/w6/200/200'
        ]
      },
    ];
    return (
      <div className="p-4 space-y-4 pb-24 min-h-screen bg-[#f8fafc]">
        <h1 className="text-2xl font-bold text-slate-800 pt-2 px-2">我关注的创作者</h1>
        <div className="space-y-4">
          {followedCreators.map(creator => (
            <div key={creator.id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={creator.avatar} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{creator.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{creator.bio}</p>
                  </div>
                </div>
                <button className="px-4 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-full transition-colors shrink-0">
                  进入主页
                </button>
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-hide">
                {creator.works.map((work, idx) => (
                  <img key={idx} src={work} className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-slate-50" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-[#f8fafc] min-h-screen">
      {/* Cover Image */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-lavender-200 to-misty-100 z-0 overflow-hidden">
        {homeSettings.coverStyle === 'image' ? (
          <img 
            src={profile.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-lavender-200 to-misty-200 opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] to-transparent" />
      </div>

      {/* Header Profile */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 pt-20 px-4"
      >
        <div className="absolute top-4 left-4 flex space-x-2">
          <motion.button 
            whileTap={{ scale: 0.9 }} 
            onClick={() => setShowHomeSettings(true)}
            className="w-9 h-9 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center text-slate-700 shadow-sm"
          >
            <Settings size={16} />
          </motion.button>
        </div>
        <div className="absolute top-4 right-4 flex space-x-2 z-20">
          <motion.button 
            whileTap={{ scale: 0.9 }} 
            onClick={() => setShowShareModal(true)}
            className="w-9 h-9 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center text-slate-700 shadow-sm"
          >
            <Share size={16} />
          </motion.button>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <img 
              src={profile.avatar} 
              alt="Avatar" 
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl"
              referrerPolicy="no-referrer"
            />
            {profile.gender !== 'other' && (
              <div className={cn(
                "absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-sm",
                profile.gender === 'female' ? "bg-rose-400" : "bg-blue-400"
              )}>
                <span className="text-[10px] text-white font-bold">
                  {profile.gender === 'female' ? '♀' : '♂'}
                </span>
              </div>
            )}
          </motion.div>
          
          <h1 className="text-xl font-bold text-slate-800 mt-3 tracking-tight">{profile.name}</h1>
          <div className="flex items-center justify-center space-x-2 mt-1.5">
            {homeSettings.showLocation && (
              <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded-md shadow-sm border border-slate-100 flex items-center">
                <MapPin size={12} className="mr-1 text-lavender-500" /> {profile.location}
              </span>
            )}
            {profile.experience && (
              <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded-md shadow-sm border border-slate-100">
                {profile.experience}
              </span>
            )}
          </div>

          {profile.tags && profile.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-3 px-4">
              {profile.tags.map((tag: string, index: number) => (
                <span key={index} className="text-[10px] font-medium text-lavender-600 bg-lavender-50 px-2 py-0.5 rounded-full border border-lavender-100">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <p className="text-sm text-slate-600 mt-4 px-6 leading-relaxed">
            {profile.bio}
          </p>

          {homeSettings.showWechat && profile.wechat && (
            <div 
              className="mt-3 text-xs font-medium text-slate-600 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-slate-100 flex items-center cursor-pointer active:scale-95 transition-transform"
              onClick={() => {
                navigator.clipboard.writeText(profile.wechat);
                showToast('微信号已复制：' + profile.wechat);
              }}
            >
              <MessageCircle size={14} className="mr-1.5 text-emerald-500" /> 微信: {profile.wechat}
            </div>
          )}

          {homeSettings.showContact && (
            <div className="flex items-center space-x-3 mt-6 w-full max-w-xs">
              <Button 
                onClick={() => window.location.href = `tel:${profile.phone}`}
                className="flex-1 rounded-2xl h-12 shadow-lg shadow-lavender-500/20 text-[15px] font-bold"
              >
                <Phone size={18} className="mr-2" />
                联系预约
              </Button>
              <Button 
                variant={isFollowing ? "outline" : "glass"} 
                className={cn("flex-1 rounded-2xl h-12 text-[15px] font-bold transition-all", isFollowing ? "bg-slate-100 text-slate-600 border-transparent" : "bg-white text-rose-500 shadow-sm")}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                <Heart size={18} className={cn("mr-2 transition-transform", isFollowing ? "fill-rose-500 text-rose-500 scale-110" : "")} />
                {isFollowing ? '已关注' : '关注'}
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Featured Collections */}
      <AnimatePresence>
        {homeSettings.showCollections && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8 overflow-hidden"
          >
            <div className="px-4 flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-800">精选合集</h2>
                <button 
                  onClick={() => {
                    setSettingsPage('collections');
                    setShowHomeSettings(true);
                  }}
                  className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors active:scale-95"
                >
                  <Settings size={14} />
                </button>
              </div>
              <span className="text-xs font-medium text-slate-400 flex items-center">查看全部 <ChevronLeft size={14} className="rotate-180 ml-0.5" /></span>
            </div>
            <div className="flex space-x-3 overflow-x-auto thin-scrollbar pb-4 px-4 -mx-4">
              <div className="w-4 shrink-0" /> {/* Spacer */}
              {collections.map((collection, index) => (
                <motion.div 
                  key={collection.id} 
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={() => {
                    setSelectedCollection(collection);
                  }}
                  className="flex-none w-28 relative rounded-2xl overflow-hidden group shadow-sm border border-slate-100/50 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10 transition-opacity group-hover:opacity-90" />
                  <img 
                    src={collection.images[0]} 
                    alt={collection.title} 
                    className="w-full h-32 object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  {collection.images.length > 1 && (
                    <div className="absolute top-2 right-2 z-20 bg-black/30 backdrop-blur-md p-1 rounded-md text-white">
                      <Layers size={10} />
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 right-3 z-20">
                    <p className="text-white text-sm font-bold truncate tracking-wide">{collection.title}</p>
                    <p className="text-white/80 text-[10px] mt-0.5 flex items-center">
                      <Layers size={10} className="mr-1" /> {collection.count} 个作品
                    </p>
                  </div>
                </motion.div>
              ))}
              <div className="w-4 shrink-0" /> {/* Spacer */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portfolio Display */}
      <div className="mt-4">
        {/* Sticky Categories */}
        <div className={cn(
          "sticky top-0 z-30 py-3 transition-all duration-300",
          scrolled ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-100" : "bg-transparent"
        )}>
          <div className="flex space-x-2 overflow-x-auto thin-scrollbar px-4 pb-2">
            {displayCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 shrink-0",
                  activeCategory === cat 
                    ? "bg-slate-800 text-white shadow-md shadow-slate-800/20" 
                    : "bg-white text-slate-500 border border-slate-200/60 hover:bg-slate-50"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Waterfall Layout */}
        <div className="px-4 grid grid-cols-2 gap-3 mt-4">
          <AnimatePresence mode="popLayout">
            {/* Column 1 */}
            <div key="col1" className="space-y-3">
              {filteredPortfolio.filter((_, i) => i % 2 === 0).map((item, index) => (
                <PortfolioCard key={item.id} item={item} index={index} onClick={() => {
                  setSelectedPost(item);
                  setCurrentImageIndex(0);
                }} />
              ))}
            </div>
            {/* Column 2 */}
            <div key="col2" className="space-y-3">
              {filteredPortfolio.filter((_, i) => i % 2 !== 0).map((item, index) => (
                <PortfolioCard key={item.id} item={item} index={index} onClick={() => {
                  setSelectedPost(item);
                  setCurrentImageIndex(0);
                }} />
              ))}
            </div>
          </AnimatePresence>
        </div>
      </div>

      <ShareModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        profile={profile} 
      />

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-slate-800 text-white px-6 py-3 rounded-full shadow-xl font-medium text-sm whitespace-nowrap"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Home Settings Modal */}
      <AnimatePresence>
        {showHomeSettings && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-[#f8fafc] flex flex-col"
          >
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md px-4 py-3 flex items-center justify-between shrink-0 border-b border-slate-100">
              <button 
                onClick={() => {
                  if (settingsPage === 'main') setShowHomeSettings(false);
                  else if (settingsPage === 'collection_detail') setSettingsPage('collections');
                  else if (settingsPage === 'work_detail') {
                    if (selectedCollectionForEdit) setSettingsPage('collection_detail');
                    else setSettingsPage('portfolio');
                  }
                  else setSettingsPage('main');
                }} 
                className="p-2 -ml-2 text-slate-600 active:scale-95 transition-transform"
              >
                <ChevronLeft size={24} />
              </button>
              <h2 className="text-lg font-bold text-slate-800">
                {settingsPage === 'main' && '主页设置'}
                {settingsPage === 'profile' && '个人资料'}
                {settingsPage === 'display' && '展示设置'}
                {settingsPage === 'collections' && '精选合集设置'}
                {settingsPage === 'portfolio' && '作品设置'}
                {settingsPage === 'collection_detail' && selectedCollectionForEdit?.title}
                {settingsPage === 'work_detail' && '作品管理'}
              </h2>
              <div className="w-8" /> {/* Spacer */}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-32">
              <AnimatePresence mode="wait">
                {settingsPage === 'main' && (
                  <motion.div key="main" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                    <button onClick={() => setSettingsPage('profile')} className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-100 active:scale-[0.98] transition-transform">
                      <div className="flex items-center"><User size={20} className="mr-3 text-lavender-500" /> <span className="font-bold text-slate-800">个人资料</span></div>
                      <ChevronRight size={20} className="text-slate-400" />
                    </button>
                    <button onClick={() => setSettingsPage('display')} className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-100 active:scale-[0.98] transition-transform">
                      <div className="flex items-center"><Settings size={20} className="mr-3 text-lavender-500" /> <span className="font-bold text-slate-800">展示设置</span></div>
                      <ChevronRight size={20} className="text-slate-400" />
                    </button>
                    <button onClick={() => setSettingsPage('collections')} className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-100 active:scale-[0.98] transition-transform">
                      <div className="flex items-center"><FolderHeart size={20} className="mr-3 text-lavender-500" /> <span className="font-bold text-slate-800">精选合集设置</span></div>
                      <ChevronRight size={20} className="text-slate-400" />
                    </button>
                    <button onClick={() => setSettingsPage('portfolio')} className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-100 active:scale-[0.98] transition-transform">
                      <div className="flex items-center"><Layers size={20} className="mr-3 text-lavender-500" /> <span className="font-bold text-slate-800">作品设置</span></div>
                      <ChevronRight size={20} className="text-slate-400" />
                    </button>
                  </motion.div>
                )}

                {settingsPage === 'profile' && (
                  <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <EditProfile profile={profile} setProfile={setProfile} />
                  </motion.div>
                )}

                {settingsPage === 'display' && (
                  <motion.div key="display" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">显示联系按钮</span>
                        <button 
                          onClick={() => setHomeSettings({...homeSettings, showContact: !homeSettings.showContact})}
                          className={cn("w-12 h-6 rounded-full transition-colors relative", homeSettings.showContact ? "bg-emerald-400" : "bg-slate-200")}
                        >
                          <motion.div 
                            animate={{ x: homeSettings.showContact ? 24 : 2 }} 
                            className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">显示精选合集</span>
                        <button 
                          onClick={() => setHomeSettings({...homeSettings, showCollections: !homeSettings.showCollections})}
                          className={cn("w-12 h-6 rounded-full transition-colors relative", homeSettings.showCollections ? "bg-emerald-400" : "bg-slate-200")}
                        >
                          <motion.div 
                            animate={{ x: homeSettings.showCollections ? 24 : 2 }} 
                            className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">显示地址</span>
                        <button 
                          onClick={() => setHomeSettings({...homeSettings, showLocation: !homeSettings.showLocation})}
                          className={cn("w-12 h-6 rounded-full transition-colors relative", homeSettings.showLocation ? "bg-emerald-400" : "bg-slate-200")}
                        >
                          <motion.div 
                            animate={{ x: homeSettings.showLocation ? 24 : 2 }} 
                            className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">显示微信</span>
                        <button 
                          onClick={() => setHomeSettings({...homeSettings, showWechat: !homeSettings.showWechat})}
                          className={cn("w-12 h-6 rounded-full transition-colors relative", homeSettings.showWechat ? "bg-emerald-400" : "bg-slate-200")}
                        >
                          <motion.div 
                            animate={{ x: homeSettings.showWechat ? 24 : 2 }} 
                            className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                          />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {settingsPage === 'collections' && (
                  <motion.div key="collections" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[15px] font-bold text-slate-800">所有合集</h3>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setIsSortingCollections(!isSortingCollections)}
                          className={cn("text-xs font-medium px-3 py-1.5 rounded-full transition-colors", isSortingCollections ? "bg-lavender-500 text-white" : "bg-slate-100 text-slate-600")}
                        >
                          {isSortingCollections ? '完成排序' : '排序'}
                        </button>
                        <button 
                          onClick={() => setShowAddCollectionModal(true)}
                          className="bg-lavender-50 text-lavender-600 hover:bg-lavender-100 p-1.5 rounded-full transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <Reorder.Group axis="y" values={collections} onReorder={setCollections} className="space-y-3">
                      {collections.map((collection, index) => (
                        <Reorder.Item 
                          key={collection.id}
                          value={collection}
                          dragListener={isSortingCollections}
                          className="flex items-center space-x-3 bg-slate-50 rounded-xl p-2 border border-slate-100 cursor-pointer active:scale-[0.98] transition-transform"
                          onClick={() => {
                            if (!isSortingCollections) {
                              setSelectedCollectionForEdit(collection);
                              setSettingsPage('collection_detail');
                            }
                          }}
                        >
                          {isSortingCollections && (
                            <div className="cursor-grab active:cursor-grabbing text-slate-300 p-1 shrink-0">
                              <GripVertical size={16} />
                            </div>
                          )}
                          <img src={collection.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-slate-700 truncate">{collection.title}</div>
                            <p className="text-[10px] text-slate-400 mt-0.5">{collection.works?.length || 0} 个作品</p>
                          </div>
                          {!isSortingCollections && (
                            <div className="p-2 text-slate-400 shrink-0">
                              <ChevronRight size={16} />
                            </div>
                          )}
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  </motion.div>
                )}

                {settingsPage === 'collection_detail' && selectedCollectionForEdit && (
                  <motion.div key="collection_detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img src={selectedCollectionForEdit.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <h3 className="text-[15px] font-bold text-slate-800">{selectedCollectionForEdit.title}</h3>
                            <p className="text-xs text-slate-500 mt-0.5">{selectedCollectionForEdit.works?.length || 0} 个作品</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setShowCollectionActionSheet(true)}
                          className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
                        >
                          <Settings size={20} />
                        </button>
                      </div>
                      
                      <div className="pt-2 border-t border-slate-100">
                        <h4 className="text-sm font-bold text-slate-800 mb-3">包含的作品</h4>
                        {selectedCollectionForEdit.works?.length > 0 ? (
                          <div className="space-y-3">
                            {selectedCollectionForEdit.works.map((workId: number) => {
                              const work = ALL_SYSTEM_PORTFOLIO.find(w => w.id === workId);
                              if (!work) return null;
                              return (
                                <div 
                                  key={work.id}
                                  onClick={() => {
                                    setSelectedWorkForEdit(work);
                                    setSettingsPage('work_detail');
                                  }}
                                  className="flex items-center space-x-3 bg-slate-50 rounded-xl p-2 border border-slate-100 cursor-pointer active:scale-[0.98] transition-transform"
                                >
                                  <img src={work.images[0]} alt="" className="w-12 h-16 rounded-lg object-cover shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-700 truncate">{work.title}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{work.images.length} 张照片</p>
                                  </div>
                                  <div className="p-2 text-slate-400 shrink-0">
                                    <ChevronRight size={16} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-slate-400 text-sm">
                            暂无作品，请点击右上角设置添加
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {settingsPage === 'work_detail' && selectedWorkForEdit && (
                  <motion.div key="work_detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-slate-500 mb-1 block">作品标题</label>
                          <input 
                            type="text" 
                            value={selectedWorkForEdit.title}
                            onChange={(e) => setSelectedWorkForEdit({...selectedWorkForEdit, title: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500/50 font-bold text-slate-700"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 mb-1 block">分类</label>
                          <select 
                            value={selectedWorkForEdit.category}
                            onChange={(e) => setSelectedWorkForEdit({...selectedWorkForEdit, category: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-500/50 text-slate-700"
                          >
                            {categories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold text-slate-800">照片管理</h4>
                          <button className="text-xs font-medium text-lavender-600 bg-lavender-50 px-3 py-1.5 rounded-full flex items-center">
                            <Plus size={14} className="mr-1" /> 添加照片
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {selectedWorkForEdit.images.map((img: string, idx: number) => (
                            <div key={idx} className="relative aspect-[3/4] rounded-lg overflow-hidden group">
                              <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              <button className="absolute top-1 right-1 w-6 h-6 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {settingsPage === 'portfolio' && (
                  <motion.div key="portfolio" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">

                    {/* Portfolio Items Settings */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[15px] font-bold text-slate-800 flex items-center">
                          <ImagePlus size={16} className="mr-2 text-lavender-500" /> 作品管理
                        </h3>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setIsSortingPortfolio(!isSortingPortfolio)}
                            className={cn("text-xs font-medium px-3 py-1.5 rounded-full transition-colors", isSortingPortfolio ? "bg-lavender-500 text-white" : "bg-slate-100 text-slate-600")}
                          >
                            {isSortingPortfolio ? '完成排序' : '排序'}
                          </button>
                          <button 
                            onClick={() => setShowAddPortfolioModal(true)}
                            className="bg-lavender-50 text-lavender-600 hover:bg-lavender-100 p-1.5 rounded-full transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Category Tabs */}
                      <div className="flex space-x-2 overflow-x-auto thin-scrollbar pb-2">
                        {displayCategories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => setActiveSettingsCategory(cat)}
                            className={cn(
                              "px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                              activeSettingsCategory === cat 
                                ? "bg-slate-800 text-white" 
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            )}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                      
                      {isSortingPortfolio ? (
                        <Reorder.Group 
                          axis="y" 
                          values={portfolio.filter(item => activeSettingsCategory === '全部' || item.category === activeSettingsCategory)} 
                          onReorder={(newOrder) => {
                            // Only update the order of the filtered items within the main portfolio array
                            const newPortfolio = [...portfolio];
                            let filteredIndex = 0;
                            for (let i = 0; i < newPortfolio.length; i++) {
                              if (activeSettingsCategory === '全部' || newPortfolio[i].category === activeSettingsCategory) {
                                newPortfolio[i] = newOrder[filteredIndex];
                                filteredIndex++;
                              }
                            }
                            setPortfolio(newPortfolio);
                          }} 
                          className="space-y-3"
                        >
                          {portfolio.filter(item => activeSettingsCategory === '全部' || item.category === activeSettingsCategory).map((item, index) => (
                            <Reorder.Item 
                              key={item.id}
                              value={item}
                              className="flex items-center space-x-3 bg-slate-50 rounded-xl p-3 border border-slate-100"
                            >
                              <div className="cursor-grab active:cursor-grabbing text-slate-300 p-1 shrink-0">
                                <GripVertical size={16} />
                              </div>
                              <img src={item.images[0]} alt="" className="w-12 h-16 rounded-lg object-cover shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-700 truncate">{item.title}</p>
                                <p className="text-xs text-slate-400">{item.category}</p>
                              </div>
                              <button 
                                onClick={() => setDeleteConfirmId(item.id)}
                                className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                              >
                                <Trash2 size={16} />
                              </button>
                            </Reorder.Item>
                          ))}
                        </Reorder.Group>
                      ) : (
                        <div className="columns-2 gap-3 space-y-3">
                          {portfolio.filter(item => activeSettingsCategory === '全部' || item.category === activeSettingsCategory).map((item, index) => (
                            <div key={item.id} className="relative group break-inside-avoid mb-3">
                              <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100/60">
                                <div className={cn("w-full relative overflow-hidden", item.height)}>
                                  <img 
                                    src={item.images[0]} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-white font-medium">
                                    {item.category}
                                  </div>
                                </div>
                                <div className="p-2.5 space-y-2">
                                  <input 
                                    type="text" 
                                    value={item.title}
                                    onChange={(e) => {
                                      const newPort = [...portfolio];
                                      const idx = newPort.findIndex(p => p.id === item.id);
                                      if (idx !== -1) {
                                        newPort[idx] = { ...item, title: e.target.value };
                                        setPortfolio(newPort);
                                      }
                                    }}
                                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-[13px] font-bold text-slate-800 p-0 truncate"
                                  />
                                  <select 
                                    value={item.category}
                                    onChange={(e) => {
                                      const newPort = [...portfolio];
                                      const idx = newPort.findIndex(p => p.id === item.id);
                                      if (idx !== -1) {
                                        newPort[idx] = { ...item, category: e.target.value };
                                        setPortfolio(newPort);
                                      }
                                    }}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] text-slate-600 focus:outline-none focus:ring-1 focus:ring-lavender-500"
                                  >
                                    {categories.map((cat: string) => (
                                      <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <button 
                                onClick={() => setDeleteConfirmId(item.id)}
                                className="absolute top-2 left-2 w-7 h-7 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setDeleteConfirmId(null)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm relative z-10 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-rose-100 text-rose-500">
                  <Trash2 size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">确认删除该作品？</h3>
                <p className="text-slate-600 text-sm mb-6">删除后将无法恢复，是否继续？</p>
                <div className="flex space-x-3 w-full">
                  <button 
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => {
                      setPortfolio(portfolio.filter(p => p.id !== deleteConfirmId));
                      setDeleteConfirmId(null);
                      showToast('作品已删除');
                    }}
                    className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/20"
                  >
                    确认删除
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Collection View Modal */}
      <AnimatePresence>
        {selectedCollection && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-[80] bg-slate-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md px-4 py-3 flex items-center justify-between shrink-0 border-b border-slate-100 sticky top-0 z-10">
              <button 
                onClick={() => setSelectedCollection(null)} 
                className="p-2 -ml-2 text-slate-600 active:scale-95 transition-transform"
              >
                <ChevronLeft size={24} />
              </button>
              <h2 className="text-lg font-bold text-slate-800 truncate px-4">
                {selectedCollection.title}
              </h2>
              <div className="w-8" /> {/* Spacer */}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-6">
                <p className="text-sm text-slate-500">{selectedCollection.description}</p>
              </div>
              
              <div className={cn("gap-3 space-y-3", selectedCollection.singleColumn ? "columns-1" : "columns-2")}>
                {selectedCollection.works?.map((workId: number) => {
                  const work = ALL_SYSTEM_PORTFOLIO.find(w => w.id === workId);
                  if (!work) return null;
                  return (
                    <motion.div 
                      key={work.id} 
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedPost(work);
                        setCurrentImageIndex(0);
                      }}
                      className="relative group break-inside-avoid mb-3 cursor-pointer"
                    >
                      <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100/60">
                        <div className={cn("w-full relative overflow-hidden", work.height)}>
                          <img 
                            src={work.images[0]} 
                            alt={work.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-white font-medium flex items-center">
                            <Layers size={10} className="mr-1" /> {work.images.length}
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="text-[13px] font-bold text-slate-800 line-clamp-2 leading-snug">{work.title}</h3>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-1.5">
                              <img src={profile.avatar} className="w-4 h-4 rounded-full object-cover" referrerPolicy="no-referrer" />
                              <span className="text-[10px] text-slate-500 font-medium">{profile.name}</span>
                            </div>
                            <div className="flex items-center text-slate-400">
                              <Heart size={12} className="mr-1" />
                              <span className="text-[10px] font-medium">{work.likes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {(!selectedCollection.works || selectedCollection.works.length === 0) && (
                <div className="text-center py-12 text-slate-400">
                  <FolderHeart size={48} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm">该合集下暂无作品</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center"
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/60 to-transparent">
              <div className="text-white font-medium text-sm">
                {currentImageIndex + 1} / {selectedPost.images.length}
              </div>
              <motion.button 
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md"
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedPost(null)}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Image Slider */}
            <div className="w-full h-full flex items-center justify-center relative px-4">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentImageIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  src={selectedPost.images[currentImageIndex]} 
                  className="max-w-full max-h-[80vh] rounded-xl shadow-2xl object-contain"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>

              {/* Navigation Controls */}
              {currentImageIndex > 0 && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev - 1); }}
                  className="absolute left-4 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white backdrop-blur-md hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
              )}
              {currentImageIndex < selectedPost.images.length - 1 && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev + 1); }}
                  className="absolute right-4 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white backdrop-blur-md hover:bg-black/70 transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white text-lg font-bold">{selectedPost.title}</h3>
              {selectedPost.category && (
                <span className="inline-block mt-2 px-2.5 py-1 bg-white/20 rounded-md text-xs text-white font-medium backdrop-blur-sm">
                  {selectedPost.category}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collection Action Sheet */}
      <AnimatePresence>
        {showCollectionActionSheet && selectedCollectionForEdit && [
            <motion.div 
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowCollectionActionSheet(false)}
            />,
            <motion.div 
              key="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-3xl overflow-hidden shadow-2xl pb-safe"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-4" />
              
              <div className="px-4 pb-6 space-y-6 max-h-[80vh] overflow-y-auto">
                <div className="space-y-1">
                  <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                    <div className="flex items-center text-slate-800 font-medium">
                      <Plus size={20} className="mr-3 text-lavender-600" /> 添加作品
                    </div>
                    <span className="text-xs text-slate-400">已包含{selectedCollectionForEdit.works?.length || 0}个作品</span>
                  </button>
                  <button className="w-full flex items-center p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                    <div className="flex items-center text-slate-800 font-medium">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-400 flex items-center justify-center mr-3">
                        <div className="w-2.5 h-0.5 bg-slate-400 rounded-full" />
                      </div>
                      移除作品
                    </div>
                  </button>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 mb-2 px-2">设置作品合集</h4>
                  <div className="space-y-1">
                    <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                      <div className="flex items-center text-slate-800 font-medium">
                        <Settings size={20} className="mr-3 text-slate-500" /> 合集信息
                      </div>
                      <span className="text-xs text-slate-400">编辑合集名称/描述/封面</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                      <div className="flex items-center text-slate-800 font-medium">
                        <GripVertical size={20} className="mr-3 text-slate-500" /> 作品排序
                      </div>
                      <span className="text-xs text-slate-400">调整作品在合集展示顺序</span>
                    </button>
                    <button 
                      onClick={() => {
                        const newCols = collections.map(c => c.id === selectedCollectionForEdit.id ? { ...c, singleColumn: !c.singleColumn } : c);
                        setCollections(newCols);
                        setSelectedCollectionForEdit({ ...selectedCollectionForEdit, singleColumn: !selectedCollectionForEdit.singleColumn });
                      }}
                      className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors"
                    >
                      <div className="flex items-center text-slate-800 font-medium">
                        <Layers size={20} className="mr-3 text-slate-500" /> 切换为{selectedCollectionForEdit.singleColumn ? '双列' : '单列'}展示
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 mb-2 px-2">可见范围</h4>
                  <div className="space-y-1">
                    <div className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center text-slate-800 font-medium">
                        <User size={20} className="mr-3 text-slate-500" /> 仅单独分享可见
                      </div>
                      <button 
                        onClick={() => {
                          // Toggle logic
                        }}
                        className={cn("w-10 h-5 rounded-full transition-colors relative", false ? "bg-emerald-400" : "bg-slate-200")}
                      >
                        <motion.div 
                          animate={{ x: false ? 20 : 2 }} 
                          className="w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm"
                        />
                      </button>
                    </div>
                    <button 
                      onClick={() => {
                        const newCols = collections.map(c => c.id === selectedCollectionForEdit.id ? { ...c, isPrivate: !c.isPrivate } : c);
                        setCollections(newCols);
                        setSelectedCollectionForEdit({ ...selectedCollectionForEdit, isPrivate: !selectedCollectionForEdit.isPrivate });
                      }}
                      className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors"
                    >
                      <div className="flex items-center text-slate-800 font-medium">
                        <div className="mr-3 text-slate-500">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        </div>
                        设为私密
                      </div>
                      <span className="text-xs text-slate-400">{selectedCollectionForEdit.isPrivate ? '已私密' : '仅自己可见'}</span>
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setCollections(collections.filter(c => c.id !== selectedCollectionForEdit.id));
                    setShowCollectionActionSheet(false);
                    setSettingsPage('collections');
                  }}
                  className="w-full flex items-center justify-between p-4 bg-rose-50 hover:bg-rose-100 rounded-2xl transition-colors"
                >
                  <div className="flex items-center text-rose-500 font-bold">
                    <Trash2 size={20} className="mr-3" /> 删除合集
                  </div>
                  <span className="text-xs text-rose-400">包含的作品不会删除</span>
                </button>
              </div>
            </motion.div>
          ]
        }
      </AnimatePresence>

      {/* Add Collection Modal */}
      <AnimatePresence>
        {showAddCollectionModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowAddCollectionModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">添加精选合集</h3>
                <button onClick={() => setShowAddCollectionModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
                {ALL_SYSTEM_COLLECTIONS.filter(c => !collections.find(ec => ec.id === c.id)).length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-slate-500 text-sm mb-4">系统暂无可添加的合集</p>
                    <Button onClick={() => {
                      setShowAddCollectionModal(false);
                      const newId = Math.max(0, ...ALL_SYSTEM_COLLECTIONS.map(c => c.id)) + 1;
                      const newCol = { id: newId, title: '新创建合集', description: '', count: 0, images: [`https://picsum.photos/seed/${newId}/200/200`], works: [], isPrivate: false, singleColumn: false };
                      ALL_SYSTEM_COLLECTIONS.push(newCol);
                      setCollections([...collections, newCol]);
                    }} className="rounded-full px-6 text-sm">
                      去新建合集
                    </Button>
                  </div>
                ) : (
                  ALL_SYSTEM_COLLECTIONS.filter(c => !collections.find(ec => ec.id === c.id)).map(col => (
                    <div key={col.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center space-x-3">
                        <img src={col.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{col.title}</p>
                          <p className="text-xs text-slate-400">{col.count} 个作品</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setCollections([...collections, col]);
                          setShowAddCollectionModal(false);
                        }}
                        className="w-8 h-8 rounded-full bg-lavender-100 text-lavender-600 flex items-center justify-center hover:bg-lavender-200 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Portfolio Modal */}
      <AnimatePresence>
        {showAddPortfolioModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowAddPortfolioModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">添加作品</h3>
                <button onClick={() => setShowAddPortfolioModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
                {ALL_SYSTEM_PORTFOLIO.filter(p => !portfolio.find(ep => ep.id === p.id)).length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-slate-500 text-sm mb-4">系统暂无可添加的作品</p>
                    <Button onClick={() => {
                      setShowAddPortfolioModal(false);
                      const newId = Math.max(0, ...ALL_SYSTEM_PORTFOLIO.map(p => p.id)) + 1;
                      const newPort = { 
                        id: newId, 
                        height: 'h-64', 
                        images: [`https://picsum.photos/seed/new${newId}/400/600`], 
                        title: '新作品', 
                        likes: 0, 
                        category: categories[0] || '全部' 
                      };
                      ALL_SYSTEM_PORTFOLIO.push(newPort);
                      setPortfolio([newPort, ...portfolio]);
                    }} className="rounded-full px-6 text-sm">
                      去新建作品
                    </Button>
                  </div>
                ) : (
                  ALL_SYSTEM_PORTFOLIO.filter(p => !portfolio.find(ep => ep.id === p.id)).map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center space-x-3">
                        <img src={item.images[0]} alt="" className="w-12 h-16 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-bold text-slate-800 line-clamp-1">{item.title}</p>
                          <p className="text-xs text-slate-400">{item.category}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setPortfolio([item, ...portfolio]);
                          setShowAddPortfolioModal(false);
                        }}
                        className="w-8 h-8 shrink-0 rounded-full bg-lavender-100 text-lavender-600 flex items-center justify-center hover:bg-lavender-200 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PortfolioCard({ item, index, onClick }: { item: any, index: number, onClick: () => void, key?: React.Key }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100/60 group cursor-pointer relative"
    >
      <div className={cn("w-full relative overflow-hidden", item.height)}>
        <img 
          src={item.images[0]} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        {item.images.length > 1 && (
          <div className="absolute top-2 left-2 bg-black/30 backdrop-blur-md p-1.5 rounded-lg text-white">
            <Layers size={12} />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-white font-medium">
          {item.category}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
          <p className="text-[13px] font-bold text-white line-clamp-2 leading-snug">{item.title}</p>
        </div>
      </div>
    </motion.div>
  );
}
