import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { HomeSettings } from './HomeSettings';
import { HomeCollectionDetail } from './HomeCollectionDetail';
import { HomePostDetail } from './HomePostDetail';
import { Heart, Phone, Share, MapPin, Star, MessageCircle, ChevronLeft, ChevronRight, X, Settings, Plus, Trash2, GripVertical, Layers, User, FolderHeart, ImagePlus, Camera, Search } from '@/src/lib/icons';
import { Button } from '@/src/components/ui/Button';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

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

export function Home({ profile, setProfile, homeSettings, setHomeSettings, categories: rawCategories, setCategories, userRole }: any) {
  const navigate = useNavigate();
  const location = useLocation();

  const categories = Array.from(new Set(rawCategories));
  const displayCategories = Array.from(new Set(['全部', ...categories]));
  const [activeCategory, setActiveCategory] = useState('全部');
  const [activeSettingsCategory, setActiveSettingsCategory] = useState('全部');
  const [isFollowing, setIsFollowing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchScrolled, setSearchScrolled] = useState(false);
  
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [collections, setCollections] = useState(MOCK_COLLECTIONS);
  
  
  
  
  const [showCollectionActionSheet, setShowCollectionActionSheet] = useState(false);
  const [portfolio, setPortfolio] = useState(MOCK_PORTFOLIO);
  const [isSortingCollections, setIsSortingCollections] = useState(false);
  const [isSortingPortfolio, setIsSortingPortfolio] = useState(false);
  const [showAddCollectionModal, setShowAddCollectionModal] = useState(false);
  const [showAddPortfolioModal, setShowAddPortfolioModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  
  // New user hasn't followed anyone
  const followedCreators: any[] = [];
  
  const ALL_CREATORS = [
    { id: 1, name: '小樱', avatar: 'https://picsum.photos/seed/1/100/100', bio: '擅长各类二次元COS妆造，可接特化与日常。', works: ['https://picsum.photos/seed/w1/200/200', 'https://picsum.photos/seed/w2/200/200', 'https://picsum.photos/seed/w3/200/200'] },
    { id: 2, name: 'Kiko', avatar: 'https://picsum.photos/seed/2/100/100', bio: '常驻广州，主拍漫展场照、正片，擅长情绪光影。', works: ['https://picsum.photos/seed/w4/200/200', 'https://picsum.photos/seed/w5/200/200', 'https://picsum.photos/seed/w6/200/200'] },
    { id: 3, name: '苍云', avatar: 'https://picsum.photos/seed/avatar/150/150', bio: '技巧化妆师，擅长Lolita、古风、COSPLAY妆面。', works: ['https://picsum.photos/seed/1/300/400', 'https://picsum.photos/seed/2/300/400', 'https://picsum.photos/seed/3/300/400'] }
  ];

  const displayCreators = activeSearch.trim()
    ? ALL_CREATORS.filter(c => c.name.toLowerCase().includes(activeSearch.toLowerCase()))
    : followedCreators;

  const handleSearch = () => {
    setActiveSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setActiveSearch('');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  // Handle scroll for sticky header shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
      setSearchScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredPortfolio = portfolio.filter(
    item => activeCategory === '全部' || item.category === activeCategory
  );

  const userSearchContent = (
    <div className="p-4 space-y-4 pb-24 min-h-screen bg-[#f8fafc]">
      {/* Search Bar Wrapper with Sticky positioning */}
      <div className={cn(
        "sticky top-0 z-50 pt-12 pb-3 -mx-4 px-4 transition-all duration-300",
        searchScrolled ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-100" : "bg-[#f8fafc]"
      )}>
        <div className="flex items-center bg-white rounded-full pl-4 pr-1.5 py-1.5 shadow-sm border border-slate-100 focus-within:border-cyan-200 focus-within:ring-2 focus-within:ring-cyan-50 transition-all">
          <Search size={18} className="text-slate-400 mr-2 shrink-0" />
          <input 
            type="text" 
            placeholder="搜索创作者名称..." 
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="flex-1 bg-transparent py-1 outline-none text-sm text-slate-800 placeholder:text-slate-400"
          />
          {searchInput && (
            <button onClick={handleClearSearch} className="px-2 text-slate-400 hover:text-slate-600 shrink-0">
              <X size={16} />
            </button>
          )}
          <button 
            onClick={handleSearch}
            className="ml-1 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[13px] font-bold rounded-full transition-colors shrink-0 shadow-sm"
          >
            搜索
          </button>
        </div>
      </div>

      <h1 className="text-xl font-bold text-slate-800 px-2 mt-4">
        {activeSearch.trim() ? `搜索结果 (${displayCreators.length})` : '我关注的创作者'}
      </h1>
      
      {displayCreators.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
           {activeSearch.trim() ? (
             <div className="flex flex-col items-center text-center bg-white/60 p-8 rounded-[36px] border-[3px] border-dashed border-slate-200">
               <div className="w-20 h-20 bg-slate-100 rounded-[28px] rotate-3 flex items-center justify-center mb-5 border-[3px] border-slate-300">
                 <Search size={32} className="text-slate-400" />
               </div>
               <p className="text-[16px] font-extrabold text-slate-700 tracking-tight">呜呜，没搜到相关的老师呢</p>
               <p className="text-[13px] text-slate-400 mt-2">( ；′⌒` ) 换个关键词试试看吧？</p>
             </div>
           ) : (
             <div className="flex flex-col items-center text-center relative w-full">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-50/50 rounded-full blur-[40px] -z-10" />
               
               <div className="w-32 h-32 relative mb-6">
                 <div className="absolute inset-0 bg-white rounded-[32px] rotate-6 border-[3px] border-slate-200 shadow-sm transition-transform hover:rotate-12 duration-300" />
                 <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-[32px] -rotate-3 border-[3px] border-cyan-100 flex items-center justify-center shadow-sm">
                   <FolderHeart size={48} className="text-cyan-400" />
                 </div>
                 {/* Sparkles */}
                 <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-100 border-[2px] border-yellow-300 rounded-full flex items-center justify-center text-[10px]">✨</div>
               </div>

               <p className="text-[18px] font-extrabold text-slate-800 tracking-tight mb-2">关注列表空空如也</p>
               <p className="text-[13px] text-slate-500 font-medium max-w-[200px] leading-relaxed">
                 这里是您的专属“打call”阵地<br/>
                 快去发现宝藏创作者吧！ ( •̀ ω •́ )✧
               </p>
               
               <button 
                 onClick={() => {
                   document.querySelector('input')?.focus();
                 }}
                 className="mt-6 px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-400 text-white rounded-full font-bold shadow-[0_4px_12px_rgba(34,211,238,0.3)] hover:scale-105 active:scale-95 transition-all text-sm flex items-center space-x-1.5"
               >
                 <Search size={16} />
                 <span>去搜搜看</span>
               </button>
             </div>
           )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayCreators.map(creator => (
            <div key={creator.id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={creator.avatar} className="w-10 h-10 rounded-full object-cover border border-slate-100" referrerPolicy="no-referrer" />
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{creator.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{creator.bio}</p>
                  </div>
                </div>
                <button onClick={() => navigate(`/home/creator/${creator.id}`)} className="px-4 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-full transition-colors shrink-0">
                  进入主页
                </button>
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-hide">
                {creator.works.map((work: string, idx: number) => (
                  <img key={idx} src={work} className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-slate-50" referrerPolicy="no-referrer" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const creatorHomeContent = (
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
        <div className="absolute top-12 left-4 flex space-x-2 z-20">
          {location.pathname.includes('/creator/') ? (
            <motion.button 
              whileTap={{ scale: 0.9 }} 
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center text-slate-700 shadow-sm"
            >
              <ChevronLeft size={20} className="-ml-0.5" />
            </motion.button>
          ) : (
            <motion.button 
              whileTap={{ scale: 0.9 }} 
              onClick={() => navigate('/home/settings')}
              className="w-9 h-9 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center text-slate-700 shadow-sm"
            >
              <Settings size={16} />
            </motion.button>
          )}
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
                    navigate('/home/settings/collections');
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
                    navigate(`/home/collection/${collection.id}`);
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
                    <div className="text-white text-sm font-bold truncate tracking-wide">{collection.title}</div>
                    <div className="text-white/80 text-[10px] mt-0.5 flex items-center">
                      <Layers size={10} className="mr-1" /> {collection.count} 个作品
                    </div>
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
                  navigate(`/home/post/${item.id}`);
                }} />
              ))}
            </div>
            {/* Column 2 */}
            <div key="col2" className="space-y-3">
              {filteredPortfolio.filter((_, i) => i % 2 !== 0).map((item, index) => (
                <PortfolioCard key={item.id} item={item} index={index} onClick={() => {
                  navigate(`/home/post/${item.id}`);
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
        portfolio={portfolio}
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

      
    </div>
  );

  return (
    <Routes>
      <Route path="/settings/*" element={<HomeSettings profile={profile} setProfile={setProfile} homeSettings={homeSettings} setHomeSettings={setHomeSettings} collections={collections} setCollections={setCollections} portfolio={portfolio} setPortfolio={setPortfolio} categories={categories} setCategories={setCategories} ALL_SYSTEM_PORTFOLIO={ALL_SYSTEM_PORTFOLIO} showToast={showToast} userRole={userRole} />} />
      <Route path="/collection/:id" element={<HomeCollectionDetail collections={collections} allPortfolio={ALL_SYSTEM_PORTFOLIO} profile={profile} />} />
      <Route path="/post/:id" element={<HomePostDetail posts={[...portfolio, ...ALL_SYSTEM_PORTFOLIO]} />} />
      <Route path="/creator/:id" element={creatorHomeContent} />
      <Route path="/" element={userRole === 'user' ? userSearchContent : creatorHomeContent} />
    </Routes>
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
          <div className="text-[13px] font-bold text-white line-clamp-2 leading-snug">{item.title}</div>
        </div>
      </div>
    </motion.div>
  );
}
