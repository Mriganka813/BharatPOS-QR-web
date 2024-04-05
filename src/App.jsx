import './App.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Products from './Components/Products';
import Checkout from './Components/Checkout';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id/" element={<Products />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
