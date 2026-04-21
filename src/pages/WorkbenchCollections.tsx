import React, { useState } from 'react';
import { SubPageLayout } from '@/src/components/SubPageLayout';
import { Search, Plus, FolderHeart, Layers, MoreVertical, AlertCircle, List, ImagePlus, Trash2, X, Check, Eye } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { createPortal } from 'react-dom';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { WorkSelectorModal, ActionSheet } from '@/src/components/WorkbenchShared';

function CollectionEditForm({ initialData, onSave, onCancel }: { initialData?: any, onSave: (data: any) => void, onCancel: () => void }) {
  const [cover, setCover] = useState(initialData?.cover || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [portfolios, setPortfolios] = useState<{id: string, url?: string, image?: string, title?: string}[]>(initialData?.portfolios || []);
  const [isPublic, setIsPublic] = useState(initialData?.visibility !== 'private');
  const [showWorkSelector, setShowWorkSelector] = useState(false);

  // Mock available works from portfolio
  const availableWorks = [
    { id: '1', title: '原神·雷电将军', image: 'https://images.unsplash.com/photo-1542451542907-6cf80ff362d6?auto=format&fit=crop&w=400&q=80' },
    { id: '2', title: '日常通透感伪素颜妆', image: 'https://images.unsplash.com/photo-1512496015851-a1c8e48d1546?auto=format&fit=crop&w=400&q=80' },
    { id: '3', title: '复古港风红唇妆', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=400&q=80' },
    { id: '4', title: '清冷感白开水妆', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80' },
  ];

  const handleAddPortfolio = (selectedWorks: any[]) => {
    setPortfolios([...selectedWorks, ...portfolios]);
    setShowWorkSelector(false);
  };

  const handleDeletePortfolio = (id: string) => {
    setPortfolios(portfolios.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Cover */}
        <div>
          <label className="flex items-center text-[15px] font-bold text-slate-800 mb-3">
            合集封面 <span className="text-rose-500 ml-1">*</span>
          </label>
          <div 
            onClick={() => setCover(`https://picsum.photos/seed/${Date.now()}/400/400`)}
            className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 cursor-pointer overflow-hidden relative"
          >
            {cover ? (
              <img src={cover} alt="cover" className="w-full h-full object-cover" />
            ) : (
              <Plus size={28} />
            )}
          </div>
        </div>

        <div className="h-px bg-slate-100 w-full" />

        {/* Portfolios Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[15px] font-bold text-slate-800">
              合集作品 <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-slate-400">{portfolios.length}/100</span>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
            <Reorder.Group 
              axis="x" 
              values={portfolios} 
              onReorder={setPortfolios} 
              className="flex gap-3"
            >
              {portfolios.map((item) => (
                <Reorder.Item 
                  key={item.id} 
                  value={item} 
                  className="relative w-24 h-32 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing shrink-0 group bg-white"
                >
                  <img src={item.url || item.image} alt="portfolio" className="w-full h-full object-cover pointer-events-none" />
                  <button 
                    onClick={() => handleDeletePortfolio(item.id)}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            <div 
              onClick={() => setShowWorkSelector(true)}
              className="w-24 h-32 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-slate-400 active:bg-slate-100 transition-colors cursor-pointer shrink-0"
            >
              <Plus size={24} strokeWidth={1.5} className="mb-1" />
              <span className="text-[10px]">添加作品</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed mt-2">
            从作品库中选择作品添加到合集中，长按可拖拽排序。
          </p>
        </div>

        <div className="h-px bg-slate-100 w-full" />

        {/* Title */}
        <div>
          <label className="flex items-center text-[15px] font-bold text-slate-800 mb-2">
            合集名称 <span className="text-rose-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input 
              type="text" 
              maxLength={10}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="请输入作品分类合集名称" 
              className="w-full py-3 bg-transparent border-b border-slate-100 focus:border-lavender-400 focus:outline-none text-[15px] text-slate-800 placeholder:text-slate-400 pr-12" 
            />
            <span className="absolute right-0 bottom-3 text-xs text-slate-400">{title.length}/10</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center text-[15px] font-bold text-slate-800 mb-2">
            合集描述
          </label>
          <div className="relative">
            <textarea 
              maxLength={150}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="简单介绍一下你的合集" 
              className="w-full h-24 py-3 bg-transparent border-b border-slate-100 focus:border-lavender-400 focus:outline-none text-[15px] text-slate-800 placeholder:text-slate-400 resize-none" 
            />
            <span className="absolute right-0 bottom-3 text-xs text-slate-400">{description.length}/150</span>
          </div>
        </div>

        <div className="h-px bg-slate-100 w-full" />

        {/* Visibility Toggle */}
        <div className="flex items-center justify-between py-2">
          <label className="text-[15px] font-bold text-slate-800">
            公开可见
          </label>
          <div 
            className={cn("w-10 h-6 rounded-full transition-colors relative cursor-pointer", isPublic ? "bg-rose-500" : "bg-slate-200")}
            onClick={() => setIsPublic(!isPublic)}
          >
            <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200", isPublic ? "left-5" : "left-1")} />
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-4 bg-white border-t border-slate-100">
        <button 
          onClick={() => onSave({ cover, title, description, portfolios, visibility: isPublic ? 'public' : 'private' })}
          disabled={!title || !cover}
          className="w-full py-3.5 bg-rose-500 text-white font-bold rounded-full disabled:opacity-50 disabled:bg-slate-300 active:scale-[0.98] transition-transform"
        >
          完成保存
        </button>
      </div>

      {/* Work Selector Modal */}
      <AnimatePresence>
        {showWorkSelector && (
          <WorkSelectorModal 
            availableWorks={availableWorks.filter(w => !portfolios.find(existing => existing.id === w.id))}
            onClose={() => setShowWorkSelector(false)}
            onSelect={handleAddPortfolio}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CollectionDetailPage({ collection, onBack, onEdit, onUpdate }: { collection: any, onBack: () => void, onEdit: () => void, onUpdate: (data: any) => void }) {
  const [works, setWorks] = useState<{id: string, url: string, title?: string, image?: string}[]>(collection.portfolios || []);
  const [activeWork, setActiveWork] = useState<any>(null);
  const [showWorkSelector, setShowWorkSelector] = useState(false);

  // Mock available works from portfolio
  const availableWorks = [
    { id: '1', title: '原神·雷电将军', image: 'https://images.unsplash.com/photo-1542451542907-6cf80ff362d6?auto=format&fit=crop&w=400&q=80' },
    { id: '2', title: '日常通透感伪素颜妆', image: 'https://images.unsplash.com/photo-1512496015851-a1c8e48d1546?auto=format&fit=crop&w=400&q=80' },
    { id: '3', title: '复古港风红唇妆', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=400&q=80' },
    { id: '4', title: '清冷感白开水妆', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80' },
  ];

  // Sync works to parent when it changes
  React.useEffect(() => {
    onUpdate({ portfolios: works, count: works.length });
  }, [works]);

  const handleAddWork = (selectedWorks: any[]) => {
    setWorks([...selectedWorks, ...works]);
    setShowWorkSelector(false);
  };

  const handleDeleteWork = (id: string) => {
    setWorks(works.filter(w => w.id !== id));
    setActiveWork(null);
  };

  return (
    <SubPageLayout 
      title={collection.title} 
      onBack={onBack}
      noPadding
    >
      <div className="bg-[#f8fafc] min-h-full pb-24">
        {/* Collection Info Card */}
        <div className="p-4">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex space-x-4 relative">
            <img src={collection.cover} alt={collection.title} className="w-24 h-24 rounded-2xl object-cover shrink-0 shadow-sm" />
            <div className="flex-1 min-w-0 py-1">
              <div className="flex items-center space-x-1.5 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                  <Layers size={12} />
                </div>
                <h3 className="font-bold text-slate-800 text-[15px] truncate">{collection.title}</h3>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">{collection.description || '暂无描述'}</p>
              <div className="flex items-center space-x-4 text-[11px] text-slate-400 font-medium">
                <span>包含作品 {works.length}</span>
                <span>浏览 0</span>
              </div>
            </div>
            <button onClick={onEdit} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Works List */}
        <div className="px-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {works.map(work => (
              <div key={work.id} className="relative rounded-2xl overflow-hidden group bg-slate-100 aspect-[3/4]">
                <img src={work.url || work.image} alt={work.title || '作品'} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute top-2 right-2">
                  <button onClick={(e) => { e.stopPropagation(); setActiveWork(work); }} className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform">
                    <MoreVertical size={16} />
                  </button>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-xs font-medium line-clamp-2 leading-tight mb-1">{work.title || '未命名作品'}</div>
                  <div className="text-[10px] text-white/80 flex items-center">
                    <Eye size={10} className="mr-1" /> 0
                  </div>
                </div>
              </div>
            ))}
          </div>
          {works.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">
              - 暂无作品 -
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 p-4 flex space-x-3 z-10 pb-8">
        <button 
          onClick={() => setShowWorkSelector(true)}
          className="w-full py-3.5 bg-slate-800 text-white font-bold rounded-2xl text-[15px] flex items-center justify-center space-x-1 active:scale-[0.98] transition-transform shadow-md shadow-slate-800/20"
        >
          <Plus size={18} />
          <span>添加作品</span>
        </button>
      </div>

      {/* Work Action Sheet */}
      {createPortal(
        <AnimatePresence>
          {activeWork && [
              <motion.div 
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveWork(null)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
              />,
              <motion.div 
                key="sheet"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[100] p-4 pb-8 shadow-2xl"
              >
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
                <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-slate-100">
                  <img src={activeWork.url || activeWork.image} alt="" className="w-12 h-16 rounded-lg object-cover" />
                  <h4 className="font-bold text-slate-800 line-clamp-1">{activeWork.title || '未命名作品'}</h4>
                </div>
                <div className="space-y-2">
                  <button 
                    onClick={() => setActiveWork(null)}
                    className="w-full py-4 px-4 rounded-2xl hover:bg-slate-50 flex items-center space-x-3 active:scale-[0.98] transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                      <ImagePlus size={18} />
                    </div>
                    <span className="font-bold text-[15px] text-slate-800">编辑作品</span>
                  </button>
                  <button 
                    onClick={() => handleDeleteWork(activeWork.id)}
                    className="w-full py-4 px-4 rounded-2xl hover:bg-rose-50 flex items-center space-x-3 active:scale-[0.98] transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
                      <Trash2 size={18} />
                    </div>
                    <span className="font-bold text-[15px] text-rose-500">移除作品</span>
                  </button>
                </div>
              </motion.div>
            ]
          }

          {showWorkSelector && (
            <WorkSelectorModal 
              availableWorks={availableWorks.filter(w => !works.find(existing => existing.id === w.id))}
              onClose={() => setShowWorkSelector(false)}
              onSelect={handleAddWork}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </SubPageLayout>
  );
}

export function CollectionsPage() {
  const navigate = useNavigate();
  const onBack = () => navigate('/workbench');

  const [view, setView] = useState<'list' | 'add' | 'detail' | 'edit'>('list');
  const [items, setItems] = useState([
    { id: '1', title: '2023 漫展精选', cover: 'https://images.unsplash.com/photo-1560457079-9a6532ccb118?auto=format&fit=crop&w=400&q=80', count: 12, visibility: 'public', description: '一次天空之城的宝宝' },
    { id: '2', title: '古风汉服系列', cover: 'https://images.unsplash.com/photo-1544168190-79c15427015f?auto=format&fit=crop&w=400&q=80', count: 8, visibility: 'public', description: '简单介绍一下你的合集' },
  ]);
  const [activeItem, setActiveItem] = useState<any>(null);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [deleteConfirmCol, setDeleteConfirmCol] = useState<string | null>(null);

  const handleUpdate = (id: string, data: any) => {
    setItems(items.map(i => i.id === id ? { ...i, ...data } : i));
    if (selectedCollection?.id === id) {
      setSelectedCollection({ ...selectedCollection, ...data });
    }
    setActiveItem(null);
  };
  
  const handleDelete = () => {
    if (deleteConfirmCol) {
      setItems(items.filter(i => i.id !== deleteConfirmCol));
      setActiveItem(null);
      if (selectedCollection?.id === deleteConfirmCol) {
        setView('list');
        setSelectedCollection(null);
      }
      setDeleteConfirmCol(null);
    }
  };

  const collectionToDelete = items.find(i => i.id === deleteConfirmCol);

  const handleSave = (data: any) => {
    if (view === 'edit' && selectedCollection) {
      handleUpdate(selectedCollection.id, data);
      setView('detail');
    } else {
      setItems([{ id: Date.now().toString(), count: 0, visibility: 'public', ...data }, ...items]);
      setView('list');
    }
  };

  if (view === 'add' || view === 'edit') {
    return (
      <SubPageLayout 
        title={view === 'add' ? "新建作品合集" : "编辑作品合集"} 
        onBack={() => setView(view === 'edit' ? 'detail' : 'list')}
        noPadding
      >
        <CollectionEditForm 
          initialData={view === 'edit' ? selectedCollection : undefined}
          onSave={handleSave} 
          onCancel={() => setView(view === 'edit' ? 'detail' : 'list')} 
        />
      </SubPageLayout>
    );
  }

  if (view === 'detail' && selectedCollection) {
    return (
      <CollectionDetailPage 
        collection={selectedCollection} 
        onBack={() => {
          setView('list');
          setSelectedCollection(null);
        }}
        onEdit={() => setView('edit')}
        onUpdate={(data) => handleUpdate(selectedCollection.id, data)}
      />
    );
  }

  return (
    <SubPageLayout 
      title="合集管理" 
      onBack={onBack}
    >
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索合集" 
              className="w-full bg-slate-50 border border-slate-100 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400/50 transition-all"
            />
          </div>
          <button onClick={() => setView('add')} className="w-9 h-9 shrink-0 bg-slate-800 text-white flex items-center justify-center rounded-full shadow-md shadow-slate-800/20 active:scale-95 transition-transform">
            <Plus size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center animate-in fade-in">
            <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-4 text-purple-300">
              <FolderHeart size={40} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">暂无合集</h3>
            <p className="text-sm text-slate-400 mb-6">创建合集，将你的作品分类整理</p>
            <Button className="rounded-full px-8 shadow-md shadow-lavender-500/20" onClick={() => setView('add')}>
              <Plus size={18} className="mr-1" /> 新建合集
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div 
                key={item.id} 
                onClick={() => {
                  setSelectedCollection(item);
                  setView('detail');
                }}
                className="bg-white rounded-2xl p-3 flex items-center space-x-4 relative overflow-hidden shadow-sm border border-slate-100 cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0">
                  <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0 py-1">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <Layers size={14} className="text-slate-700" />
                    <h4 className="font-bold text-slate-800 truncate text-sm">{item.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 mb-2">
                    {item.description || '暂无描述'}
                  </p>
                  <div className="flex items-center space-x-3 text-[10px] text-slate-400">
                    <span>包含作品 {item.count}</span>
                    <span>浏览 0</span>
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveItem(item);
                  }} 
                  className="absolute top-2 right-2 p-2 text-slate-300 hover:text-slate-500 rounded-full transition-colors"
                >
                  <MoreVertical size={18} />
                </button>
              </div>
            ))}
            <div className="py-6 text-center text-slate-400 text-sm">
              - 没有更多了 -
            </div>
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {activeItem && (
          <ActionSheet 
            item={activeItem} 
            onClose={() => setActiveItem(null)} 
            onUpdate={handleUpdate} 
            onDelete={(id: string) => setDeleteConfirmCol(id)} 
            onEdit={(item: any) => {
              setSelectedCollection(item);
              setView('edit');
              setActiveItem(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      {createPortal(
        <AnimatePresence>
          {deleteConfirmCol && collectionToDelete && [
              <motion.div 
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110]"
              />,
              <motion.div 
                key="dialog"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-sm bg-white rounded-3xl p-6 z-[110] shadow-2xl"
              >
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-center text-lg font-bold text-slate-800 mb-2">确认删除合集？</h3>
                <p className="text-center text-sm text-slate-500 mb-6">
                  {collectionToDelete.count > 0 
                    ? `该合集下有 ${collectionToDelete.count} 个作品，删除合集后，作品不会被删除，但将不再属于该合集。`
                    : '确认要删除这个合集吗？'}
                </p>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setDeleteConfirmCol(null)}
                    className="flex-1 py-3 rounded-xl bg-slate-50 text-slate-600 font-bold text-sm active:scale-[0.98] transition-transform"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-bold text-sm active:scale-[0.98] transition-transform shadow-md shadow-rose-500/20"
                  >
                    确认删除
                  </button>
                </div>
              </motion.div>
            ]
          }
        </AnimatePresence>,
        document.body
      )}

      {/* More Menu Bottom Sheet */}
      {createPortal(
        <AnimatePresence>
          {showMoreMenu && [
              <motion.div 
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMoreMenu(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
              />,
              <motion.div 
                key="sheet"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[100] p-4 pb-8 shadow-2xl"
              >
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      setShowMoreMenu(false);
                      setView('add');
                    }}
                    className="w-full py-4 px-4 rounded-2xl hover:bg-slate-50 flex items-center space-x-3 active:scale-[0.98] transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                      <Plus size={18} />
                    </div>
                    <span className="font-bold text-[15px] text-slate-800">新建作品合集</span>
                  </button>
                  <button 
                    onClick={() => setShowMoreMenu(false)}
                    className="w-full py-4 px-4 rounded-2xl hover:bg-slate-50 flex items-center space-x-3 active:scale-[0.98] transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                      <FolderHeart size={18} />
                    </div>
                    <span className="font-bold text-[15px] text-slate-800">设置精选合集</span>
                  </button>
                  
                  <div className="pt-4 pb-2 px-4">
                    <span className="text-xs text-slate-400">设置合集列表</span>
                  </div>
                  
                  <button 
                    onClick={() => setShowMoreMenu(false)}
                    className="w-full py-4 px-4 rounded-2xl hover:bg-slate-50 flex items-center justify-between active:scale-[0.98] transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                        <List size={18} />
                      </div>
                      <span className="font-bold text-[15px] text-slate-800">合集排序</span>
                    </div>
                    <span className="text-xs text-slate-400">调整合集在主页的展示顺序</span>
                  </button>
                </div>
              </motion.div>
            ]
          }
        </AnimatePresence>,
        document.body
      )}
    </SubPageLayout>
  );
}
