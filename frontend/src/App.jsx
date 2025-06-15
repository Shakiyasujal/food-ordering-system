import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import ContactPage from './pages/ContactPage/ContactPage'
import AboutPage from './pages/AboutPage/AboutPage'
import Menu from './pages/Menu/Menu'
import Cart from './pages/Cart/Cart'
import Login from './components/Login/Login'
import SignUp from './components/SignUp/SignUp'
import PrivateRoute from './components/PrivateRoute/PrivateRoute'
import VerifyPaymentPage from './pages/VerifyPaymentPage/VerifyPaymentPage'
import CheckoutPage from './pages/CheckoutPage/CheckoutPage'
import MyOrderPage from './pages/MyOrderPage/MyOrderPage'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/contact' element={<ContactPage />} />
      <Route path='/about' element={<AboutPage />} />
      <Route path='/menu' element={<Menu />} />

      <Route path='/login' element={<Home />} />
      <Route path='/signup' element={<SignUp />} />

      {/* payment verification */}
      <Route path='/myorder/verify' element={<VerifyPaymentPage />}></Route>

      <Route path='/cart' element={
        <PrivateRoute>
          <Cart />
        </PrivateRoute>
      } />

      <Route path='/checkout' element={<PrivateRoute>
        <CheckoutPage />
      </PrivateRoute>}>
      </Route>
      <Route path='/myorder' element={<PrivateRoute><MyOrderPage /></PrivateRoute>}></Route>
    </Routes>
  )
}

export default App
