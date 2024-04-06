import './App.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Products from './Components/Products';
import Checkout from './Components/Checkout';
import { Toaster } from 'react-hot-toast';
import OrderConfirm from './Components/OrderConfirm';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id/" element={<Products />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<OrderConfirm />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
