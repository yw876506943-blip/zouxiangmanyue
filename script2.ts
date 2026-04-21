import fs from 'fs';

const file = 'src/pages/Workbench.tsx';
let content = fs.readFileSync(file, 'utf8');

const pagesStr = `
  const goToOrderDetail = (order: any, backRoute: string) => {
    setSelectedOrder(order);
    setPreviousPage(backRoute);
    navigate(\`/workbench/order_detail/\${order.id}\`);
  };

  return (
    <Routes>
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
          onEdit={() => navigate(\`/workbench/edit_order/\${selectedOrder?.id}\`)}
        />
      } />
      <Route path="/edit_order/:id" element={
        <SubPageLayout title="修改订单" onBack={() => navigate(-1)}>
          <NewOrderForm 
            initialDate={selectedOrder ? selectedOrder.date : new Date()} 
            orders={orders} 
            initialData={selectedOrder}
            onSave={(updatedOrder: any) => {
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
            onSave={(newOrder: any) => {
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

      <Route path="/" element={
        <div className="p-4 space-y-2 pb-8">`;

// Note: I will replace `  return (\n    <div className="p-4 space-y-2 pb-8">` with this.

content = content.replace("  return (\n    <div className=\"p-4 space-y-2 pb-8\">", pagesStr);

// Now the close tags for `<Routes>` around `div className="p-4 ...` need to be updated.
content = content.replace("  const goToOrderDetail = (order: any, backRoute: string) => {\n    setSelectedOrder(order);\n    setPreviousPage(backRoute);\n    navigate(`/workbench/order_detail/${order.id}`);\n  };\n\n", "");
content = content.replace("  const goToOrderDetail = (order: any, current: PageState) => {\n    setSelectedOrder(order);\n    setPreviousPage(current);\n    setActivePage('order_detail');\n  };\n", "");

let endTag = `      <ShareModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        profile={profile} 
      />
    </div>
  );`;

content = content.replace(endTag, endTag.replace("  );", "      }\n      />\n    </Routes>\n  );"));

fs.writeFileSync(file, content);
console.log('Fixed Workbench router');
