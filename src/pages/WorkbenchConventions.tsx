import React, { useState } from 'react';
import { ChevronLeft, CalendarDays, Calendar as CalendarIcon, MapPin, MessageSquare, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';

export function ConventionsPage({ conventions, setConventions }: any) {
  const navigate = useNavigate();
  const onBack = () => navigate('/workbench');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', startDate: '', endDate: '', location: '', notes: '' });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const handleSave = () => {
    setError('');
    if (!formData.name.trim()) {
      setError('请输入漫展名称');
      return;
    }
    if (!formData.startDate) {
      setError('请选择开始日期');
      return;
    }
    if (formData.endDate && formData.endDate < formData.startDate) {
      setError('结束日期不能早于开始日期');
      return;
    }
    
    if (editingId) {
      setConventions(conventions.map((c: any) => c.id === editingId ? { ...c, ...formData } : c));
    } else {
      setConventions([...conventions, { id: Date.now().toString(), ...formData }]);
    }
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', startDate: '', endDate: '', location: '', notes: '' });
  };

  const handleEdit = (convention: any) => {
    setFormData(convention);
    setEditingId(convention.id);
    setError('');
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setConventions(conventions.filter((c: any) => c.id !== id));
  };

  const getDaysUntil = (dateStr: string) => {
    const target = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between shrink-0 z-10 relative">
        <div className="flex items-center space-x-2 z-10">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-600 active:scale-95 transition-transform">
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => {
              setEditingId(null);
              setFormData({ name: '', startDate: '', endDate: '', location: '', notes: '' });
              setError('');
              setShowForm(true);
            }}
            className="text-[15px] font-medium text-lavender-600 active:scale-95 transition-transform"
          >
            新建
          </button>
        </div>
        <h2 className="text-lg font-bold text-slate-800 absolute left-1/2 -translate-x-1/2">漫展提醒</h2>
        <div className="w-16 z-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {conventions.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <CalendarDays size={48} className="mb-4 text-slate-200" />
            <p className="text-[15px] font-medium text-slate-600">暂无漫展行程</p>
            <p className="text-xs mt-1">点击左上角 新建 添加</p>
          </div>
        ) : (
          [...conventions].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).map(conv => {
            const daysUntil = getDaysUntil(conv.startDate);
            const isPast = daysUntil < 0;
            
            return (
              <motion.div 
                key={conv.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "bg-white rounded-2xl p-4 shadow-sm border relative overflow-hidden",
                  isPast ? "border-slate-100 opacity-70" : "border-lavender-100"
                )}
              >
                {!isPast && (
                  <div className="absolute top-0 right-0 bg-lavender-50 text-lavender-600 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-b border-l border-lavender-100">
                    {daysUntil === 0 ? '今天开始' : `距开始还有 ${daysUntil} 天`}
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-3 pr-20">
                  <h3 className="text-[16px] font-bold text-slate-800">{conv.name}</h3>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-[13px] text-slate-600">
                    <CalendarIcon size={14} className="mr-2 text-slate-400" />
                    {conv.startDate} {conv.endDate ? `至 ${conv.endDate}` : ''}
                  </div>
                  {conv.location && (
                    <div className="flex items-center text-[13px] text-slate-600">
                      <MapPin size={14} className="mr-2 text-slate-400" />
                      {conv.location}
                    </div>
                  )}
                  {conv.notes && (
                    <div className="flex items-start text-[13px] text-slate-600 bg-slate-50 p-2 rounded-lg mt-2">
                      <MessageSquare size={14} className="mr-2 mt-0.5 text-slate-400 shrink-0" />
                      <span className="leading-relaxed">{conv.notes}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-50">
                  <button 
                    onClick={() => handleEdit(conv)}
                    className="px-4 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-[13px] font-medium active:scale-95 transition-transform"
                  >
                    编辑
                  </button>
                  <button 
                    onClick={() => handleDelete(conv.id)}
                    className="px-4 py-1.5 rounded-lg bg-rose-50 text-rose-500 text-[13px] font-medium active:scale-95 transition-transform"
                  >
                    删除
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Form Bottom Sheet */}
      <AnimatePresence>
        {showForm && [
            <motion.div 
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />,
            <motion.div 
              key="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-5 pb-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[18px] font-bold text-slate-800">{editingId ? '编辑漫展' : '添加漫展'}</h3>
                <button onClick={() => setShowForm(false)} className="p-2 -mr-2 text-slate-400">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                {error && (
                  <div className="bg-rose-50 text-rose-500 p-3 rounded-xl text-sm flex items-center space-x-2 border border-rose-100">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">漫展名称</label>
                  <input 
                    type="text" 
                    placeholder="例如：CP29"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-lavender-400/50 transition-all text-[15px]"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-1.5">开始日期</label>
                    <input 
                      type="date" 
                      value={formData.startDate}
                      onChange={e => setFormData({...formData, startDate: e.target.value})}
                      className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-lavender-400/50 transition-all text-[15px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-1.5">结束日期 (可选)</label>
                    <input 
                      type="date" 
                      value={formData.endDate}
                      onChange={e => setFormData({...formData, endDate: e.target.value})}
                      className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-lavender-400/50 transition-all text-[15px]"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">举办地点</label>
                  <input 
                    type="text" 
                    placeholder="例如：国家会展中心"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-lavender-400/50 transition-all text-[15px]"
                  />
                </div>
                
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">备注信息</label>
                  <textarea 
                    placeholder="需要带些什么，或者有什么特别安排..."
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    className="w-full h-24 p-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-lavender-400/50 transition-all text-[15px] resize-none"
                  />
                </div>
                
                <button 
                  onClick={handleSave}
                  disabled={!formData.name || !formData.startDate}
                  className="w-full h-12 mt-6 rounded-xl bg-slate-800 text-white font-bold text-[15px] disabled:opacity-50 disabled:bg-slate-300 active:scale-[0.98] transition-all"
                >
                  保存
                </button>
              </div>
            </motion.div>
          ]
        }
      </AnimatePresence>
    </div>
  );
}
