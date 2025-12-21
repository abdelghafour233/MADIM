
import React, { useState, useEffect } from 'react';
import { View, Product, Category, Order, Settings } from './types.ts';
import { INITIAL_PRODUCTS } from './constants.tsx';
import Navbar from './components/Navbar.tsx';
import Home from './components/Home.tsx';
import ProductDetail from './components/ProductDetail.tsx';
import Cart from './components/Cart.tsx';
import Checkout from './components/Checkout.tsx';
import Dashboard from './components/Dashboard.tsx';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<Settings>({
    fbPixel: '',
    googleAnalytics: '',
    tiktokPixel: '',
    googleSheetsWebhook: '',
    domain: 'myshop.com',
    nameServer: 'ns1.hosting.com'
  });

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const savedOrders = localStorage.getItem('orders');
    const savedSettings = localStorage.getItem('settings');
    
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    else setProducts(INITIAL_PRODUCTS);

    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    alert('تمت إضافة المنتج إلى السلة');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const placeOrder = async (customerData: { name: string; city: string; phone: string }) => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      customerName: customerData.name,
      city: customerData.city,
      phone: customerData.phone,
      items: cart.map(i => ({ productId: i.product.id, quantity: i.quantity, name: i.product.name, price: i.product.price })),
      total: cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0),
      date: new Date().toISOString(),
      status: 'pending'
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setCart([]);
    setCurrentView('home');
    alert('تم إرسال طلبك بنجاح! سنتصل بك قريباً.');

    if (settings.googleSheetsWebhook) {
      try {
        await fetch(settings.googleSheetsWebhook, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOrder)
        });
      } catch (e) {
        console.error('Failed to sync with Google Sheets', e);
      }
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <Home 
            products={products} 
            onProductClick={(p) => { setSelectedProduct(p); setCurrentView('product'); }}
            onCategoryClick={(c) => { setSelectedCategory(c); setCurrentView('category'); }}
          />
        );
      case 'category':
        return (
          <Home 
            products={products.filter(p => p.category === selectedCategory)} 
            onProductClick={(p) => { setSelectedProduct(p); setCurrentView('product'); }}
            onCategoryClick={(c) => { setSelectedCategory(c); setCurrentView('category'); }}
            filterLabel={selectedCategory || ''}
          />
        );
      case 'product':
        return selectedProduct ? (
          <ProductDetail 
            product={selectedProduct} 
            onAddToCart={addToCart} 
            onBack={() => setCurrentView('home')} 
          />
        ) : null;
      case 'cart':
        return (
          <Cart 
            items={cart} 
            onRemove={removeFromCart} 
            onUpdateQty={updateCartQuantity}
            onCheckout={() => setCurrentView('checkout')}
          />
        );
      case 'checkout':
        return <Checkout total={cart.reduce((acc, i) => acc + (i.product.price * i.quantity), 0)} onPlaceOrder={placeOrder} />;
      case 'dashboard':
        return (
          <Dashboard 
            orders={orders} 
            settings={settings} 
            products={products}
            onUpdateSettings={(s) => { setSettings(s); localStorage.setItem('settings', JSON.stringify(s)); }}
            onUpdateProducts={(p) => { setProducts(p); localStorage.setItem('products', JSON.stringify(p)); }}
          />
        );
      default:
        return <Home products={products} onProductClick={() => {}} onCategoryClick={() => {}} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        currentView={currentView} 
        setView={setCurrentView} 
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)} 
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderView()}
      </main>
      <footer className="bg-gray-900 text-white py-8 text-center">
        <p>© 2024 متجر المغرب الحديث. جميع الحقوق محفوظة.</p>
        <p className="mt-2 text-gray-400 text-sm">أفضل المنتجات بأفضل الأسعار في المملكة المغربية</p>
      </footer>
    </div>
  );
};

export default App;
