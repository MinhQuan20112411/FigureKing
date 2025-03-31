import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/HomePage';
import About from './pages/AboutPage';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Products from './components/Products';
import AuthPopup from './components/AuthPopup';
import CheckoutPage from './components/CheckoutPage';
import OrderHistory from './components/OrderHistory';
import BrandProducts from './components/BrandProducts';
import CategoryProducts from './components/CategoryProduct';
import SearchPage from './pages/SearchPage'; // Thêm SearchPage

function App() {
  const [cartItems, setCartItems] = useState([]); // Quản lý giỏ hàng
  const [allProducts, setAllProducts] = useState([]); // Quản lý tất cả sản phẩm
  const [filteredProducts, setFilteredProducts] = useState([]); // Quản lý các sản phẩm đã lọc
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Quản lý trạng thái Popup

  const acc_id = localStorage.getItem('acc_id');
  

  // Lấy danh sách sản phẩm khi ứng dụng khởi chạy
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setAllProducts(data);
        setFilteredProducts(data); // Ban đầu hiển thị tất cả sản phẩm
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = async (productId, quantity = 1) => {
    try {
      const acc_id = localStorage.getItem('acc_id');
      console.log('acc_id:', acc_id);
      if (!acc_id) {
        console.error('User not logged in');
        return;
      }
      console.log('Sending request to add product to cart with product_id:', productId.product_id, 'quantity:', quantity, 'acc_id:', acc_id);
      const response = await fetch('http://localhost:5000/api/addcart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId.product_id,
          quantity,
          acc_id: acc_id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response from server:', data);
        setCartItems((prevItems) => {
          const existingProduct = prevItems.find((item) => item.product_id === productId.product_id);
          if (existingProduct) {
            return prevItems.map((item) =>
              item.product_id === productId.product_id
                ? { ...item, quantity: existingProduct.quantity + quantity }
                : item
            );
          } else {
            return [...prevItems, { product_id: productId.product_id, quantity }];
          }
        });
      } else {
        console.error('Failed to add/update product in cart');
        const errorData = await response.json();
        console.error('Error response from server:', errorData);
      }
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
    }
  };

  // Mở popup đăng nhập/đăng ký
  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  // Đóng popup đăng nhập/đăng ký
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // Lọc sản phẩm theo danh mục
  const filterProductsByCategory = (categoryName) => {
    const filtered = allProducts.filter((product) => product.category === categoryName);
    setFilteredProducts(filtered);
  };

  // Lọc sản phẩm theo thương hiệu
  const filterProductsByBrand = (brandName) => {
    const filtered = allProducts.filter((product) => product.brand === brandName);
    setFilteredProducts(filtered);
  };
  

  return (
    <Router>
      <div>
        {/* Navbar với các tính năng liên quan đến giỏ hàng và popup */}
        <Navbar
          cartItems={cartItems}
          setCartItems={setCartItems}
          allProducts={allProducts}
          setFilteredProducts={setFilteredProducts}
          onOpenPopup={handleOpenPopup}
        />
        <Routes>
          {/* Trang chủ */}
          <Route
            path="/"
            element={<Home allProducts={allProducts} filteredProducts={filteredProducts} addToCart={addToCart} />}
          />
          {/* Trang giới thiệu */}
          <Route path="/about" element={<About />} />
          {/* Trang danh sách sản phẩm */}
          <Route
            path="/products"
            element={<Products allProducts={allProducts} filteredProducts={filteredProducts} addToCart={addToCart} />}
          />
          {/* Trang tìm kiếm */}
          <Route
            path="/search"
            element={<SearchPage allProducts={allProducts} filteredProducts={filteredProducts} addToCart={addToCart} />}
          />
          {/* Trang thanh toán */}
          <Route path="/checkout" element={<CheckoutPage />} />
          {/* Trang lịch sử đơn hàng với userId */}
          <Route path="/order-history" element={<OrderHistory userId={acc_id} />} />
          {/* Trang sản phẩm theo thương hiệu */}
          <Route
            path="/brand-product/:brand_name"
            element={<BrandProducts filterProducts={filterProductsByBrand} addToCart={addToCart} />}
          />
          {/* Trang sản phẩm theo danh mục */}
          <Route
            path="/category-product/:cate_name"
            element={<CategoryProducts filterProducts={filterProductsByCategory} addToCart={addToCart} />}
          />
        </Routes>
        {/* Footer */}
        <Footer />
        {/* Popup đăng nhập/đăng ký */}
        <AuthPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
      </div>
    </Router>
  );
}

export default App;