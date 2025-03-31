import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './SearchPage.css';
import ProductDetail from '../components/ProductDetail'; // Import ProductDetail component

const SearchPage = ({ allProducts, addToCart }) => {
  const [results, setResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // State cho sản phẩm được chọn
  const [brandName, setBrandName] = useState(''); // State cho tên thương hiệu
  const [categoryName, setCategoryName] = useState(''); // State cho tên danh mục
  const [showProductDetail, setShowProductDetail] = useState(false); // State để hiển thị popup
  const location = useLocation();

  // Lọc sản phẩm dựa trên query từ URL
  useEffect(() => {
    const query = new URLSearchParams(location.search).get('query');
    if (query) {
      const filtered = allProducts.filter((product) =>
        product.product_name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [location.search, allProducts]);

  // Hàm định dạng giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  // Hàm xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = (product) => {
    addToCart(product);
    closePopup(); // Đóng popup sau khi thêm vào giỏ hàng
  };

  // Hàm xử lý khi click vào sản phẩm
  const onProductClick = (product) => {
    setSelectedProduct(product); // Cập nhật sản phẩm được chọn
    fetchBrandName(product.brand_id); // Lấy tên thương hiệu
    fetchCategoryName(product.cate_id); // Lấy tên danh mục
    setShowProductDetail(true); // Hiển thị popup chi tiết sản phẩm
  };

  // Hàm đóng popup
  const closePopup = () => {
    setSelectedProduct(null);
    setBrandName('');
    setCategoryName('');
    setShowProductDetail(false);
  };

  // Hàm lấy tên thương hiệu từ API
  const fetchBrandName = async (brandId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/brands/${brandId}`);
      if (!response.ok) {
        throw new Error(`Lỗi khi lấy tên thương hiệu: ${response.statusText}`);
      }
      const data = await response.json();
      setBrandName(data.brand_name);
    } catch (error) {
      console.error('Lỗi khi lấy tên thương hiệu', error);
      setBrandName('Chưa có thương hiệu');
    }
  };

  // Hàm lấy tên danh mục từ API
  const fetchCategoryName = async (cateId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/category/${cateId}`);
      if (!response.ok) {
        throw new Error(`Lỗi khi lấy tên danh mục: ${response.statusText}`);
      }
      const data = await response.json();
      setCategoryName(data.cate_name);
    } catch (error) {
      console.error('Lỗi khi lấy tên danh mục', error);
      setCategoryName('Chưa có danh mục');
    }
  };

  // Hàm xử lý đường dẫn hình ảnh
  const images = (imagePath) => {
    try {
      return require(`../assets/${imagePath}`);
    } catch (error) {
      console.error('Error loading image:', error);
      return 'placeholder-image.jpg'; // Hình ảnh mặc định nếu lỗi
    }
  };

  return (
    <div className="search-page">
      <h2>Kết quả tìm kiếm</h2>
      <div className="products-grid">
        {results.length > 0 ? (
          results.map((product) => (
            <div key={product.product_id} className="product-card">
              <img
                src={images(product.imageUrl)}
                alt={product.product_name}
                onClick={() => onProductClick(product)}
              />
              <h3>{product.product_name}</h3>
              <p>{formatPrice(product.cost)} VND</p>
              <div className="add-to-cart-icon" onClick={() => handleAddToCart(product)}>
                <button className="custom-buy-button">Mua</button>
              </div>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm nào.</p>
        )}
      </div>

      {/* Hiển thị popup chi tiết sản phẩm nếu có sản phẩm được chọn */}
      {selectedProduct && showProductDetail && (
        <ProductDetail
          selectedProduct={selectedProduct}
          brandName={brandName}
          categoryName={categoryName}
          closePopup={closePopup}
          handleAddToCart={handleAddToCart}
          onProductClick={onProductClick}
          showProductDetail={showProductDetail}
        />
      )}
    </div>
  );
};

export default SearchPage;