import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Bell, Search, Plus, Calendar as CalendarIcon, ChevronRight, ChevronLeft, ChevronDown,
  CheckCircle2, Circle, XCircle, List, Image as ImageIcon, Layers, PieChart, Share2, Share, Check,
  MoreVertical, Lock, Eye, EyeOff, Link2, Trash2, UploadCloud, Play, FolderHeart, ImagePlus,
  TrendingUp, Wallet, Clock, ArrowUpRight, ArrowDownRight, MapPin, AlertCircle, Camera, Tag, MessageSquare, Phone, X, Filter, CalendarDays, User, Link, QrCode, MoreHorizontal, Video, Edit, Unlock, GripVertical
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Badge } from '@/src/components/ui/Badge';
import { cn } from '@/src/lib/utils';
import { format, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, isSameMonth, isSameWeek, isSameYear, isWithinInterval, startOfDay, endOfDay, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ShareModal } from '@/src/components/ShareModal';

// Mock Data
const MOCK_ORDERS = [
  { id: '1', date: new Date(), time: '09:00-10:30', name: '小樱', type: 'COS妆', character: '雷电将军', status: 'todo', tags: ['需收尾款', '敏感肌'] },
  { id: '2', date: new Date(), time: '11:00-12:00', name: '阿喵', type: '日常妆', character: '-', status: 'completed', tags: [] },
  { id: '3', date: new Date(), time: '13:30-15:00', name: 'Kiko', type: '二次元妆', character: '初音未来', status: 'todo', tags: ['假毛修剪'] },
  { id: '4', date: addDays(new Date(), 2), time: '10:00-11:30', name: '木木', type: '古风妆', character: '-', status: 'todo', tags: [] },
];

type PageState = 'main' | 'today' | 'schedule' | 'portfolio' | 'collections' | 'stats' | 'share' | 'new_order' | 'order_detail' | 'conventions' | 'categories';

export function Workbench({ categories, setCategories, profile }: any) {
  const [activePage, setActivePage] = useState<PageState>('main');
  const [newOrderDate, setNewOrderDate] = useState<Date>(new Date());
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showReminder, setShowReminder] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [previousPage, setPreviousPage] = useState<PageState>('main');
  const [showShareModal, setShowShareModal] = useState(false);
  const [conventions, setConventions] = useState([
    { id: '1', name: 'CP29', startDate: '2026-05-01', endDate: '2026-05-03', location: '国家会展中心', notes: '记得带补光灯' },
    { id: '2', name: '萤火虫动漫游戏嘉年华', startDate: '2026-07-15', endDate: '2026-07-18', location: '保利世贸博览馆', notes: '' },
  ]);
  const [portfolios, setPortfolios] = useState([
    { id: '1', title: '原神·雷电将军', image: 'https://images.unsplash.com/photo-1542451542907-6cf80ff362d6?auto=format&fit=crop&w=400&q=80', visibility: 'public', views: 1205, category: 'COS妆' },
    { id: '2', title: '日常通透感伪素颜妆', image: 'https://images.unsplash.com/photo-1512496015851-a1c8e48d1546?auto=format&fit=crop&w=400&q=80', visibility: 'private', views: 0, category: '日常妆' },
  ]);

  const updateOrderStatus = (id: string, newStatus: string, extraData?: any) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus, ...extraData } : o));
  };

  const toggleStatus = (id: string) => {
    setOrders(orders.map(o => {
      if (o.id === id) {
        const nextStatus = o.status === 'todo' ? 'completed' : o.status === 'completed' ? 'cancelled' : 'todo';
        return { ...o, status: nextStatus };
      }
      return o;
    }));
  };

  const goToOrderDetail = (order: any, current: PageState) => {
    setSelectedOrder(order);
    setPreviousPage(current);
    setActivePage('order_detail');
  };

  // Dynamic Stats Calculations
  const today = new Date();
  const todayOrdersCount = orders.filter(o => isSameDay(o.date, today)).length;
  const totalOrdersCount = orders.length;
  const monthOrdersCount = orders.filter(o => o.date.getMonth() === today.getMonth() && o.date.getFullYear() === today.getFullYear()).length;
  const monthRevenue = orders
    .filter(o => o.date.getMonth() === today.getMonth() && o.date.getFullYear() === today.getFullYear() && o.status === 'completed')
    .reduce((sum, o) => sum + (Number(o.price) || 0), 0);

  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 6) return '夜深了，注意休息';
    if (hour < 12) return '早上好';
    if (hour < 14) return '中午好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  // --- Sub-pages ---
  if (activePage === 'conventions') {
    return <ConventionsPage onBack={() => setActivePage('main')} conventions={conventions} setConventions={setConventions} />;
  }

  if (activePage === 'today') {
    return (
      <TodayOrdersPage 
        orders={orders} 
        onBack={() => setActivePage('main')}
        onAddOrder={() => {
          setNewOrderDate(new Date());
          setActivePage('new_order');
        }}
        onViewOrder={(order: any) => goToOrderDetail(order, 'today')}
        updateOrderStatus={updateOrderStatus}
      />
    );
  }

  if (activePage === 'order_detail' && selectedOrder) {
    return (
      <OrderDetailPage 
        order={selectedOrder}
        onBack={() => setActivePage(previousPage)}
        updateOrderStatus={updateOrderStatus}
        onEdit={() => setActivePage('edit_order')}
      />
    );
  }

  if (activePage === 'edit_order' && selectedOrder) {
    return (
      <SubPageLayout title="修改订单" onBack={() => setActivePage('order_detail')}>
        <NewOrderForm 
          initialDate={selectedOrder.date} 
          orders={orders} 
          initialData={selectedOrder}
          onSave={(updatedOrder) => {
            setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
            setSelectedOrder(updatedOrder);
            setActivePage('order_detail');
          }} 
        />
      </SubPageLayout>
    );
  }

  if (activePage === 'schedule') {
    return (
      <SchedulePage 
        onBack={() => setActivePage('main')} 
        orders={orders} 
        toggleStatus={toggleStatus} 
        onAddNewOrder={(date: Date) => {
          setNewOrderDate(date);
          setActivePage('new_order');
        }}
        onViewOrder={(order: any) => goToOrderDetail(order, 'schedule')}
        updateOrderStatus={updateOrderStatus}
      />
    );
  }

  if (activePage === 'new_order') {
    return (
      <SubPageLayout title="新建订单" onBack={() => setActivePage('main')}>
        <NewOrderForm 
          initialDate={newOrderDate} 
          orders={orders}
          onSave={(newOrder) => {
            setOrders([...orders, newOrder]);
            setActivePage('main');
          }} 
        />
      </SubPageLayout>
    );
  }

  if (activePage === 'portfolio') {
    return <PortfolioPage onBack={() => setActivePage('main')} items={portfolios} setItems={setPortfolios} />;
  }

  if (activePage === 'collections') {
    return <CollectionsPage onBack={() => setActivePage('main')} />;
  }

  if (activePage === 'categories') {
    return <CategoriesPage onBack={() => setActivePage('main')} categories={categories} setCategories={setCategories} portfolios={portfolios} setPortfolios={setPortfolios} />;
  }

  if (activePage === 'stats') {
    return <StatsPage onBack={() => setActivePage('main')} orders={orders} onViewOrder={(order: any) => goToOrderDetail(order, 'stats')} />;
  }

  const getDaysUntil = (dateStr: string) => {
    const target = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const upcomingConventions = conventions
    .map(c => ({ ...c, daysUntil: getDaysUntil(c.startDate) }))
    .filter(c => c.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const nearestConvention = upcomingConventions.length > 0 ? upcomingConventions[0] : null;

  // --- Main Dashboard View ---
  return (
    <div className="p-4 space-y-2 pb-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between pt-2 pb-2"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{getGreeting()}</h1>
          <p className="text-sm text-slate-500 mt-1">{format(today, 'M月d日 EEEE', { locale: zhCN })}</p>
        </div>
      </motion.div>

      {/* Convention Reminder */}
      <AnimatePresence>
        {showReminder && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
            onClick={() => setActivePage('conventions')}
            className="glass rounded-2xl p-4 flex items-center justify-between bg-gradient-to-r from-lavender-50/80 to-misty-50/80 border-lavender-100 relative overflow-hidden cursor-pointer"
          >
            <div className="flex items-center space-x-3 z-10">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-lavender-500">
                <CalendarIcon size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  {nearestConvention ? nearestConvention.name : '漫展提醒'}
                </h3>
                <p className={cn("text-xs mt-0.5 font-medium", nearestConvention && nearestConvention.daysUntil <= 3 ? "text-rose-500" : "text-slate-500")}>
                  {nearestConvention 
                    ? (nearestConvention.daysUntil === 0 ? '今天开始' : `距开始还有 ${nearestConvention.daysUntil} 天`) 
                    : '点击管理漫展行程'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 z-10">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowReminder(false); }} 
                className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-white/50"
              >
                <X size={16} />
              </button>
              <ChevronRight size={18} className="text-slate-400" />
            </div>
            {/* Decorative background elements */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-lavender-200/30 rounded-full blur-xl" />
            <div className="absolute right-10 -bottom-6 w-16 h-16 bg-misty-200/40 rounded-full blur-lg" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-dark rounded-3xl p-5 grid grid-cols-4 gap-2 shadow-sm mt-4"
      >
        <StatItem value={todayOrdersCount.toString()} label="今日预约" />
        <StatItem value={totalOrdersCount.toString()} label="总订单" />
        <StatItem value={monthOrdersCount.toString()} label="本月订单" />
        <StatItem value={`¥${monthRevenue >= 1000 ? (monthRevenue / 1000).toFixed(1) + 'k' : monthRevenue}`} label="本月收入" />
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3 mt-4"
      >
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActivePage('new_order')} 
          className="glass-dark rounded-2xl p-4 flex items-center space-x-3 shadow-sm cursor-pointer transition-shadow hover:shadow-md"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-200">
            <Plus size={24} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">立即新建</div>
            <div className="text-[10px] text-slate-400">订单/排期/任务</div>
          </div>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowShareModal(true)} 
          className="glass-dark rounded-2xl p-4 flex items-center space-x-3 shadow-sm cursor-pointer transition-shadow hover:shadow-md"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-200">
            <Share size={20} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">分享主页</div>
            <div className="text-[10px] text-slate-400">分享我的首页</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Management Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 pt-2"
      >
        <h3 className="text-sm font-bold text-slate-800 mb-3 px-1">主页管理</h3>
        <div className="glass-dark rounded-3xl p-6 grid grid-cols-4 gap-y-6 gap-x-2 shadow-sm">
          <GridItem icon={<List size={22} />} color="bg-blue-50 text-blue-500" label="今日订单" onClick={() => setActivePage('today')} />
          <GridItem icon={<CalendarIcon size={22} />} color="bg-orange-50 text-orange-500" label="订单排期" onClick={() => setActivePage('schedule')} />
          <GridItem icon={<ImageIcon size={22} />} color="bg-emerald-50 text-emerald-500" label="作品管理" onClick={() => setActivePage('portfolio')} />
          <GridItem icon={<Layers size={22} />} color="bg-purple-50 text-purple-500" label="合集管理" onClick={() => setActivePage('collections')} />
          <GridItem icon={<Tag size={22} />} color="bg-pink-50 text-pink-500" label="分类管理" onClick={() => setActivePage('categories')} />
          <GridItem icon={<CalendarDays size={22} />} color="bg-indigo-50 text-indigo-500" label="漫展提醒" onClick={() => setActivePage('conventions')} />
          <GridItem icon={<PieChart size={22} />} color="bg-rose-50 text-rose-500" label="统计" onClick={() => setActivePage('stats')} />
          <GridItem icon={<Share2 size={22} />} color="bg-teal-50 text-teal-500" label="分享" onClick={() => setShowShareModal(true)} />
        </div>
      </motion.div>

      <ShareModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        profile={profile} 
      />
    </div>
  );
}

// --- Helper Components ---

function StatItem({ value, label }: { value: string, label: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center justify-center text-center cursor-default"
    >
      <span className="text-xl font-bold text-slate-800 tracking-tight">{value}</span>
      <span className="text-[10px] text-slate-500 mt-1">{label}</span>
    </motion.div>
  );
}

function GridItem({ icon, color, label, onClick }: { icon: React.ReactNode, color: string, label: string, onClick: () => void }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick} 
      className="flex flex-col items-center space-y-2 cursor-pointer"
    >
      <div className={cn("w-12 h-12 rounded-[1.25rem] flex items-center justify-center shadow-sm transition-shadow hover:shadow-md", color)}>
        {icon}
      </div>
      <span className="text-[11px] font-medium text-slate-700">{label}</span>
    </motion.div>
  );
}

