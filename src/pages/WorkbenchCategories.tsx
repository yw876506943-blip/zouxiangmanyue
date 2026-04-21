import React, { useState } from 'react';
import { SubPageLayout } from '@/src/components/SubPageLayout';
import { Plus, GripVertical, Tag, Trash2, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

export function CategoriesPage({ categories, setCategories, portfolios, setPortfolios }: any) {
  const navigate = useNavigate();
  const onBack = () => navigate('/workbench');

  const [isSorting, setIsSorting] = useState(false);
  const [deleteConfirmCat, setDeleteConfirmCat] = useState<{cat: string, index: number} | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [categoryNameInput, setCategoryNameInput] = useState('');
  const [modalError, setModalError] = useState('');

  const openAddModal = () => {
    setModalMode('add');
    setCategoryNameInput('');
    setModalError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: string, index: number) => {
    setModalMode('edit');
    setEditingIndex(index);
    setCategoryNameInput(cat);
    setModalError('');
    setIsModalOpen(true);
  };

  const handleSaveModal = () => {
    const trimmedName = categoryNameInput.trim();
    if (!trimmedName) {
      setModalError('分类名称不能为空');
      return;
    }

    if (modalMode === 'add') {
      if (categories.includes(trimmedName)) {
        setModalError('分类名称已存在');
        return;
      }
      setCategories([...categories, trimmedName]);
    } else if (modalMode === 'edit' && editingIndex !== null) {
      const oldName = categories[editingIndex];
      if (trimmedName !== oldName && categories.includes(trimmedName)) {
        setModalError('分类名称已存在');
        return;
      }
      
      const newCats = [...categories];
      newCats[editingIndex] = trimmedName;
      setCategories(newCats);
      
      // Update portfolios with the new category name
      if (portfolios && trimmedName !== oldName) {
        setPortfolios(portfolios.map((p: any) => 
          p.category === oldName ? { ...p, category: trimmedName } : p
        ));
      }
    }
    
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmCat) {
      const catToDelete = deleteConfirmCat.cat;
      // Remove category from categories list
      setCategories(categories.filter((_: any, i: number) => i !== deleteConfirmCat.index));
      
      // Remove category from portfolios
      if (portfolios) {
        setPortfolios(portfolios.map((p: any) => 
          p.category === catToDelete ? { ...p, category: '' } : p
        ));
      }
      
      setDeleteConfirmCat(null);
    }
  };

  const getPortfolioCount = (catName: string) => {
    if (!portfolios) return 0;
    return portfolios.filter((p: any) => p.category === catName).length;
  };

  const deleteCatCount = deleteConfirmCat ? getPortfolioCount(deleteConfirmCat.cat) : 0;

  return (
    <SubPageLayout title="分类管理" onBack={onBack}>
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-800">所有分类</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsSorting(!isSorting)}
              className={cn("text-xs font-medium px-3 py-1.5 rounded-full transition-colors", isSorting ? "bg-lavender-500 text-white" : "bg-slate-100 text-slate-600")}
            >
              {isSorting ? '完成排序' : '排序'}
            </button>
            <button 
              onClick={openAddModal}
              className="bg-lavender-50 text-lavender-600 hover:bg-lavender-100 p-1.5 rounded-full transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {isSorting ? (
          <Reorder.Group axis="y" values={categories} onReorder={setCategories} className="space-y-3">
            {Array.from(new Set(categories || [])).map((cat: any) => (
              <Reorder.Item 
                key={cat}
                value={cat}
                className="flex items-center space-x-3 bg-white rounded-xl p-4 border border-slate-100 shadow-sm"
              >
                <div className="cursor-grab active:cursor-grabbing text-slate-300 p-1 shrink-0">
                  <GripVertical size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-700 truncate">{cat}</p>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        ) : (
          <div className="space-y-3">
            {Array.from(new Set(categories || [])).map((cat: any, index: number) => (
              <div 
                key={cat} 
                onClick={() => openEditModal(cat, index)}
                className="flex items-center space-x-3 bg-white rounded-xl p-4 border border-slate-100 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="w-10 h-10 rounded-full bg-lavender-50 text-lavender-500 flex items-center justify-center shrink-0">
                  <Tag size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-slate-800 truncate">{cat}</p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirmCat({cat, index});
                  }}
                  className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Category Modal */}
      {createPortal(
        <AnimatePresence>
          {isModalOpen && [
              <motion.div 
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110]"
                onClick={() => setIsModalOpen(false)}
              />,
              <motion.div 
                key="dialog"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-sm bg-white rounded-3xl p-6 z-[110] shadow-2xl"
              >
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  {modalMode === 'add' ? '新建分类' : '修改分类'}
                </h3>
                
                <div className="mb-6">
                  <input 
                    type="text" 
                    placeholder="输入分类名称"
                    value={categoryNameInput}
                    onChange={(e) => {
                      setCategoryNameInput(e.target.value);
                      setModalError('');
                    }}
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-lavender-400/50 transition-all text-[15px]"
                    autoFocus
                  />
                  {modalError && (
                    <p className="text-rose-500 text-xs mt-2 ml-1">{modalError}</p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-50 text-slate-600 font-bold text-sm active:scale-[0.98] transition-transform"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleSaveModal}
                    className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-bold text-sm active:scale-[0.98] transition-transform shadow-md shadow-slate-800/20"
                  >
                    保存
                  </button>
                </div>
              </motion.div>
            ]
          }
        </AnimatePresence>,
        document.body
      )}

      {/* Delete Confirmation Dialog */}
      {createPortal(
        <AnimatePresence>
          {deleteConfirmCat && [
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
                <h3 className="text-center text-lg font-bold text-slate-800 mb-2">确认删除分类？</h3>
                <p className="text-center text-sm text-slate-500 mb-6">
                  {deleteCatCount > 0 
                    ? `该分类下有 ${deleteCatCount} 个作品，删除后作品将失去该分类标签，需要重新加入其他分类。`
                    : '确认要删除这个分类吗？'}
                </p>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setDeleteConfirmCat(null)}
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
    </SubPageLayout>
  );
}
