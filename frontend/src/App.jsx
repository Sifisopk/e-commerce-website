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

//forgot password
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';

import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import { useUserStore } from './stores/useUserStore';
import { useEffect } from 'react';
import {useCartStore} from './stores/useCartStore';
import { useSettingsStore } from './stores/useSettingsStore';
import { useCategoryStore } from './stores/useCategoryStore';

function App() {
const {user, checkAuth,checkingAuth } = useUserStore();
const {getCartItems} = useCartStore();
const {fetchSettings} = useSettingsStore();
const {fetchCategories} = useCategoryStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	// load the announcement bar settings at the same time as the login check, so the bar doesn't pop in late
	useEffect(() => {
		fetchSettings();
	}, [fetchSettings]);

	// categories (homepage tiles and the product form) are loaded at the same time
	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

  useEffect(() =>{
    if(!user) return;
      getCartItems();
    
  },[getCartItems,user]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    // overflow-x-clip (not overflow-hidden) so the sticky navbar keeps working
    <div className='flex min-h-screen flex-col overflow-x-clip bg-white text-ink'>
      <AnnouncementBar />
      <Navbar />

      <main className='flex-grow'>
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
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='/reset-password/:token' element={<ResetPasswordPage />} />
          <Route path='/verify-email/:token' element={<VerifyEmailPage />} />
        </Routes>
      </main>

      <Footer />
      <Toaster
        toastOptions={{
          duration: 6000,
          success: {
            duration: 6000,
          },
          error: {
            duration: 6000,
          },
        }}
      />
    </div>
  )
}
export default App
