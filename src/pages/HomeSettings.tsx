import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { ChevronLeft, ChevronRight, User, Settings as SettingsIcon, FolderHeart, Layers, Plus, Trash2, GripVertical, ImagePlus } from '@/src/lib/icons';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/Button';
import { MineEditProfile } from './MineEditProfile';

export function HomeSettings({ 
  profile, setProfile, 
  homeSettings, setHomeSettings, 
  collections, setCollections, 
  portfolio, setPortfolio, 
  categories, setCategories,
  ALL_SYSTEM_PORTFOLIO,
  showToast,
  userRole
}: any) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSortingCollections, setIsSortingCollections] = useState(false);
  const [isSortingPortfolio, setIsSortingPortfolio] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const getPageTitle = (pathname: string) => {
    if (pathname.includes('/profile')) return '个人资料';
    if (pathname.includes('/display')) return '展示设置';
    if (pathname.includes('/collections/') && !pathname.endsWith('/collections')) return '编辑合集';
    if (pathname.includes('/collections')) return '精选合集设置';
    if (pathname.includes('/portfolio/') && !pathname.endsWith('/portfolio')) return '编辑作品';
    if (pathname.includes('/portfolio')) return '作品设置';
    return '主页设置';
  };

  const isMain = location.pathname === '/home/settings' || location.pathname === '/home/settings/';

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-0 z-50 bg-[#f8fafc] flex flex-col"
      >
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md px-4 pt-12 pb-3 flex items-center justify-between shrink-0 border-b border-slate-100">
          <button 
            onClick={handleBack} 
            className="p-2 -ml-2 text-slate-600 active:scale-95 transition-transform"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-bold text-slate-800">
            {getPageTitle(location.pathname)}
          </h2>
          <div className="w-8" /> {/* Spacer */}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-32">
          <Routes>
            <Route path="/" element={
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                <button onClick={() => navigate('profile')} className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-100 active:scale-[0.98] transition-transform">
                  <div className="flex items-center"><User size={20} className="mr-3 text-lavender-500" /> <span className="font-bold text-slate-800">个人资料</span></div>
                  <ChevronRight size={20} className="text-slate-400" />
                </button>
                <button onClick={() => navigate('display')} className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-100 active:scale-[0.98] transition-transform">
                  <div className="flex items-center"><SettingsIcon size={20} className="mr-3 text-lavender-500" /> <span className="font-bold text-slate-800">展示设置</span></div>
                  <ChevronRight size={20} className="text-slate-400" />
                </button>
                <button onClick={() => navigate('collections')} className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-100 active:scale-[0.98] transition-transform">
                  <div className="flex items-center"><FolderHeart size={20} className="mr-3 text-lavender-500" /> <span className="font-bold text-slate-800">精选合集设置</span></div>
                  <ChevronRight size={20} className="text-slate-400" />
                </button>
                <button onClick={() => navigate('portfolio')} className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-100 active:scale-[0.98] transition-transform">
                  <div className="flex items-center"><Layers size={20} className="mr-3 text-lavender-500" /> <span className="font-bold text-slate-800">作品设置</span></div>
                  <ChevronRight size={20} className="text-slate-400" />
                </button>
              </motion.div>
            } />

            <Route path="profile" element={
              <MineEditProfile profile={profile} setProfile={setProfile} showToast={showToast} userRole={userRole} />
            } />

            <Route path="display" element={
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">显示联系按钮</span>
                    <button 
                      onClick={() => setHomeSettings({...homeSettings, showContact: !homeSettings.showContact})}
                      className={cn("w-12 h-6 rounded-full transition-colors relative", homeSettings.showContact ? "bg-emerald-400" : "bg-slate-200")}
                    >
                      <motion.div animate={{ x: homeSettings.showContact ? 24 : 2 }} className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">显示微信按钮</span>
                    <button 
                      onClick={() => setHomeSettings({...homeSettings, showWechat: !homeSettings.showWechat})}
                      className={cn("w-12 h-6 rounded-full transition-colors relative", homeSettings.showWechat ? "bg-emerald-400" : "bg-slate-200")}
                    >
                      <motion.div animate={{ x: homeSettings.showWechat ? 24 : 2 }} className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">显示精选合集</span>
                    <button 
                      onClick={() => setHomeSettings({...homeSettings, showCollections: !homeSettings.showCollections})}
                      className={cn("w-12 h-6 rounded-full transition-colors relative", homeSettings.showCollections ? "bg-emerald-400" : "bg-slate-200")}
                    >
                      <motion.div animate={{ x: homeSettings.showCollections ? 24 : 2 }} className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">显示地址</span>
                    <button 
                      onClick={() => setHomeSettings({...homeSettings, showLocation: !homeSettings.showLocation})}
                      className={cn("w-12 h-6 rounded-full transition-colors relative", homeSettings.showLocation ? "bg-emerald-400" : "bg-slate-200")}
                    >
                      <motion.div animate={{ x: homeSettings.showLocation ? 24 : 2 }} className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm" />
                    </button>
                  </div>
                </div>
              </motion.div>
            } />

            <Route path="collections" element={<CollectionsSettings collections={collections} setCollections={setCollections} />} />
            <Route path="collections/:id" element={<CollectionDetailSettings collections={collections} setCollections={setCollections} portfolio={portfolio} ALL_SYSTEM_PORTFOLIO={ALL_SYSTEM_PORTFOLIO}/>} />
            <Route path="portfolio" element={<PortfolioSettings portfolio={portfolio} setPortfolio={setPortfolio} collections={collections} />} />
            <Route path="portfolio/:id" element={<WorkDetailSettings portfolio={portfolio} setPortfolio={setPortfolio} categories={categories} setCategories={setCategories} />} />

          </Routes>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function CollectionsSettings({ collections, setCollections }: any) {
  const [isSorting, setIsSorting] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">拖拽可调整前端展示顺序</span>
        <button onClick={() => setIsSorting(!isSorting)} className="text-sm text-lavender-600 font-bold">{isSorting ? '完成排序' : '排序'}</button>
      </div>
      {isSorting ? (
        <Reorder.Group axis="y" values={collections} onReorder={setCollections} className="space-y-3">
          {collections.map((c: any) => (
            <Reorder.Item key={c.id} value={c} className="bg-white rounded-2xl p-3 flexItems-center border shadow-sm flex space-x-3">
              <GripVertical className="text-slate-300" />
              <img src={c.images[0]} className="w-12 h-12 rounded-lg object-cover" />
              <div><p className="font-bold text-sm text-slate-800">{c.title}</p><p className="text-xs text-slate-400">{c.count} 个作品</p></div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        <div className="space-y-3">
          {collections.map((c: any) => (
            <div key={c.id} onClick={() => navigate(c.id.toString())} className="bg-white rounded-2xl p-3 flex items-center justify-between shadow-sm border border-slate-100 cursor-pointer active:scale-[0.98]">
              <div className="flex items-center space-x-3">
                <img src={c.images[0]} className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <p className="font-bold text-sm text-slate-800 flex items-center">{c.title} {!c.isPrivate ? <span className="ml-2 text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">公开</span> : <span className="ml-2 text-[10px] bg-amber-50 text-amber-500 px-1.5 py-0.5 rounded">私密</span>}</p>
                  <p className="text-xs text-slate-400">{c.count} 个作品</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </div>
          ))}
          <Button variant="outline" className="w-full border-dashed" onClick={() => {
            const newColl = { id: Date.now(), title: '新合集', description: '', count: 0, images: ['https://picsum.photos/seed/new/400/600'], works: [], isPrivate: false, singleColumn: false };
            setCollections([...collections, newColl]);
            navigate(newColl.id.toString());
          }}>
            <Plus size={16} className="mr-2" /> 新建合集
          </Button>
        </div>
      )}
    </motion.div>
  );
}

function CollectionDetailSettings({ collections, setCollections, portfolio, ALL_SYSTEM_PORTFOLIO }: any) {
  const { id } = useParams();
  const cId = Number(id);
  const collection = collections.find((c: any) => c.id === cId);
  const navigate = useNavigate();

  if (!collection) return null;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-500 mb-1.5 block">合集封面</label>
          <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden relative">
            <img src={collection.images[0]} className="w-full h-full object-cover" />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 mb-1.5 block">合集名称</label>
          <input type="text" value={collection.title} onChange={(e) => setCollections(collections.map((c: any) => c.id === collection.id ? {...c, title: e.target.value} : c))} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-lavender-500 outline-none" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 mb-1.5 block">合集描述</label>
          <textarea value={collection.description} onChange={(e) => setCollections(collections.map((c: any) => c.id === collection.id ? {...c, description: e.target.value} : c))} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-lavender-500 outline-none h-24 resize-none" placeholder="描述一下这个合集..." />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <span className="text-sm font-medium text-slate-700">设为私密空间</span>
          <button onClick={() => setCollections(collections.map((c: any) => c.id === collection.id ? {...c, isPrivate: !c.isPrivate} : c))} className={cn("w-12 h-6 rounded-full transition-colors relative", collection.isPrivate ? "bg-emerald-400" : "bg-slate-200")}>
            <motion.div animate={{ x: collection.isPrivate ? 24 : 2 }} className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm" />
          </button>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <span className="text-sm font-medium text-slate-700">单列大图排版</span>
          <button onClick={() => setCollections(collections.map((c: any) => c.id === collection.id ? {...c, singleColumn: !c.singleColumn} : c))} className={cn("w-12 h-6 rounded-full transition-colors relative", collection.singleColumn ? "bg-emerald-400" : "bg-slate-200")}>
            <motion.div animate={{ x: collection.singleColumn ? 24 : 2 }} className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm" />
          </button>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-bold text-slate-800">包含作品 ({collection.works?.length || 0})</h3>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-lavender-600">添加作品</Button>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {collection.works?.map((workId: number) => {
            const work = ALL_SYSTEM_PORTFOLIO?.find((w: any) => w.id === workId) || portfolio.find((w: any) => w.id === workId);
            if (!work) return null;
            return (
              <div key={work.id} className="relative rounded-xl overflow-hidden aspect-[3/4] group cursor-pointer" onClick={() => navigate(`/home/settings/portfolio/${work.id}`)}>
                <img src={work.images[0]} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-bold">编辑作品</span>
                </div>
              </div>
            );
          })}
          <div className="rounded-xl border-2 border-dashed border-slate-200 aspect-[3/4] flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-colors">
            <Plus size={24} className="mb-2" />
            <span className="text-xs font-medium">选择作品</span>
          </div>
        </div>
        <Button variant="destructive" className="w-full" onClick={() => {
           setCollections(collections.filter((c: any) => c.id !== collection.id));
           navigate(-1);
        }}>
          <Trash2 size={16} className="mr-2" /> 删除精选合集
        </Button>
      </div>
    </motion.div>
  );
}

function PortfolioSettings({ portfolio, setPortfolio }: any) {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {portfolio.map((work: any) => (
          <div key={work.id} className="relative rounded-2xl overflow-hidden aspect-[3/4] group cursor-pointer" onClick={() => navigate(work.id.toString())}>
            <img src={work.images[0]} className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white">
              {work.category}
            </div>
          </div>
        ))}
        <div className="rounded-2xl border-2 border-dashed border-slate-200 aspect-[3/4] flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-colors bg-white shadow-sm" onClick={() => {
          const newWork = { id: Date.now(), title: '新作品', images: ['https://picsum.photos/seed/new/400/600'], category: '全部', likes: 0, height: 'h-64' };
          setPortfolio([newWork, ...portfolio]);
          navigate(newWork.id.toString());
        }}>
          <Plus size={28} className="mb-2 text-lavender-400" />
          <span className="text-sm font-bold text-slate-600">发布新作品</span>
        </div>
      </div>
    </motion.div>
  );
}

function WorkDetailSettings({ portfolio, setPortfolio, categories, setCategories }: any) {
  const { id } = useParams();
  const workId = Number(id);
  const work = portfolio.find((w: any) => w.id === workId);
  const navigate = useNavigate();

  if (!work) return null;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-500 mb-1.5 block">作品图片 ({work.images.length})</label>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {work.images.map((img: string, idx: number) => (
              <div key={idx} className="w-20 h-20 rounded-xl flex-shrink-0 relative overflow-hidden bg-slate-50 border border-slate-100">
                <img src={img} className="w-full h-full object-cover" />
                {idx === 0 && <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] text-center py-0.5">封面</div>}
              </div>
            ))}
            <div className="w-20 h-20 rounded-xl flex-shrink-0 bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-slate-400 cursor-pointer">
              <ImagePlus size={20} />
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 mb-1.5 block">作品内容</label>
          <textarea value={work.title} onChange={(e) => setPortfolio(portfolio.map((w: any) => w.id === work.id ? {...w, title: e.target.value} : w))} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-lavender-500 outline-none h-24 resize-none" placeholder="描述一下这个作品..." />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 mb-1.5 block">分类</label>
          <div className="flex flex-wrap gap-2">
            {['全部', ...categories].filter(c => c !== '全部').map((cat: string) => (
              <div key={cat} onClick={() => setPortfolio(portfolio.map((w: any) => w.id === work.id ? {...w, category: cat} : w))} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors border", work.category === cat ? "bg-lavender-50 border-lavender-200 text-lavender-600" : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50")}>
                {cat}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Button variant="destructive" className="w-full" onClick={() => {
         setPortfolio(portfolio.filter((w: any) => w.id !== work.id));
         navigate(-1);
      }}>
        <Trash2 size={16} className="mr-2" /> 删除作品
      </Button>
    </motion.div>
  );
}
