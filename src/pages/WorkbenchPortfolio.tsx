import React, { useState } from 'react';
import { SubPageLayout } from '@/src/components/SubPageLayout';
import { AddMediaForm, ActionSheet } from '@/src/components/WorkbenchShared';
import { Search, Plus, ImageIcon, MoreVertical, Lock, Link2, Eye, Trash2 } from '@/src/lib/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function PortfolioPage({ items, setItems, onBack }: { items: any[], setItems: (items: any[]) => void, onBack?: () => void }) {
  const navigate = useNavigate();

  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [activeItem, setActiveItem] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSingleColumn, setIsSingleColumn] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredItems = items.filter(item => {
    const matchTab = activeTab === '全部' || item.category === activeTab;
    const matchSearch = item.title.includes(searchQuery);
    return matchTab && matchSearch;
  });

  const handleUpdate = (id: string, data: any) => {
    setItems(items.map(i => i.id === id ? { ...i, ...data } : i));
    setActiveItem(null);
  };
  
  const handleDelete = () => {
    if (deleteConfirmId) {
      setItems(items.filter(i => i.id !== deleteConfirmId));
      setActiveItem(null);
      setDeleteConfirmId(null);
    }
  };

  const handleSave = (data: any) => {
    if (view === 'edit' && editingItem) {
      handleUpdate(editingItem.id, data);
      setEditingItem(null);
    } else {
      setItems([{ id: Date.now().toString(), image: data.mediaItems?.[0]?.url || 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=400&q=80', views: 0, ...data }, ...items]);
    }
    setView('list');
  };

  const getTitle = () => {
    if (view === 'add') return "发布作品";
    if (view === 'edit') return "编辑作品";
    return "作品管理";
  };

  const handleBack = () => {
    if (view === 'add' || view === 'edit') {
      setView('list');
      setEditingItem(null);
    } else {
      if (onBack) onBack();
      else navigate('/workbench');
    }
  };

  return (
    <SubPageLayout 
      title={getTitle()} 
      onBack={handleBack}
    >
      {(view === 'add' || view === 'edit') && (
        <AddMediaForm 
          onCancel={() => { setView('list'); setEditingItem(null); }} 
          onSave={handleSave} 
          type="portfolio" 
          initialData={editingItem}
        />
      )}

      {view === 'list' && (
        <div className="space-y-2">
          <div className="flex overflow-x-auto space-x-5 mb-2 pb-1 px-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            {['全部', 'COS妆', '日常妆', '新娘妆', '特效妆'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "whitespace-nowrap pb-1 border-b-2 text-[15px] font-medium transition-colors",
                  activeTab === tab ? "border-slate-800 text-slate-800" : "border-transparent text-slate-500"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="搜索作品..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400/50 transition-all"
              />
            </div>
            <button onClick={() => setView('add')} className="w-9 h-9 shrink-0 bg-slate-800 text-white flex items-center justify-center rounded-full shadow-md shadow-slate-800/20 active:scale-95 transition-transform">
              <Plus size={18} />
            </button>
          </div>

          {filteredItems.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center animate-in fade-in">
              <div className="w-24 h-24 bg-lavender-50 rounded-full flex items-center justify-center mb-4 text-lavender-300">
                <ImageIcon size={40} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">暂无作品</h3>
              <p className="text-sm text-slate-400 mb-6">上传你的第一个妆造作品，展示你的才华</p>
              <Button className="rounded-full px-8 shadow-md shadow-lavender-500/20" onClick={() => setView('add')}>
                <Plus size={18} className="mr-1" /> 发布作品
              </Button>
            </div>
          ) : (
            <>
              <div className={cn("grid gap-3", isSingleColumn ? "grid-cols-1" : "grid-cols-2")}>
                {filteredItems.map(item => (
                  <div key={item.id} className={cn("relative rounded-2xl overflow-hidden group bg-slate-100", isSingleColumn ? "aspect-video" : "aspect-[3/4]")}>
                    <img src={item.image || item.cover} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <div className="absolute top-2 right-2">
                      <button onClick={() => setActiveItem(item)} className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    
                    <div className="absolute top-2 left-2 flex space-x-1">
                      {item.visibility === 'private' && <div className="w-6 h-6 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white"><Lock size={12} /></div>}
                      {item.visibility === 'unlisted' && <div className="w-6 h-6 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white"><Link2 size={12} /></div>}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-xs font-medium line-clamp-2 leading-tight mb-1">{item.title}</div>
                      <div className="text-[10px] text-white/80 flex items-center">
                        <Eye size={10} className="mr-1" /> {item.views}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="py-6 text-center text-xs text-slate-400">- 没有更多了 -</div>
            </>
          )}
        </div>
      )}
      
      <ActionSheet 
        isOpen={!!activeItem}
        item={activeItem || {}} 
        onClose={() => setActiveItem(null)} 
        onUpdate={handleUpdate} 
        onDelete={(id: string) => setDeleteConfirmId(id)} 
        onEdit={(item: any) => {
          setEditingItem(item);
          setView('edit');
          setActiveItem(null);
        }}
      />

      {createPortal(
        <AnimatePresence>
          {deleteConfirmId && [
            <motion.div 
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            />,
            <motion.div 
              key="content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[320px] bg-white rounded-3xl p-6 shadow-2xl z-[101]"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-4">
                  <Trash2 size={24} />
                </div>
                <h3 className="text-center text-lg font-bold text-slate-800 mb-2">确认删除作品？</h3>
                <p className="text-center text-sm text-slate-500 mb-6">
                  删除后将无法恢复，确认要删除这个作品吗？
                </p>
                <div className="flex space-x-3 w-full">
                  <button 
                    onClick={() => setDeleteConfirmId(null)}
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
              </div>
            </motion.div>
          ]}
        </AnimatePresence>,
        document.body
      )}
    </SubPageLayout>
  );
}
