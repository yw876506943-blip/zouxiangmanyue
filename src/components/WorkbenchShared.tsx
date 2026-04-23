import React, { useState } from 'react';
import { X, Search, Plus, Check } from '@/src/lib/icons';
import { Reorder, motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/Button';

export function AddMediaForm({ onCancel, onSave, type, initialData }: { onCancel: () => void, onSave: (data: any) => void, type: 'portfolio' | 'collection', initialData?: any }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [mediaItems, setMediaItems] = useState<{ id: string, url: string }[]>(initialData?.mediaItems || []);
  const [addToCollection, setAddToCollection] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(initialData?.cover || null);
  const [isPublic, setIsPublic] = useState(initialData?.visibility !== 'private');

  const [categories, setCategories] = useState(['全部', '二次元妆', 'COS妆', '日常妆', '古风妆', '特效妆']);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setCategory(newCategory.trim());
      setNewCategory('');
      setIsAddingCategory(false);
    }
  };

  const handleAddMedia = () => {
    const newId = Math.random().toString(36).substring(7);
    const newUrl = `https://picsum.photos/seed/${newId}/400/400`;
    setMediaItems([...mediaItems, { id: newId, url: newUrl }]);
  };

  const handleDeleteMedia = (id: string) => {
    setMediaItems(mediaItems.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-20">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-800">
          {type === 'portfolio' ? '作品封面' : '合集封面'} <span className="text-rose-500">*</span>
        </label>
        <div className="flex">
          {coverImage ? (
            <div className="relative w-24 h-32 rounded-xl overflow-hidden group">
              <img src={coverImage} alt="cover" className="w-full h-full object-cover" />
              <button 
                onClick={() => setCoverImage(null)}
                className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => setCoverImage(`https://picsum.photos/seed/${Math.random()}/400/600`)}
              className="w-24 h-32 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 active:bg-slate-100 transition-colors cursor-pointer"
            >
              <Plus size={24} strokeWidth={1.5} />
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full" />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-800">
            {type === 'portfolio' ? '作品' : '合集作品'} <span className="text-rose-500">*</span>
          </label>
          <span className="text-xs text-slate-400">{mediaItems.length}/100</span>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
          <Reorder.Group 
            axis="x" 
            values={mediaItems} 
            onReorder={setMediaItems} 
            className="flex gap-3"
          >
            {mediaItems.map((item) => (
              <Reorder.Item 
                key={item.id} 
                value={item} 
                className="relative w-24 h-24 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing shrink-0 bg-white"
              >
                <img src={item.url} alt="media" className="w-full h-full object-cover pointer-events-none" />
                <button 
                  onClick={() => handleDeleteMedia(item.id)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white"
                >
                  <X size={12} />
                </button>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          <div 
            onClick={handleAddMedia}
            className="w-24 h-24 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 active:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <Plus size={24} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full" />

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-800">标题</label>
        <input 
          type="text" 
          placeholder="给作品起个有吸引力的标题"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-lavender-400/50"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-800">描述</label>
        <textarea 
          placeholder="介绍一下你的作品，使用的产品、技巧和心得分享..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full min-h-[100px] bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-lavender-400/50 resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-800">可见性</label>
        <div className="flex bg-slate-100/80 p-1 rounded-2xl backdrop-blur-sm">
          <button 
            onClick={() => setIsPublic(true)} 
            className={cn("flex-1 py-2 text-sm font-bold rounded-xl transition-all", isPublic ? "bg-white shadow-sm text-slate-800" : "text-slate-500")}
          >
            公开
          </button>
          <button 
            onClick={() => setIsPublic(false)} 
            className={cn("flex-1 py-2 text-sm font-bold rounded-xl transition-all", !isPublic ? "bg-white shadow-sm text-slate-800" : "text-slate-500")}
          >
            私密
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 z-10 flex space-x-3">
        <Button 
          variant="outline" 
          className="flex-[0.4] h-12 rounded-xl font-bold" 
          onClick={onCancel}
        >
          取消
        </Button>
        <Button 
          className="flex-1 h-12 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold disabled:opacity-50"
          onClick={() => onSave({ title, description, category, mediaItems, cover: coverImage, visibility: isPublic ? 'public' : 'private' })}
          disabled={!coverImage || mediaItems.length === 0 || !title.trim()}
        >
          {initialData ? '保存修改' : '发布作品'}
        </Button>
      </div>
    </div>
  );
}

export function ActionSheet({ isOpen, item, onClose, onUpdate, onDelete, onEdit }: any) {
  return createPortal(
    <AnimatePresence>
      {isOpen && item && [
        <motion.div 
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
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
          <h3 className="text-center text-[15px] font-bold text-slate-800 mb-6 line-clamp-1 px-8">{item.title}</h3>
          
          <div className="space-y-3">
            {item.visibility === 'public' ? (
              <button 
                onClick={() => onUpdate(item.id, { visibility: 'private' })}
                className="w-full py-4 rounded-2xl bg-slate-50 text-slate-700 font-bold text-[15px] active:scale-[0.98] transition-transform"
              >
                设为私密
              </button>
            ) : (
              <button 
                onClick={() => onUpdate(item.id, { visibility: 'public' })}
                className="w-full py-4 rounded-2xl bg-slate-50 text-slate-700 font-bold text-[15px] active:scale-[0.98] transition-transform"
              >
                公开展示
              </button>
            )}
            
            <button 
              onClick={() => onEdit(item)}
              className="w-full py-4 rounded-2xl bg-lavender-50 text-lavender-600 font-bold text-[15px] active:scale-[0.98] transition-transform"
            >
              编辑详情
            </button>
            
            <button 
              onClick={() => onDelete(item.id)}
              className="w-full py-4 rounded-2xl bg-rose-50 text-rose-500 font-bold text-[15px] active:scale-[0.98] transition-transform"
            >
              删除作品
            </button>
            
            <button 
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-slate-100 text-slate-500 font-bold text-[15px] active:scale-[0.98] transition-transform mt-6"
            >
              取消
            </button>
          </div>
        </motion.div>
      ]}
    </AnimatePresence>,
    document.body
  );
}

export function WorkSelectorModal({ availableWorks, onSelect, onClose }: { availableWorks: any[], onSelect: (works: any[]) => void, onClose: () => void }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleConfirm = () => {
    const selectedWorks = availableWorks.filter(w => selectedIds.has(w.id));
    onSelect(selectedWorks);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-[100] flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-600 active:bg-slate-50 rounded-full transition-colors">
          <X size={20} />
        </button>
        <h2 className="text-[17px] font-bold text-slate-800">选择作品</h2>
        <div className="w-9" /> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {availableWorks.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            没有可添加的作品
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {availableWorks.map(work => {
              const isSelected = selectedIds.has(work.id);
              return (
                <div 
                  key={work.id} 
                  onClick={() => toggleSelect(work.id)}
                  className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group"
                >
                  <img src={work.image || work.url} alt={work.title} className="w-full h-full object-cover" />
                  <div className={cn("absolute inset-0 transition-colors", isSelected ? "bg-rose-500/20" : "bg-black/10")} />
                  
                  <div className="absolute top-2 right-2">
                    <div className={cn(
                      "w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-colors",
                      isSelected ? "bg-rose-500 border-rose-500 text-white" : "border-white/80 bg-black/20"
                    )}>
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-white pb-8">
        <Button 
          className="w-full h-12 rounded-full text-base font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 disabled:opacity-50 disabled:bg-slate-300"
          onClick={handleConfirm}
          disabled={selectedIds.size === 0}
        >
          添加 {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
        </Button>
      </div>
    </motion.div>
  );
}
