import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext'; // Import the provider

// Components
import TopBar from './components/TopBar';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Stats from './components/Stats';
import Products from './components/Products';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import ProductDetails from './components/ProductDetails'; // Import the new page
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AllProductsPage from './components/AllProductsPage';
import ContactPage from './components/ContactPage';
import Presence from './components/Presence';
import ScrollToTop from './components/ScrollToTop';

// Create a Home Component to hold the Landing Page sections
const Home = () => (
  <>
    <Hero />
    <AboutUs />
    <Stats />
    <Products />
    <Testimonials />
  </>
);

function App() {
  return (
    <CartProvider>
      <Router>
              <ScrollToTop />
        <div className="font-sans antialiased text-gray-900 bg-white">
          <TopBar />
          <Header />
          
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<AllProductsPage />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} /> 
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/presence" element={<Presence />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;