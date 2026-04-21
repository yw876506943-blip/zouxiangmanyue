import fs from 'fs';

const file = 'src/pages/Workbench.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add imports
const imports = `import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { CategoriesPage } from './WorkbenchCategories';
import { CollectionsPage } from './WorkbenchCollections';
import { ConventionsPage } from './WorkbenchConventions';
import { PortfolioPage } from './WorkbenchPortfolio';
import { StatsPage } from './WorkbenchStats';
`;
content = content.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';\n" + imports);

// 2. Add useNavigate to Workbench
content = content.replace("export function Workbench({ categories, setCategories, profile }: any) {\n  const [activePage, setActivePage] = useState('main');", "export function Workbench({ categories, setCategories, profile }: any) {\n  const navigate = useNavigate();\n  const location = useLocation();\n  const [activePage, setActivePage] = useState('main');");

// 3. Instead of using `activePage` checks to EARLY RETURN, let's just create a huge <Routes> around the main content!
// The main content starts with "return (\n    <div className=\"bg-[#f8fafc] min-h-screen pb-24 font-sans text-slate-800\">"
// Wait no, earlier returns look like this:
/*
  if (activePage === 'conventions') {
    return <ConventionsPage onBack={() => setActivePage('main')} conventions={conventions} setConventions={setConventions} />;
  }
*/

const pagesStr = `
      <Route path="/conventions" element={<ConventionsPage onBack={() => navigate('/workbench')} conventions={conventions} setConventions={setConventions} />} />
      <Route path="/today" element={
        <TodayOrdersPage 
          orders={orders} 
          onBack={() => navigate('/workbench')}
          onAddOrder={() => {
            setNewOrderDate(new Date());
            navigate('/workbench/new_order');
          }}
          onViewOrder={(order: any) => goToOrderDetail(order, '/workbench/today')}
          updateOrderStatus={updateOrderStatus}
        />
      } />
      <Route path="/order_detail/:id" element={
        <OrderDetailPage 
          order={selectedOrder}
          onBack={() => navigate(previousPage || '/workbench')}
          updateOrderStatus={updateOrderStatus}
          onEdit={() => navigate(\`/workbench/edit_order/\${selectedOrder.id}\`)}
        />
      } />
      <Route path="/edit_order/:id" element={
        <SubPageLayout title="修改订单" onBack={() => navigate(-1)}>
          <NewOrderForm 
            initialDate={selectedOrder?.date || new Date()} 
            orders={orders} 
            initialData={selectedOrder}
            onSave={(updatedOrder) => {
              setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
              setSelectedOrder(updatedOrder);
              navigate(-1);
            }} 
          />
        </SubPageLayout>
      } />
      <Route path="/schedule" element={
        <SchedulePage 
          onBack={() => navigate('/workbench')} 
          orders={orders} 
          toggleStatus={toggleStatus} 
          onAddNewOrder={(date: Date) => {
            setNewOrderDate(date);
            navigate('/workbench/new_order');
          }}
          onViewOrder={(order: any) => goToOrderDetail(order, '/workbench/schedule')}
          updateOrderStatus={updateOrderStatus}
        />
      } />
      <Route path="/new_order" element={
        <SubPageLayout title="新建订单" onBack={() => navigate('/workbench')}>
          <NewOrderForm 
            initialDate={newOrderDate} 
            orders={orders}
            onSave={(newOrder) => {
              setOrders([...orders, newOrder]);
              navigate('/workbench');
            }} 
          />
        </SubPageLayout>
      } />
      <Route path="/portfolio" element={<PortfolioPage onBack={() => navigate('/workbench')} items={portfolios} setItems={setPortfolios} />} />
      <Route path="/collections" element={<CollectionsPage onBack={() => navigate('/workbench')} />} />
      <Route path="/categories" element={<CategoriesPage onBack={() => navigate('/workbench')} categories={categories} setCategories={setCategories} portfolios={portfolios} setPortfolios={setPortfolios} />} />
      <Route path="/stats" element={<StatsPage onBack={() => navigate('/workbench')} orders={orders} onViewOrder={(order: any) => goToOrderDetail(order, '/workbench/stats')} />} />
`;

content = content.replace(/  \/\/ --- Sub-pages ---[\s\S]*?(?=  const getDaysUntil = )/, `

  const goToOrderDetail = (order: any, backRoute: string) => {
    setSelectedOrder(order);
    setPreviousPage(backRoute);
    navigate(\`/workbench/order_detail/\${order.id}\`);
  };

`);

// Now replace the main return
const mainReturnStart = `  return (
    <div className="bg-[#f8fafc] min-h-screen pb-24 font-sans text-slate-800">`;

const mainReturnReplacement = `  return (
    <Routes>
      ${pagesStr}
      <Route path="/" element={
        <div className="bg-[#f8fafc] min-h-screen pb-24 font-sans text-slate-800">`;

content = content.replace(mainReturnStart, mainReturnReplacement);

// We need to close the <Routes> component at the end of the Workbench component.
// The Workbench component ends right before "// --- Shared Sub-components ---" or similar.
// Wait, the end of Workbench component is marked by `export function Workbench` closure.
// Let's find the closing tag for the main return. It ends before `function MenuItem`
const endOfWorkbench = `      {/* Status Action Sheet */}
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
                    onClick={() => { updateOrderStatus(statusSheetOrder.id, 'todo'); setStatusSheetOrder(null); }}
                    className="w-full py-4 rounded-2xl bg-lavender-50 text-lavender-600 font-bold text-[15px] flex items-center justify-center space-x-2 active:scale-[0.98] transition-transform"
                  >
                    <Circle size={18} /> <span>待化妆</span>
                  </button>
                  <button 
                    onClick={() => { updateOrderStatus(statusSheetOrder.id, 'completed'); setStatusSheetOrder(null); }}
                    className="w-full py-4 rounded-2xl bg-emerald-50 text-emerald-600 font-bold text-[15px] flex items-center justify-center space-x-2 active:scale-[0.98] transition-transform"
                  >
                    <CheckCircle2 size={18} /> <span>已完成</span>
                  </button>
                  <button 
                    onClick={() => { updateOrderStatus(statusSheetOrder.id, 'cancelled'); setStatusSheetOrder(null); }}
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
    </div>`;

content = content.replace(endOfWorkbench, endOfWorkbench + `\n      }\n      />\n    </Routes>`);

// Replace all setActivePage('...') with navigate('/workbench/...') inside Workbench Main UI
content = content.replace(/setActivePage\('new_order'\)/g, "navigate('/workbench/new_order')");
content = content.replace(/setActivePage\('conventions'\)/g, "navigate('/workbench/conventions')");
content = content.replace(/setActivePage\('today'\)/g, "navigate('/workbench/today')");
content = content.replace(/setActivePage\('schedule'\)/g, "navigate('/workbench/schedule')");
content = content.replace(/setActivePage\('portfolio'\)/g, "navigate('/workbench/portfolio')");
content = content.replace(/setActivePage\('collections'\)/g, "navigate('/workbench/collections')");
content = content.replace(/setActivePage\('categories'\)/g, "navigate('/workbench/categories')");
content = content.replace(/setActivePage\('stats'\)/g, "navigate('/workbench/stats')");

// Also there was goToOrderDetail(order, 'main') which passed a back route.
content = content.replace(/goToOrderDetail\(order, 'main'\)/g, "goToOrderDetail(order, '/workbench')");

fs.writeFileSync(file, content);
console.log('Workbench rewritten to use React Router');