function SubPageLayout({ title, onBack, children, noPadding = false, rightElement, showCapsule = true }: { title: React.ReactNode, onBack: () => void, children: React.ReactNode, noPadding?: boolean, rightElement?: React.ReactNode, showCapsule?: boolean }) {
  return (
    <div className="fixed inset-0 z-[60] bg-[#f8fafc] overflow-hidden flex flex-col">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-center">
        <button onClick={onBack} className="absolute left-4 p-2 -ml-2 text-slate-600 active:scale-95 transition-transform">
          <ChevronLeft size={24} />
        </button>
        {typeof title === 'string' ? <h2 className="text-base font-bold text-slate-800">{title}</h2> : title}
        
        <div className="absolute right-3 flex items-center space-x-2">
          {rightElement}
          {showCapsule && (
            <div className="flex items-center bg-white/80 border border-slate-200/80 rounded-full px-2.5 py-1.5 space-x-2.5 backdrop-blur-md shadow-sm">
              <MoreHorizontal size={16} className="text-slate-800" />
              <div className="w-px h-3.5 bg-slate-200" />
              <div className="w-4 h-4 rounded-full border-[1.5px] border-slate-800 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={cn("flex-1 overflow-y-auto", noPadding ? "" : "p-4 pb-24")}>
        {children}
      </div>
    </div>
  );
}

// --- Views ---

function OrderListView({ orders, date, searchQuery, setSearchQuery, toggleStatus, emptyMessage = "今日暂无订单", showDate = false, filterByDate = true, hideSearch = false, onViewOrder, updateOrderStatus, filterStatus = 'all' }: any) {
  const [statusSheetOrder, setStatusSheetOrder] = useState<any>(null);
  const [refundDialogOrder, setRefundDialogOrder] = useState<any>(null);
  const [refundAmount, setRefundAmount] = useState('');

  const filteredOrders = orders.filter((o: any) => 
    (!filterByDate || isSameDay(o.date, date)) &&
    (filterStatus === 'all' || o.status === filterStatus) &&
    (o.name.includes(searchQuery) || o.type.includes(searchQuery) || o.character.includes(searchQuery))
  ).sort((a: any, b: any) => {
    if (a.status === 'todo' && b.status !== 'todo') return -1;
    if (a.status !== 'todo' && b.status === 'todo') return 1;
    return a.time.localeCompare(b.time);
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'todo': return (
        <div className="flex items-center space-x-1 px-3 py-1.5 bg-lavender-50 text-lavender-600 rounded-full text-[13px] font-bold border border-lavender-100 shadow-sm">
          <Circle size={14} />
          <span>待完成</span>
          <ChevronRight size={14} className="opacity-50 -ml-0.5" />
        </div>
      );
      case 'completed': return (
        <div className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[13px] font-bold border border-emerald-100 shadow-sm">
          <CheckCircle2 size={14} />
          <span>已完成</span>
          <ChevronRight size={14} className="opacity-50 -ml-0.5" />
        </div>
      );
      case 'cancelled': return (
        <div className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-full text-[13px] font-bold border border-slate-200 shadow-sm">
          <XCircle size={14} />
          <span>已取消</span>
          <ChevronRight size={14} className="opacity-50 -ml-0.5" />
        </div>
      );
      default: return null;
    }
  };

  const handleCancelOrder = (order: any) => {
    if (order.deposit === '已付' || order.deposit === '全款' || (order.deposit && order.deposit.startsWith('已付'))) {
      setRefundDialogOrder(order);
      setRefundAmount('');
      setStatusSheetOrder(null);
    } else {
      updateOrderStatus && updateOrderStatus(order.id, 'cancelled');
      setStatusSheetOrder(null);
    }
  };

  const handleCompleteOrder = (order: any) => {
    const newTags = Array.from(new Set([...(order.tags || []).filter((t: string) => t !== '需收尾款'), '线下付全款']));
    updateOrderStatus && updateOrderStatus(order.id, 'completed', { deposit: '全款', tags: newTags });
    setStatusSheetOrder(null);
  };

  const handleRefundDecision = (refund: boolean) => {
    if (refundDialogOrder) {
      if (refund) {
        updateOrderStatus && updateOrderStatus(refundDialogOrder.id, 'cancelled', { deposit: '已退款', paidAmount: '0', refundAmount: refundAmount || '全额' });
      } else {
        updateOrderStatus && updateOrderStatus(refundDialogOrder.id, 'cancelled');
      }
      setRefundDialogOrder(null);
    }
  };

  const getBalance = (order: any) => {
    const total = parseFloat(order.price) || 0;
    if (order.deposit === '全款') return 0;
    
    let paid = 0;
    if (order.paidAmount) {
      paid = parseFloat(order.paidAmount) || 0;
    } else if (order.deposit && order.deposit.startsWith('已付')) {
      const match = order.deposit.match(/\d+(\.\d+)?/);
      if (match) paid = parseFloat(match[0]);
    }
    return Math.max(0, total - paid);
  };

  return (
    <div className="space-y-4">
      {!hideSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="搜索客户姓名 / 日期 / 妆造..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white/60 border border-white/80 shadow-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-lavender-400/50 transition-all text-sm"
          />
        </div>
      )}

      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            {emptyMessage}
          </div>
        ) : (
          filteredOrders.map((order: any) => {
            const balance = getBalance(order);
            const isFullyPaid = balance <= 0 || order.status === 'completed' || order.deposit === '全款';

            return (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col"
              >
              <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1.5 transition-colors",
                order.status === 'completed' ? "bg-emerald-400" : 
                order.status === 'cancelled' ? "bg-slate-300" : "bg-lavender-400"
              )} />
              
              <div className="pl-2 flex flex-col space-y-2.5">
                {/* Top Row: Time, Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-black text-slate-800 tracking-tight font-mono whitespace-nowrap">
                      {showDate ? `${format(order.date, 'MM-dd')} ${order.time}` : order.time}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setStatusSheetOrder(order); }}
                    className="active:scale-95 transition-transform shrink-0 ml-2"
                  >
                    {getStatusBadge(order.status)}
                  </button>
                </div>

                {/* Middle Row: Info (Clickable to detail) */}
                <div className="flex-1 cursor-pointer flex items-center justify-between mt-2" onClick={() => onViewOrder && onViewOrder(order)}>
                  <div className="flex items-center space-x-3">
                    {order.images && order.images.length > 0 && (
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                        <img src={order.images[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2 text-[15px]">
                        <span className="font-bold text-slate-800">{order.name}</span>
                        {order.contact && (
                          <a 
                            href={`tel:${order.contact}`} 
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 bg-blue-50 text-blue-500 rounded-full hover:bg-blue-100 transition-colors"
                          >
                            <Phone size={12} />
                          </a>
                        )}
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-600 font-medium">{order.type}</span>
                      </div>
                      {order.character !== '-' && (
                        <div className="text-[12px] text-slate-500 flex items-center">
                          <Tag size={12} className="mr-1 opacity-70" /> {order.character}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end shrink-0 ml-2">
                    {isFullyPaid ? (
                      <span className="text-[12px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">已收全款</span>
                    ) : (
                      <>
                        <span className="text-[10px] text-slate-400 font-medium mb-0.5">待收尾款</span>
                        <span className="text-[16px] font-bold text-rose-500">¥{balance}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Tags */}
                {order.tags && order.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-50">
                    {order.tags.map((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-slate-50 text-slate-500 text-[10px] font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )})
        )}
      </div>

      {/* Status Action Sheet */}
      {createPortal(
        <AnimatePresence>
          {statusSheetOrder && [
              <motion.div 
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setStatusSheetOrder(null)}
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
                <h3 className="text-center text-[15px] font-bold text-slate-800 mb-6">修改订单状态</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => { updateOrderStatus && updateOrderStatus(statusSheetOrder.id, 'todo'); setStatusSheetOrder(null); }}
                    className="w-full py-4 rounded-2xl bg-lavender-50 text-lavender-600 font-bold text-[15px] flex items-center justify-center space-x-2 active:scale-[0.98] transition-transform"
                  >
                    <Circle size={18} /> <span>待完成</span>
                  </button>
                  <button 
                    onClick={() => handleCompleteOrder(statusSheetOrder)}
                    className="w-full py-4 rounded-2xl bg-emerald-50 text-emerald-600 font-bold text-[15px] flex items-center justify-center space-x-2 active:scale-[0.98] transition-transform"
                  >
                    <CheckCircle2 size={18} /> <span>已完成</span>
                  </button>
                  <button 
                    onClick={() => handleCancelOrder(statusSheetOrder)}
                    className="w-full py-4 rounded-2xl bg-slate-50 text-slate-600 font-bold text-[15px] flex items-center justify-center space-x-2 active:scale-[0.98] transition-transform"
                  >
                    <XCircle size={18} /> <span>已取消</span>
                  </button>
                </div>
              </motion.div>
            ]
          }
        </AnimatePresence>,
        document.body
      )}

      {/* Refund Dialog */}
      {createPortal(
        <AnimatePresence>
          {refundDialogOrder && [
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
                  <XCircle size={24} />
                </div>
                <h3 className="text-center text-lg font-bold text-slate-800 mb-2">确认取消订单</h3>
                <p className="text-center text-sm text-slate-500 mb-6">
                  该订单已付{refundDialogOrder.deposit === '全款' ? '全款' : '定金'}，是否需要退还款项并自动计算？
                </p>
                <div className="mb-6">
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">退款金额 (可选)</label>
                  <input 
                    type="number" 
                    placeholder="输入退款金额，不填则默认全额退款" 
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-400/50 transition-all text-[15px]"
                  />
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleRefundDecision(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-50 text-slate-600 font-bold text-sm active:scale-[0.98] transition-transform"
                  >
                    不退款
                  </button>
                  <button 
                    onClick={() => handleRefundDecision(true)}
                    className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-bold text-sm active:scale-[0.98] transition-transform shadow-md shadow-rose-500/20"
                  >
                    退款并取消
                  </button>
                </div>
              </motion.div>
            ]
          }
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

function CalendarView({ selectedDate, setSelectedDate, onDayClick, orders }: { selectedDate: Date, setSelectedDate: (d: Date) => void, onDayClick?: (d: Date) => void, orders: any[] }) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = monthStart;
  const endDate = monthEnd;
  const dateFormat = "d";
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const startDayOfWeek = getDay(startDate);

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800">{format(selectedDate, 'yyyy年 M月')}</h3>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setSelectedDate(new Date())}>回到今天</Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-xs font-medium text-slate-400 py-1">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="h-10" />
        ))}
        {days.map(day => {
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const orderCount = orders.filter(o => isSameDay(o.date, day)).length;

          return (
            <div 
              key={day.toString()} 
              onClick={() => {
                setSelectedDate(day);
                if (onDayClick) onDayClick(day);
              }}
              className={cn(
                "h-10 flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all relative",
                isSelected ? "bg-lavender-500 text-white shadow-md shadow-lavender-500/20" : "hover:bg-slate-50 text-slate-700",
                isTodayDate && !isSelected && "text-lavender-500 font-bold"
              )}
            >
              <span className={cn("text-[13px]", isSelected ? "font-bold" : "")}>{format(day, dateFormat)}</span>
              {orderCount > 0 && (
                <div className={cn(
                  "absolute bottom-0.5 text-[9px] font-medium",
                  isSelected ? "text-white/90" : "text-lavender-500"
                )}>
                  {orderCount}单
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function FormRow({ label, required, children, noBorder, hint }: any) {
  return (
    <div className={cn("flex items-center justify-between py-3.5", !noBorder && "border-b border-slate-100")}>
      <div className="flex items-center space-x-1 shrink-0">
        <span className="text-[15px] text-slate-700">{label}</span>
        {hint && <AlertCircle size={14} className="text-slate-300 ml-0.5" />}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </div>
      <div className="flex-1 flex justify-end items-center ml-4 min-w-0">
        {children}
      </div>
    </div>
  );
}

function NewOrderForm({ onSave, initialDate, orders, initialData }: { onSave: (order: any) => void, initialDate: Date, orders: any[], initialData?: any }) {
  const [date, setDate] = useState(initialData ? format(initialData.date, 'yyyy-MM-dd') : format(initialDate, 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState(initialData ? initialData.time.split('-')[0] : '09:00');
  const [endTime, setEndTime] = useState(initialData ? initialData.time.split('-')[1] : '10:30');
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState(initialData?.type || '');
  const [source, setSource] = useState(initialData?.source || '');
  const [character, setCharacter] = useState(initialData?.character !== '-' ? initialData?.character || '' : '');
  const [price, setPrice] = useState(initialData?.price || '');
  
  let initDeposit = '未付';
  let initPaidAmount = '';
  if (initialData?.deposit === '全款') initDeposit = '全款';
  else if (initialData?.deposit?.startsWith('已付')) {
    initDeposit = '已付';
    initPaidAmount = initialData.deposit.replace('已付 ¥', '');
  }
  const [deposit, setDeposit] = useState(initDeposit);
  const [paidAmount, setPaidAmount] = useState(initPaidAmount);
  
  let initContact = initialData?.contact || '';
  let initWechat = '';
  let initShowWechat = false;
  if (initContact.includes('(微信: ')) {
    const parts = initContact.split(' (微信: ');
    initContact = parts[0];
    initWechat = parts[1].replace(')', '');
    initShowWechat = true;
  }
  const [contact, setContact] = useState(initContact);
  const [isOnSite, setIsOnSite] = useState(initialData?.isOnSite || false);
  const [address, setAddress] = useState(initialData?.address || '');
  const [showWechat, setShowWechat] = useState(initShowWechat);
  const [wechat, setWechat] = useState(initWechat);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  
  const [error, setError] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempStartTime, setTempStartTime] = useState(startTime);
  const [tempEndTime, setTempEndTime] = useState(endTime);
  const [alertConfig, setAlertConfig] = useState<{show: boolean, message: string, type: 'error' | 'conflict'}>({show: false, message: '', type: 'error'});

  const depositOptions = [
    { label: '未付', value: '未付', color: 'bg-slate-100 text-slate-500', activeColor: 'bg-slate-800 text-white' },
    { label: '已付', value: '已付', color: 'bg-emerald-50 text-emerald-600', activeColor: 'bg-emerald-500 text-white' },
    { label: '全款', value: '全款', color: 'bg-lavender-50 text-lavender-600', activeColor: 'bg-lavender-500 text-white' },
  ];

  const handleImageUpload = () => {
    // Mock image upload
    setImages([...images, `https://picsum.photos/seed/${Date.now()}/200/200`]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name) {
      setAlertConfig({show: true, message: '请填写客户姓名', type: 'error'});
      return;
    }

    // Check for double booking
    const selectedDateObj = new Date(date);
    const isConflict = orders.some(o => {
      if (initialData && o.id === initialData.id) return false;
      if (!isSameDay(o.date, selectedDateObj)) return false;
      const [oStart, oEnd] = o.time.split('-');
      // Simple time overlap check
      return (startTime < oEnd && endTime > oStart);
    });

    if (isConflict) {
      setAlertConfig({show: true, message: '该时间段已有其他订单，继续保存将导致时间冲突。是否确认创建？', type: 'conflict'});
      return;
    }

    executeSave();
  };

  const executeSave = () => {
    const newOrder = {
      id: initialData ? initialData.id : Date.now().toString(),
      date: new Date(date),
      time: `${startTime}-${endTime}`,
      name,
      type,
      source,
      character: character || '-',
      status: initialData ? initialData.status : 'todo',
      tags: initialData ? initialData.tags : [], 
      price,
      deposit: deposit === '已付' ? `已付 ¥${paidAmount}` : deposit,
      contact: showWechat && wechat ? `${contact} (微信: ${wechat})` : contact,
      isOnSite,
      address: isOnSite ? address : '',
      notes,
      images
    };
    onSave(newOrder);
  };

  return (
    <div className="space-y-4 pb-28 animate-in fade-in slide-in-from-bottom-4 duration-300 bg-[#f8fafc] px-3 pt-3">
      {/* Card 1: Required Info */}
      <div className="bg-white rounded-2xl px-4 shadow-sm border border-slate-100/50">
        <FormRow label="交付日期" required>
          <div className="flex items-center justify-end w-full">
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 text-[15px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-lavender-500/50" 
            />
          </div>
        </FormRow>

        <FormRow label="客户名称" required noBorder>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="请输入客户名称" className="w-full bg-transparent focus:outline-none text-right text-[15px] text-slate-700 placeholder:text-slate-400" />
        </FormRow>
      </div>

      {/* Card 2: Optional Info */}
      <div className="bg-white rounded-2xl px-4 shadow-sm border border-slate-100/50">
        <FormRow label="时间">
          <div 
            onClick={() => {
              setTempStartTime(startTime);
              setTempEndTime(endTime);
              setShowTimePicker(true);
            }}
            className="flex items-center justify-end space-x-2 w-full cursor-pointer"
          >
            <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <span className="text-[15px] font-medium text-slate-700">{startTime}</span>
            </div>
            <span className="text-slate-300 font-medium">-</span>
            <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <span className="text-[15px] font-medium text-slate-700">{endTime}</span>
            </div>
            <ChevronRight size={16} className="text-slate-300 ml-1 shrink-0" />
          </div>
        </FormRow>
        
        <FormRow label="订单类型">
          <input 
            type="text" 
            value={type} 
            onChange={e => setType(e.target.value)} 
            placeholder="自定义填写，如：日常妆" 
            className="w-full bg-transparent focus:outline-none text-right text-[15px] text-slate-700 placeholder:text-slate-400" 
          />
        </FormRow>

        <FormRow label="订单来源">
          <input 
            type="text" 
            value={source} 
            onChange={e => setSource(e.target.value)} 
            placeholder="如：闲鱼、小红书" 
            className="w-full bg-transparent focus:outline-none text-right text-[15px] text-slate-700 placeholder:text-slate-400" 
          />
        </FormRow>

        <FormRow label="角色名称" hint>
          <input type="text" value={character} onChange={e => setCharacter(e.target.value)} placeholder="如：原神 雷电将军" className="w-full bg-transparent focus:outline-none text-right text-[15px] text-slate-700 placeholder:text-slate-400" />
        </FormRow>

        <FormRow label="联系方式" noBorder={!showWechat && !isOnSite}>
          <div className="flex items-center justify-end w-full">
            <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="电话号码" className="w-full bg-transparent focus:outline-none text-right text-[15px] text-slate-700 placeholder:text-slate-400 pr-2" />
            <button 
              onClick={() => setShowWechat(!showWechat)}
              className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors", showWechat ? "bg-rose-100 text-rose-500" : "bg-slate-100 text-slate-500 hover:bg-slate-200")}
            >
              <Plus size={14} className={cn("transition-transform", showWechat && "rotate-45")} />
            </button>
          </div>
        </FormRow>

        <AnimatePresence>
          {showWechat && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <FormRow label="微信号" noBorder={!isOnSite}>
                <input 
                  type="text" 
                  value={wechat} 
                  onChange={e => setWechat(e.target.value)} 
                  placeholder="请输入微信号" 
                  className="w-full bg-transparent focus:outline-none text-right text-[15px] text-slate-700 placeholder:text-slate-400" 
                />
              </FormRow>
            </motion.div>
          )}
        </AnimatePresence>

        <FormRow label="是否上门" noBorder={!isOnSite}>
          <button 
            onClick={() => setIsOnSite(!isOnSite)}
            className={cn(
              "w-12 h-7 rounded-full transition-colors relative",
              isOnSite ? "bg-slate-800" : "bg-slate-200"
            )}
          >
            <motion.div 
              layout
              className="w-5 h-5 bg-white rounded-full shadow-sm absolute top-1"
              initial={false}
              animate={{ left: isOnSite ? 'calc(100% - 24px)' : '4px' }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </FormRow>

        <AnimatePresence>
          {isOnSite && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <FormRow label="上门地址" noBorder>
                <input 
                  type="text" 
                  value={address} 
                  onChange={e => setAddress(e.target.value)} 
                  placeholder="请输入详细地址" 
                  className="w-full bg-transparent focus:outline-none text-right text-[15px] text-slate-700 placeholder:text-slate-400" 
                />
              </FormRow>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card 3: Payment */}
      <div className="bg-white rounded-2xl px-4 shadow-sm border border-slate-100/50">
        <FormRow label="订单总额">
          <div className="flex items-center justify-end w-full">
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="请输入订单总金额" className="w-full bg-transparent focus:outline-none text-right text-[15px] text-slate-700 placeholder:text-slate-400 pr-2" />
            <span className="text-[15px] font-bold text-slate-800">¥</span>
          </div>
        </FormRow>

        <FormRow label="定金状态" noBorder={deposit !== '已付'}>
          <div className="flex items-center justify-end space-x-2 w-full">
            {depositOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setDeposit(opt.value)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-300",
                  deposit === opt.value ? opt.activeColor + " shadow-sm scale-105" : opt.color + " hover:bg-slate-100"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </FormRow>
        
        <AnimatePresence>
          {deposit === '已付' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <FormRow label="已付金额" noBorder>
                <div className="flex items-center justify-end w-full">
                  <input type="number" value={paidAmount} onChange={e => setPaidAmount(e.target.value)} placeholder="请输入已付金额" className="w-full bg-transparent focus:outline-none text-right text-[15px] text-slate-700 placeholder:text-slate-400 pr-2" />
                  <span className="text-[15px] font-bold text-slate-800">¥</span>
                </div>
              </FormRow>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card 4: Notes & Tags */}
      <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-100/50 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[15px] text-slate-700">备注</span>
        </div>
        
        <textarea 
          value={notes} 
          onChange={e => setNotes(e.target.value)} 
          placeholder="请输入详细备注信息 (假毛/美瞳/特殊需求)..." 
          className="w-full h-20 bg-slate-50 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-lavender-400/50 text-[14px] text-slate-700 placeholder:text-slate-400 resize-none" 
        />

        <div className="mt-2 flex flex-wrap gap-2">
          {images.map((img, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-16 h-16 rounded-xl overflow-hidden group shadow-sm border border-slate-100"
            >
              <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <button onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
                <X size={12} />
              </button>
            </motion.div>
          ))}
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleImageUpload} 
            className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <ImageIcon size={20} />
            <span className="text-[10px] mt-1 font-medium">添加图片</span>
          </motion.button>
        </div>
      </div>

      {/* Floating Confirm Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-40 pb-6">
        <Button className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-slate-800/20 bg-slate-800 text-white hover:bg-slate-700" onClick={handleSave}>
          确认订单
        </Button>
      </div>

      {/* Alert Modal */}
      <AnimatePresence>
        {alertConfig.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setAlertConfig({...alertConfig, show: false})}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm relative z-10 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${alertConfig.type === 'error' ? 'bg-rose-100 text-rose-500' : 'bg-amber-100 text-amber-500'}`}>
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {alertConfig.type === 'error' ? '提示' : '时间冲突提醒'}
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  {alertConfig.message}
                </p>
                <div className="flex space-x-3 w-full">
                  {alertConfig.type === 'conflict' ? (
                    <>
                      <button 
                        onClick={() => setAlertConfig({...alertConfig, show: false})}
                        className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold"
                      >
                        取消
                      </button>
                      <button 
                        onClick={() => {
                          setAlertConfig({...alertConfig, show: false});
                          executeSave();
                        }}
                        className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-bold"
                      >
                        继续创建
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setAlertConfig({...alertConfig, show: false})}
                      className="w-full py-3 rounded-xl bg-slate-800 text-white font-bold"
                    >
                      我知道了
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Time Picker Modal */}
      <AnimatePresence>
        {showTimePicker && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-slate-900/40 backdrop-blur-sm flex items-end"
            onClick={() => setShowTimePicker(false)}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={e => e.stopPropagation()}
              className="bg-white w-full rounded-t-3xl p-6 pb-10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">选择时间区间</h3>
                <button onClick={() => setShowTimePicker(false)} className="p-2 -mr-2 text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-center justify-between space-x-4 mb-8">
                <div className="flex-1 flex flex-col space-y-2">
                  <label className="text-xs font-medium text-slate-500 text-center">开始时间</label>
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-3 flex justify-center focus-within:border-lavender-400 focus-within:bg-white transition-colors">
                    <input 
                      type="time" 
                      value={tempStartTime} 
                      onChange={e => setTempStartTime(e.target.value)} 
                      className="bg-transparent focus:outline-none text-2xl font-bold text-slate-800 text-center w-full" 
                    />
                  </div>
                </div>
                
                <div className="text-slate-300 font-bold text-xl mt-6">-</div>
                
                <div className="flex-1 flex flex-col space-y-2">
                  <label className="text-xs font-medium text-slate-500 text-center">结束时间</label>
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-3 flex justify-center focus-within:border-lavender-400 focus-within:bg-white transition-colors">
                    <input 
                      type="time" 
                      value={tempEndTime} 
                      onChange={e => setTempEndTime(e.target.value)} 
                      className="bg-transparent focus:outline-none text-2xl font-bold text-slate-800 text-center w-full" 
                    />
                  </div>
                </div>
              </div>

              <Button 
                className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-slate-800/20 bg-slate-800 text-white hover:bg-slate-700" 
                onClick={() => {
                  setStartTime(tempStartTime);
                  setEndTime(tempEndTime);
                  setShowTimePicker(false);
                }}
              >
                确定
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ title, value, unit, highlight }: { title: string, value: string, unit?: string, highlight?: boolean }) {
  return (
    <div className={cn("rounded-2xl p-4 flex flex-col justify-center", highlight ? "bg-lavender-50 border border-lavender-100" : "bg-slate-50 border border-slate-100")}>
      <div className="text-xs text-slate-500 mb-1">{title}</div>
      <div className="flex items-baseline space-x-1">
        <span className={cn("text-xl font-bold", highlight ? "text-lavender-600" : "text-slate-800")}>{value}</span>
        {unit && <span className="text-xs text-slate-400">{unit}</span>}
      </div>
    </div>
  );
}

// --- Portfolio & Collections ---

function AddMediaForm({ onCancel, onSave, type, initialData }: { onCancel: () => void, onSave: (data: any) => void, type: 'portfolio' | 'collection', initialData?: any }) {
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

  
  // Mock categories from Home page
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
      {/* Cover Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-800">
            {type === 'portfolio' ? '作品封面' : '合集封面'} <span className="text-rose-500">*</span>
          </label>
          <button className="text-xs text-slate-400 flex items-center hover:text-slate-600">
            说明 <span className="w-3.5 h-3.5 rounded-full bg-slate-200 text-white flex items-center justify-center ml-1 text-[10px]">?</span>
          </button>
        </div>
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

      {/* Media Section */}
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
                whileDrag={{ scale: 1.05, zIndex: 10, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
                className="relative w-24 h-24 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing shrink-0 group bg-white"
              >
                <img src={item.url} alt="media" className="w-full h-full object-cover pointer-events-none" />
                <button 
                  onClick={() => handleDeleteMedia(item.id)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white opacity-100 transition-opacity"
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

        <p className="text-[11px] text-slate-400 leading-relaxed mt-2">
          {type === 'portfolio' 
            ? '支持上传图片或视频，建议首次添加少量，创建成功后可继续添加。长按可拖拽排序。'
            : '添加作品到合集中，长按可拖拽排序。'}
        </p>
      </div>

      <div className="h-px bg-slate-100 w-full" />

      {/* Category Section */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-800">
          作品分类
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.filter(c => c !== '全部').map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium transition-colors border",
                category === cat 
                  ? "bg-rose-50 border-rose-200 text-rose-500" 
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              {cat}
            </button>
          ))}
          
          {isAddingCategory ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="输入新分类"
                className="w-24 px-3 py-1.5 text-xs border border-slate-200 rounded-full focus:outline-none focus:border-rose-300"
                autoFocus
              />
              <button 
                onClick={handleAddCategory}
                className="text-xs font-medium text-rose-500 px-2"
              >
                确定
              </button>
              <button 
                onClick={() => { setIsAddingCategory(false); setNewCategory(''); }}
                className="text-xs font-medium text-slate-400 px-2"
              >
                取消
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingCategory(true)}
              className="px-4 py-1.5 rounded-full text-xs font-medium bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors flex items-center"
            >
              <Plus size={12} className="mr-1" /> 新建分类
            </button>
          )}
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full" />

      {/* Title Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-800">
            作品名称 <span className="text-rose-500">*</span>
          </label>
          <span className="text-xs text-slate-400">{title.length}/16</span>
        </div>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 16))}
          placeholder="请输入作品名称" 
          className="w-full text-sm placeholder:text-slate-300 border-none focus:outline-none focus:ring-0 p-0 bg-transparent" 
        />
      </div>

      <div className="h-px bg-slate-100 w-full" />

      {/* Description Section */}
      <div className="space-y-2 relative">
        <label className="text-sm font-bold text-slate-800 block mb-2">
          作品描述
        </label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 2500))}
          placeholder="介绍一下你的作品" 
          className="w-full h-32 text-sm placeholder:text-slate-300 border-none focus:outline-none focus:ring-0 p-0 bg-transparent resize-none" 
        />
        <span className="absolute bottom-0 right-0 text-xs text-slate-400">
          {description.length}/2500
        </span>
      </div>

      {type === 'portfolio' && (
        <>
          <div className="h-px bg-slate-100 w-full" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800">
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
          
          <div className="h-px bg-slate-100 w-full" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800">
                添加到合集
              </label>
              <div 
                className={cn("w-10 h-6 rounded-full transition-colors relative cursor-pointer", addToCollection ? "bg-rose-500" : "bg-slate-200")}
                onClick={() => setAddToCollection(!addToCollection)}
              >
                <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200", addToCollection ? "left-5" : "left-1")} />
              </div>
            </div>
            {addToCollection && (
              <div className="flex flex-wrap gap-2 pt-2">
                {['2023 漫展精选', '古风汉服系列'].map(col => (
                  <button
                    key={col}
                    onClick={() => setSelectedCollection(col)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-medium transition-colors border",
                      selectedCollection === col 
                        ? "bg-rose-50 border-rose-200 text-rose-500" 
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {col}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 z-50">
        <Button 
          className="w-full h-12 rounded-full text-base font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20" 
          onClick={() => onSave({ title: title || '新作品', category, description, cover: coverImage, visibility: isPublic ? 'public' : 'private' })}
        >
          完成保存
        </Button>
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, onClick, color }: any) {
  return (
    <div className="flex flex-col items-center space-y-2 cursor-pointer active:scale-95 transition-transform" onClick={onClick}>
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", color)}>
        {icon}
      </div>
      <span className="text-[10px] font-medium text-slate-600">{label}</span>
    </div>
  );
}

function ActionSheet({ item, onClose, onUpdate, onDelete, onEdit }: any) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-[70] flex flex-col justify-end">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="relative bg-white rounded-t-3xl p-6 pb-12 space-y-4 shadow-2xl">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
        
        <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden">
            <img src={item.image || item.cover} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 line-clamp-1">{item.title}</h4>
            <p className="text-xs text-slate-400 mt-1">
              {item.visibility === 'public' ? '公开可见' : item.visibility === 'private' ? '仅自己可见' : '仅分享可见'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {onEdit && <ActionBtn icon={<Edit size={24} />} label="编辑" onClick={() => onEdit(item)} color="text-lavender-600 bg-lavender-50" />}
          {item.visibility === 'private' ? (
            <ActionBtn icon={<Unlock size={24} />} label="设为公开可见" onClick={() => onUpdate(item.id, { visibility: 'public' })} color="text-emerald-600 bg-emerald-50" />
          ) : (
            <ActionBtn icon={<Lock size={24} />} label="设为私密不可见" onClick={() => onUpdate(item.id, { visibility: 'private' })} color="text-slate-600 bg-slate-50" />
          )}
          <ActionBtn icon={<Trash2 size={24} />} label="删除" onClick={() => onDelete(item.id)} color="text-rose-500 bg-rose-50" />
        </div>
      </motion.div>
    </div>
  );
}

function SelectWorkType({ onSelect }: { onSelect: (type: 'image' | 'video') => void }) {
  return (
    <div className="p-4 pt-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 relative inline-block">
          发作品
          <div className="absolute bottom-1 left-0 right-0 h-3 bg-gradient-to-r from-rose-400/40 to-transparent -z-10 rounded-full" />
        </h2>
        <p className="text-sm text-slate-500">请选择您要发布的作品类型</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onSelect('image')}
          className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-white mb-4">
            <ImageIcon size={28} />
          </div>
          <h3 className="text-[15px] font-bold text-slate-800 mb-1">图片作品</h3>
          <p className="text-[11px] text-slate-400">支持上传多张图片</p>
        </button>

        <button 
          onClick={() => onSelect('video')}
          className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-white mb-4">
            <Video size={28} />
          </div>
          <h3 className="text-[15px] font-bold text-slate-800 mb-1">视频作品</h3>
          <p className="text-[11px] text-slate-400">支持上传单个视频</p>
        </button>
      </div>
    </div>
  );
}

function PortfolioPage({ onBack, items, setItems }: { onBack: () => void, items: any[], setItems: (items: any[]) => void }) {
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
      onBack();
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
      
      <AnimatePresence>
        {activeItem && (
          <ActionSheet 
            item={activeItem} 
            onClose={() => setActiveItem(null)} 
            onUpdate={handleUpdate} 
            onDelete={(id: string) => setDeleteConfirmId(id)} 
            onEdit={(item: any) => {
              setEditingItem(item);
              setView('edit');
              setActiveItem(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
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

function CollectionsPage({ onBack }: { onBack: () => void }) {
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
                  whileDrag={{ scale: 1.05, zIndex: 10, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
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

function WorkSelectorModal({ availableWorks, onClose, onSelect }: { availableWorks: any[], onClose: () => void, onSelect: (works: any[]) => void }) {
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
    <>
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
    </>
  );
}

// --- Stats Page ---

function StatsPage({ onBack, orders, onViewOrder }: any) {
  const [timeRange, setTimeRange] = useState<'all' | 'week' | 'month' | 'custom'>('all');
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  
  const now = new Date();
  const filteredOrders = orders.filter((o: any) => {
    if (timeRange === 'all') return true;
    if (timeRange === 'week') return isSameWeek(o.date, now, { weekStartsOn: 1 });
    if (timeRange === 'month') return isSameMonth(o.date, now);
    if (timeRange === 'custom') {
      if (!startDate || !endDate) return true;
      return isWithinInterval(o.date, {
        start: startOfDay(parseISO(startDate)),
        end: endOfDay(parseISO(endDate))
      });
    }
    return true;
  });

  const orderCount = filteredOrders.length;
  const totalAmount = filteredOrders.reduce((sum: number, o: any) => sum + (parseFloat(o.price) || 0), 0);
  const receivedAmount = filteredOrders.reduce((sum: number, o: any) => {
    if (o.deposit === '全款') return sum + (parseFloat(o.price) || 0);
    let paid = 0;
    if (o.paidAmount) {
      paid = parseFloat(o.paidAmount) || 0;
    } else if (o.deposit && o.deposit.startsWith('已付')) {
      const match = o.deposit.match(/\d+(\.\d+)?/);
      if (match) paid = parseFloat(match[0]);
    }
    return sum + paid;
  }, 0);

  return (
    <SubPageLayout title="数据统计" onBack={onBack}>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-20">
        
        {/* Time Range Selector */}
        <div className="space-y-3">
          <div className="flex bg-slate-100/80 p-1 rounded-2xl backdrop-blur-sm">
            {[
              { id: 'all', label: '全部' },
              { id: 'week', label: '本周' },
              { id: 'month', label: '本月' },
              { id: 'custom', label: '自定义' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTimeRange(tab.id as any)}
                className={cn(
                  "flex-1 py-2 text-sm font-bold rounded-xl transition-all relative",
                  timeRange === tab.id ? "text-slate-800 shadow-sm bg-white" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <AnimatePresence>
            {timeRange === 'custom' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center space-x-2 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex-1 relative">
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-lavender-400/50"
                    />
                  </div>
                  <span className="text-slate-400 text-sm font-medium">至</span>
                  <div className="flex-1 relative">
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-lavender-400/50"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Overview Cards (1 row, 3 columns) */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-lavender-50 rounded-2xl p-4 border border-lavender-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-20 text-lavender-500">
              <Layers size={40} />
            </div>
            <div className="text-[11px] font-medium text-lavender-600 mb-2 relative z-10">订单数</div>
            <div className="flex items-baseline space-x-1 relative z-10">
              <span className="text-2xl font-bold text-lavender-900">{orderCount}</span>
              <span className="text-[10px] text-lavender-600">单</span>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-20 text-blue-500">
              <Wallet size={40} />
            </div>
            <div className="text-[11px] font-medium text-blue-600 mb-2 relative z-10">订单总额</div>
            <div className="flex items-baseline space-x-1 relative z-10">
              <span className="text-[10px] font-bold text-blue-900">¥</span>
              <span className="text-xl font-bold text-blue-900">{totalAmount}</span>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-20 text-emerald-500">
              <CheckCircle2 size={40} />
            </div>
            <div className="text-[11px] font-medium text-emerald-600 mb-2 relative z-10">已收金额</div>
            <div className="flex items-baseline space-x-1 relative z-10">
              <span className="text-[10px] font-bold text-emerald-900">¥</span>
              <span className="text-xl font-bold text-emerald-900">{receivedAmount}</span>
            </div>
          </div>
        </div>

        {/* Order List */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 px-1 flex items-center">
            <div className="w-1 h-4 bg-lavender-400 rounded-full mr-2" />
            订单明细
          </h3>
          
          {filteredOrders.length === 0 ? (
            <div className="py-10 flex flex-col items-center justify-center text-center bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
              <Layers size={32} className="text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-500">暂无订单数据</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredOrders.sort((a: any, b: any) => b.date.getTime() - a.date.getTime()).map((order: any) => (
                <div 
                  key={order.id} 
                  onClick={() => onViewOrder(order)}
                  className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center active:scale-95 transition-transform cursor-pointer group hover:border-lavender-200"
                >
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[15px] font-bold text-slate-800">{order.name}</span>
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-md font-medium",
                        order.status === 'done' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                      )}>
                        {order.status === 'done' ? '已完成' : '待完成'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 flex items-center">
                      <CalendarIcon size={12} className="mr-1 opacity-70" />
                      {format(order.date, 'yyyy-MM-dd')}
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-1">
                    <span className="text-[15px] font-bold text-rose-500">+¥{order.price || 0}</span>
                    <span className="text-[11px] text-slate-400 flex items-center">
                      {order.deposit === '全款' || order.deposit?.startsWith('已付') ? (
                        <span className="text-emerald-500 flex items-center"><CheckCircle2 size={10} className="mr-0.5" /> {order.deposit}</span>
                      ) : (
                        <span>{order.deposit}</span>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </SubPageLayout>
  );
}

// --- End Stats Page ---

function SchedulePage({ onBack, orders, toggleStatus, onAddNewOrder, onViewOrder, updateOrderStatus }: any) {
  const [tab, setTab] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isDateSelectorExpanded, setIsDateSelectorExpanded] = useState(false);

  const handleDayClick = (date: Date) => {
    const ordersForDay = orders.filter((o: any) => isSameDay(o.date, date));
    if (ordersForDay.length === 0) {
      onAddNewOrder(date);
    } else {
      setTab('list');
    }
  };

  const handleDragEnd = (e: any, { offset }: any) => {
    const swipe = offset.x;
    if (swipe < -50 && tab === 'calendar') {
      setTab('list');
    } else if (swipe > 50 && tab === 'list') {
      setTab('calendar');
    }
  };

  const currentMonthOrders = orders.filter((o: any) => isSameMonth(o.date, selectedDate));
  const totalOrders = currentMonthOrders.length;
  const totalAmount = currentMonthOrders.reduce((sum: number, o: any) => sum + (parseFloat(o.price) || 0), 0);
  
  const receivedAmount = currentMonthOrders.reduce((sum: number, o: any) => {
    if (o.deposit === '全款') return sum + (parseFloat(o.price) || 0);
    let paid = 0;
    if (o.paidAmount) {
      paid = parseFloat(o.paidAmount) || 0;
    } else if (o.deposit && o.deposit.startsWith('已付')) {
      const match = o.deposit.match(/\d+(\.\d+)?/);
      if (match) paid = parseFloat(match[0]);
    }
    return sum + paid;
  }, 0);

  const CustomTitle = (
    <div className="flex space-x-6 relative">
      <button onClick={() => setTab('calendar')} className={cn("relative pb-1 text-base transition-all", tab === 'calendar' ? "font-bold text-slate-800 scale-105" : "font-medium text-slate-400")}>
        日历
        {tab === 'calendar' && (
          <motion.div layoutId="activeTab" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-lavender-500 rounded-full" />
        )}
      </button>
      <button onClick={() => setTab('list')} className={cn("relative pb-1 text-base transition-all", tab === 'list' ? "font-bold text-slate-800 scale-105" : "font-medium text-slate-400")}>
        列表
        {tab === 'list' && (
          <motion.div layoutId="activeTab" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-lavender-500 rounded-full" />
        )}
      </button>
    </div>
  );

  return (
    <SubPageLayout title={CustomTitle} onBack={onBack} noPadding>
      <div className="overflow-hidden w-full h-full relative">
        <motion.div 
          className="flex w-[200%] h-full"
          animate={{ x: tab === 'calendar' ? '0%' : '-50%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          {/* Calendar Panel */}
          <div className="w-1/2 p-4 space-y-4 h-full overflow-y-auto pb-24">
            <CalendarView selectedDate={selectedDate} setSelectedDate={setSelectedDate} onDayClick={handleDayClick} orders={orders} />
            <div className="grid grid-cols-3 gap-2">
              <StatCard title="本月订单" value={totalOrders.toString()} unit="单" highlight />
              <StatCard title="本月总额" value={`¥${totalAmount}`} highlight />
              <StatCard title="本月已收" value={`¥${receivedAmount}`} highlight />
            </div>
          </div>

          {/* List Panel */}
          <div className="w-1/2 h-full overflow-y-auto pb-24 flex flex-col">
            
            {/* Horizontal Date Selector */}
            <AnimatePresence>
              {isDateSelectorExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex space-x-2 overflow-x-auto pt-4 pb-4 mb-2 px-4 w-full shrink-0 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
                    {eachDayOfInterval({ start: addDays(selectedDate, -2), end: addDays(selectedDate, 14) }).map(day => {
                      const isSelected = isSameDay(day, selectedDate);
                      const hasOrders = orders.some((o: any) => isSameDay(o.date, day));
                      return (
                        <button 
                          key={day.toString()}
                          onClick={() => setSelectedDate(day)}
                          className={cn(
                            "flex flex-col items-center justify-center min-w-[52px] h-[68px] rounded-2xl transition-all shrink-0 relative",
                            isSelected ? "bg-slate-800 text-white shadow-md shadow-slate-800/20" : "bg-white border border-slate-100 text-slate-500 hover:bg-slate-50"
                          )}
                        >
                          <span className={cn("text-[11px] font-medium mb-0.5", isSelected ? "text-slate-300" : "text-slate-400")}>{['日', '一', '二', '三', '四', '五', '六'][day.getDay()]}</span>
                          <span className={cn("text-[18px] font-bold", isSelected ? "text-white" : "text-slate-700")}>{format(day, 'dd')}</span>
                          {hasOrders && (
                            <div className={cn(
                              "absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full",
                              isSelected ? "bg-lavender-400" : "bg-lavender-400"
                            )} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-white px-4 pb-3 pt-3 border-b border-slate-100 shrink-0 z-10 space-y-3 mb-4 rounded-b-3xl shadow-sm">
              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center space-x-2 cursor-pointer active:scale-95 transition-transform"
                  onClick={() => setIsDateSelectorExpanded(!isDateSelectorExpanded)}
                >
                  <h3 className="text-xl font-bold text-slate-800 flex items-center">
                    {format(selectedDate, 'MM月dd日')}
                    <ChevronDown size={18} className={cn("ml-1 text-slate-400 transition-transform", isDateSelectorExpanded && "rotate-180")} />
                  </h3>
                  <div className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {orders.filter((o: any) => isSameDay(o.date, selectedDate)).length} 单
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setIsSearchExpanded(!isSearchExpanded)} 
                    className={cn("p-2 rounded-full active:scale-95 transition-colors", isSearchExpanded ? "bg-lavender-50 text-lavender-600" : "bg-slate-50 text-slate-600")}
                  >
                    <Search size={18} />
                  </button>
                  <button onClick={() => onAddNewOrder(selectedDate)} className="w-9 h-9 bg-slate-800 text-white flex items-center justify-center rounded-full shadow-md shadow-slate-800/20 active:scale-95 transition-transform">
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Collapsible Search & Filter */}
              <AnimatePresence>
                {isSearchExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center space-x-3 pt-1">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="text" 
                          placeholder="搜索客户姓名 / 妆造..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full h-9 pl-9 pr-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-lavender-400/50 transition-all text-[13px]"
                        />
                      </div>
                      <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                        <button onClick={() => setSearchQuery('')} className={cn("px-3 h-7 rounded-lg text-[12px] font-medium transition-colors", !searchQuery.startsWith('status:') ? "bg-white shadow-sm text-slate-800" : "text-slate-500")}>全部</button>
                        <button onClick={() => setSearchQuery('status:todo')} className={cn("px-3 h-7 rounded-lg text-[12px] font-medium transition-colors", searchQuery === 'status:todo' ? "bg-white shadow-sm text-lavender-600" : "text-slate-500")}>待完成</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="px-4 flex-1 overflow-y-auto">
              <OrderListView 
                orders={orders} 
                date={selectedDate}
                searchQuery={searchQuery.startsWith('status:') ? '' : searchQuery} 
                setSearchQuery={setSearchQuery} 
                showDate={true}
                filterByDate={true}
                filterStatus={searchQuery.startsWith('status:') ? searchQuery.split(':')[1] : 'all'}
                emptyMessage="今日暂无订单，点击右上角 + 快速接单"
                hideSearch={true}
                onViewOrder={onViewOrder}
                updateOrderStatus={updateOrderStatus}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </SubPageLayout>
  );
}

// --- New Components for Today Orders & Order Details ---

function TodayOrdersPage({ orders, onBack, onAddOrder, onViewOrder, updateOrderStatus }: any) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isDateSelectorExpanded, setIsDateSelectorExpanded] = useState(false);

  return (
    <SubPageLayout title="今日订单" onBack={onBack} noPadding>
      <div className="flex flex-col h-full overflow-y-auto pb-24">
        {/* Horizontal Date Selector */}
        <AnimatePresence>
          {isDateSelectorExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex space-x-2 overflow-x-auto pt-4 pb-4 mb-2 px-4 w-full shrink-0 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
                {eachDayOfInterval({ start: addDays(selectedDate, -2), end: addDays(selectedDate, 14) }).map(day => {
                  const isSelected = isSameDay(day, selectedDate);
                  const hasOrders = orders.some((o: any) => isSameDay(o.date, day));
                  return (
                    <button 
                      key={day.toString()}
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        "flex flex-col items-center justify-center min-w-[52px] h-[68px] rounded-2xl transition-all shrink-0 relative",
                        isSelected ? "bg-slate-800 text-white shadow-md shadow-slate-800/20" : "bg-white border border-slate-100 text-slate-500 hover:bg-slate-50"
                      )}
                    >
                      <span className={cn("text-[11px] font-medium mb-0.5", isSelected ? "text-slate-300" : "text-slate-400")}>{['日', '一', '二', '三', '四', '五', '六'][day.getDay()]}</span>
                      <span className={cn("text-[18px] font-bold", isSelected ? "text-white" : "text-slate-700")}>{format(day, 'dd')}</span>
                      {hasOrders && (
                        <div className={cn(
                          "absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full",
                          isSelected ? "bg-lavender-400" : "bg-lavender-400"
                        )} />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white px-4 pb-3 pt-3 border-b border-slate-100 shrink-0 z-10 space-y-3 mb-4 rounded-b-3xl shadow-sm">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-2 cursor-pointer active:scale-95 transition-transform"
              onClick={() => setIsDateSelectorExpanded(!isDateSelectorExpanded)}
            >
              <h3 className="text-xl font-bold text-slate-800 flex items-center">
                {format(selectedDate, 'MM月dd日')}
                <ChevronDown size={18} className={cn("ml-1 text-slate-400 transition-transform", isDateSelectorExpanded && "rotate-180")} />
              </h3>
              <div className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {orders.filter((o: any) => isSameDay(o.date, selectedDate)).length} 单
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsSearchExpanded(!isSearchExpanded)} 
                className={cn("p-2 rounded-full active:scale-95 transition-colors", isSearchExpanded ? "bg-lavender-50 text-lavender-600" : "bg-slate-50 text-slate-600")}
              >
                <Search size={18} />
              </button>
              <button onClick={() => onAddOrder(selectedDate)} className="w-9 h-9 bg-slate-800 text-white flex items-center justify-center rounded-full shadow-md shadow-slate-800/20 active:scale-95 transition-transform">
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Collapsible Search & Filter */}
          <AnimatePresence>
            {isSearchExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center space-x-3 pt-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="搜索客户姓名 / 妆造..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-9 pl-9 pr-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-lavender-400/50 transition-all text-[13px]"
                    />
                  </div>
                  <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                    <button onClick={() => setSearchQuery('')} className={cn("px-3 h-7 rounded-lg text-[12px] font-medium transition-colors", !searchQuery.startsWith('status:') ? "bg-white shadow-sm text-slate-800" : "text-slate-500")}>全部</button>
                    <button onClick={() => setSearchQuery('status:todo')} className={cn("px-3 h-7 rounded-lg text-[12px] font-medium transition-colors", searchQuery === 'status:todo' ? "bg-white shadow-sm text-lavender-600" : "text-slate-500")}>待完成</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-4 flex-1 overflow-y-auto">
          <OrderListView 
            orders={orders} 
            date={selectedDate}
            searchQuery={searchQuery.startsWith('status:') ? '' : searchQuery} 
            setSearchQuery={setSearchQuery} 
            showDate={true}
            filterByDate={true}
            filterStatus={searchQuery.startsWith('status:') ? searchQuery.split(':')[1] : 'all'}
            emptyMessage="今日暂无订单，点击右上角 + 快速接单"
            hideSearch={true}
            onViewOrder={onViewOrder}
            updateOrderStatus={updateOrderStatus}
          />
        </div>
      </div>
    </SubPageLayout>
  );
}

function OrderDetailPage({ order, onBack, updateOrderStatus, onEdit }: any) {
  const [statusSheetOpen, setStatusSheetOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'todo': return <span className="px-3 py-1.5 bg-lavender-50 text-lavender-600 rounded-lg text-[13px] font-bold border border-lavender-100 flex items-center"><Circle size={14} className="mr-1.5"/> 待完成</span>;
      case 'completed': return <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[13px] font-bold border border-emerald-100 flex items-center"><CheckCircle2 size={14} className="mr-1.5"/> 已完成</span>;
      case 'cancelled': return <span className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-[13px] font-bold border border-slate-200 flex items-center"><XCircle size={14} className="mr-1.5"/> 已取消</span>;
      default: return null;
    }
  };

  const getDepositBadge = (deposit: string) => {
    if (deposit === '全款') return <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[11px] font-bold border border-emerald-100">全款</span>;
    if (deposit?.startsWith('已付')) return <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[11px] font-bold border border-blue-100">{deposit}</span>;
    return <span className="px-2 py-1 bg-rose-50 text-rose-600 rounded text-[11px] font-bold border border-rose-100">{deposit || '未付定金'}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] overflow-y-auto pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 active:scale-95 transition-transform">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold text-slate-800">订单详情</h2>
        <button onClick={onEdit} className="p-2 -mr-2 text-lavender-600 font-medium text-[15px] active:scale-95 transition-transform">
          修改
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Status Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="space-y-2">
            <div>
              <p className="text-xs text-slate-400 mb-1">当前状态</p>
              <button onClick={() => setStatusSheetOpen(true)} className="active:scale-95 transition-transform">
                {getStatusBadge(order.status)}
              </button>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">定金状态</p>
              {getDepositBadge(order.deposit)}
            </div>
          </div>
          <div className="text-right flex flex-col justify-between h-full">
            <div>
              <p className="text-xs text-slate-400 mb-1">订单总额</p>
              <p className="text-2xl font-bold text-slate-800 tracking-tight">¥{order.price || '0'}</p>
            </div>
            {order.paidAmount && (
              <div className="mt-2">
                <p className="text-[10px] text-slate-400">已收金额</p>
                <p className="text-sm font-bold text-emerald-600">¥{order.paidAmount}</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
          <DetailRow icon={<CalendarIcon size={16} />} label="交付日期" value={format(order.date, 'yyyy-MM-dd')} />
          {order.time && (
            <>
              <div className="h-px bg-slate-50" />
              <DetailRow icon={<Clock size={16} />} label="具体时间" value={order.time} />
            </>
          )}
          <div className="h-px bg-slate-50" />
          <DetailRow icon={<User size={16} />} label="客户名称" value={order.name} />
          {order.type && (
            <>
              <div className="h-px bg-slate-50" />
              <DetailRow icon={<Layers size={16} />} label="订单类型" value={order.type} />
            </>
          )}
          {order.source && (
            <>
              <div className="h-px bg-slate-50" />
              <DetailRow icon={<Share2 size={16} />} label="订单来源" value={order.source} />
            </>
          )}
          {order.character && (
            <>
              <div className="h-px bg-slate-50" />
              <DetailRow icon={<Tag size={16} />} label="角色名称" value={order.character} />
            </>
          )}
        </div>

        {/* Contact & Address Card */}
        {(order.contact || order.wechat || order.isOnSite) && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
            {order.contact && (
              <DetailRow 
                icon={<Phone size={16} />} 
                label="联系电话" 
                value={
                  <a href={`tel:${order.contact}`} className="text-blue-500 hover:text-blue-600 underline decoration-blue-200 underline-offset-2">
                    {order.contact}
                  </a>
                } 
              />
            )}
            {order.contact && order.wechat && <div className="h-px bg-slate-50" />}
            {order.wechat && (
              <DetailRow icon={<MessageSquare size={16} />} label="微信号" value={order.wechat} />
            )}
            {(order.contact || order.wechat) && order.isOnSite && <div className="h-px bg-slate-50" />}
            {order.isOnSite && (
              <>
                <DetailRow icon={<MapPin size={16} />} label="是否上门" value="是" />
                {order.address && (
                  <>
                    <div className="h-px bg-slate-50" />
                    <DetailRow icon={<MapPin size={16} className="opacity-0" />} label="上门地址" value={order.address} />
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* Notes Card */}
        {(order.notes || (order.images && order.images.length > 0)) && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center text-slate-700 font-bold text-[15px]">
              <MessageSquare size={16} className="mr-2 text-lavender-500" /> 备注信息
            </div>

            {order.notes && (
              <p className="text-[14px] text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
                {order.notes}
              </p>
            )}

            {order.images && order.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {order.images.map((img: string, i: number) => (
                  <img key={i} src={img} className="w-20 h-20 rounded-xl object-cover border border-slate-100 shadow-sm" referrerPolicy="no-referrer" />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Action Sheet */}
      <AnimatePresence>
        {statusSheetOpen && [
            <motion.div 
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setStatusSheetOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />,
            <motion.div 
              key="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-4 pb-8 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
              <h3 className="text-center text-[15px] font-bold text-slate-800 mb-6">修改订单状态</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => { updateOrderStatus(order.id, 'todo'); setStatusSheetOpen(false); }}
                  className="w-full py-4 rounded-2xl bg-lavender-50 text-lavender-600 font-bold text-[15px] flex items-center justify-center space-x-2 active:scale-[0.98] transition-transform"
                >
                  <Circle size={18} /> <span>待化妆</span>
                </button>
                <button 
                  onClick={() => { updateOrderStatus(order.id, 'completed'); setStatusSheetOpen(false); }}
                  className="w-full py-4 rounded-2xl bg-emerald-50 text-emerald-600 font-bold text-[15px] flex items-center justify-center space-x-2 active:scale-[0.98] transition-transform"
                >
                  <CheckCircle2 size={18} /> <span>已完成</span>
                </button>
                <button 
                  onClick={() => { updateOrderStatus(order.id, 'cancelled'); setStatusSheetOpen(false); }}
                  className="w-full py-4 rounded-2xl bg-slate-50 text-slate-600 font-bold text-[15px] flex items-center justify-center space-x-2 active:scale-[0.98] transition-transform"
                >
                  <XCircle size={18} /> <span>已取消</span>
                </button>
              </div>
            </motion.div>
          ]
        }
      </AnimatePresence>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center text-slate-500 text-[14px]">
        <span className="mr-2 opacity-70">{icon}</span>
        {label}
      </div>
      <div className="text-[15px] font-medium text-slate-800 text-right max-w-[60%] truncate">
        {value}
      </div>
    </div>
  );
}

// --- Conventions Page ---

function ConventionsPage({ onBack, conventions, setConventions }: { onBack: () => void, conventions: any[], setConventions: (c: any[]) => void }) {
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
      setConventions(conventions.map(c => c.id === editingId ? { ...c, ...formData } : c));
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
    setConventions(conventions.filter(c => c.id !== id));
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
          conventions.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).map(conv => {
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

function CategoriesPage({ onBack, categories, setCategories, portfolios, setPortfolios }: any) {
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
            {categories.map((cat: string) => (
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
            {categories.map((cat: string, index: number) => (
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