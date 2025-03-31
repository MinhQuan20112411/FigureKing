import React, { useState, useEffect } from 'react';
import Products from '../components/Products';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';
import banner4 from '../assets/banner4.png';
import banner5 from '../assets/banner5.png';

const banners = [banner1, banner2, banner3, banner4, banner5];

const Home = ({ allProducts, filteredProducts, addToCart }) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [fade, setFade] = useState(true); // Trạng thái mờ dần

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Bắt đầu làm mờ
      setTimeout(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
        setFade(true); // Hiển thị lại
      }, 500); // Delay 0.5 giây để mượt hơn
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : allProducts;

  return (
    <div style={{ paddingTop: '70px' }}>
      {/* Banner */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '600px', 
        overflow: 'hidden' 
      }}>
        <img 
          src={banners[currentBanner]} 
          alt={`Banner ${currentBanner + 1}`} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain', 
            display: 'block', 
            opacity: fade ? 1 : 0,  // Hiệu ứng mờ dần
            transition: 'opacity 0.5s ease-in-out' 
          }} 
        />
      </div>

      {/* Nội dung */}
      <div style={{ padding: '70px', color: 'black', textAlign: 'center' }}>
        <h1>Chào mừng đến với nơi </h1>
        <p>Khám phá những mô hình tuyệt đẹp </p>
      </div>

      <div>
        <Products allProducts={displayProducts} addToCart={addToCart} /> 
      </div>
    </div>
  );
};

export default Home;
