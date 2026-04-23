import React, { useState } from 'react';
import { SubPageLayout } from '@/src/components/SubPageLayout';
import { Calendar as CalendarIcon, Layers, Wallet, CheckCircle2 } from '@/src/lib/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isSameWeek, isSameMonth, startOfMonth, endOfMonth, isWithinInterval, startOfDay, endOfDay, parseISO } from 'date-fns';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';

export function StatsPage({ orders, onViewOrder }: any) {
  const navigate = useNavigate();
  const onBack = () => navigate('/workbench');

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
