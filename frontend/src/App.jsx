import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import SignupPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import LoadingSpinner from './components/LoadingSpinner';
import AdminPage from './pages/AdminPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import PurchaseSuccessPage from './pages/PurchaseSuccessPage';
import PurchaseCancelPage from './pages/PurchaseCancelPage';
import ProductPage from './pages/ProductPage';
import EditProductPage from './pages/EditProductPage';
import TrackOrderPage from './pages/TrackOrderPage';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import { useUserStore } from './stores/useUserStore';
import { useEffect } from 'react';
import {useCartStore} from './stores/useCartStore';

function App() {
const {user, checkAuth,checkingAuth } = useUserStore();
const {getCartItems} = useCartStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

  useEffect(() =>{
    if(!user) return;
      getCartItems();
    
  },[getCartItems,user]);

  if (checkingAuth) return <LoadingSpinner />;

  return (

      <div className='min-h-screen bg-white text-gray-900 relative overflow-hidden flex flex-col'>
			{/* start of background accent */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.08)_0%,rgba(220,38,38,0.03)_45%,rgba(255,255,255,0)_100%)]' />
      </div>
      {/* end of background accent */}

<div className="relative z-10 pt-20 flex-grow flex flex-col">
      <Navbar />
      <div className='flex-grow'>
      <Routes>
        <Route path="/" element={<Homepage  />} /> 
        <Route path="/signup" element={!user ? <SignupPage/> : <Navigate to='/' />} />
        <Route path="/login" element={!user ? <LoginPage/> : <Navigate to='/' />} />
        <Route path='/secret-dashboard' element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />}/>
        <Route path='/secret-dashboard/edit/:id' element={user?.role === "admin" ? <EditProductPage /> : <Navigate to='/login' />} />
        <Route path='/category/:category' element={<CategoryPage />} />
        <Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
        <Route path='/purchase-success' element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />} />
        <Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
        <Route path='/product/:id' element={<ProductPage />} />
        <Route path='/track-order' element={<TrackOrderPage />} />
      </Routes>
      </div>
      <Footer />
    </div>
    <Toaster />
    </div>
  )
  


}
export default App