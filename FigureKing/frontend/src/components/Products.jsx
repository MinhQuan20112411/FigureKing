import React, { useState, useEffect } from 'react';
import './products.css';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import ProductDetail from './ProductDetail';
import Cookies from 'js-cookie';

// Sử dụng require.context để lấy tất cả hình ảnh
const images = require.context('../assets', false, /\.(png|jpe?g|svg)$/);

const Products = ({ allProducts = [], filteredProducts = [], addToCart, categories = [], brands = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [brandName, setBrandName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [viewedProducts, setViewedProducts] = useState([]); // Thêm state cho lịch sử sản phẩm đã xem

  // Logic cho gợi ý sản phẩm (giữ nguyên)
  useEffect(() => {
    const viewedProductsCookie = Cookies.get('viewedProducts');
    if (viewedProductsCookie) {
      const parsedProducts = JSON.parse(viewedProductsCookie);
      const lastViewed = parsedProducts[0];

      if (lastViewed) {
        fetch(`http://localhost:5000/api/products/category_id/${lastViewed.cate_id}`)
          .then(response => response.json())
          .then(data => {
            const filtered = data.filter(p => p.product_id !== lastViewed.product_id);
            const categorySuggestions = filtered.slice(0, 2);

            const otherCategories = [...new Set(parsedProducts
              .filter(p => p.cate_id !== lastViewed.cate_id)
              .map(p => p.cate_id)
            )];

            let otherSuggestions = [];
            Promise.all(otherCategories.slice(0, 5).map(cate_id =>
              fetch(`http://localhost:5000/api/products/category_id/${cate_id}`)
                .then(res => res.json())
                .then(otherData => {
                  const filteredOther = otherData.filter(p => !parsedProducts.some(vp => vp.product_id === p.product_id));
                  return filteredOther.slice(0, 2);
                })
            )).then(results => {
              otherSuggestions = results.flat();
              setRecommendedProducts([...categorySuggestions, ...otherSuggestions]);
            });
          })
          .catch(error => console.error('Lỗi khi lấy sản phẩm gợi ý:', error));
      }

      // Lấy thông tin chi tiết của các sản phẩm đã xem từ cookie
      const productIds = parsedProducts.map(p => p.product_id).slice(0, 8); // Giới hạn 8 sản phẩm
      Promise.all(productIds.map(id =>
        fetch(`http://localhost:5000/api/products/${id}`)
          .then(res => res.json())
      )).then(results => {
        setViewedProducts(results); // Cập nhật danh sách sản phẩm đã xem
      }).catch(error => console.error('Lỗi khi lấy sản phẩm đã xem:', error));
    }
  }, []);

  const onProductClick = (product) => {
    setSelectedProduct(product);
    fetchBrandName(product.brand_id);
    fetchCategoryName(product.cate_id);
    setShowProductDetail(true);
  };

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : allProducts;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = displayProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(displayProducts.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const closePopup = () => {
    setSelectedProduct(null);
    setBrandName('');
    setCategoryName('');
    setShowProductDetail(false);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    closePopup();
  };

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN');
  };

  const fetchBrandName = async (brandId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/brands/${brandId}`);
      if (!response.ok) throw new Error(`Lỗi khi lấy tên thương hiệu: ${response.statusText}`);
      const data = await response.json();
      setBrandName(data.brand_name);
    } catch (error) {
      console.error('Lỗi khi lấy tên thương hiệu', error);
      setBrandName('Chưa có thương hiệu');
    }
  };

  const fetchCategoryName = async (cateId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/category/${cateId}`);
      if (!response.ok) throw new Error(`Lỗi khi lấy tên danh mục: ${response.statusText}`);
      const data = await response.json();
      setCategoryName(data.cate_name);
    } catch (error) {
      console.error('Lỗi khi lấy tên danh mục', error);
      setCategoryName('Chưa có danh mục');
    }
  };

  return (
    <div>
      {recommendedProducts.length > 0 && (
        <div className="recommended-products">
          <h2>Gợi ý cho bạn</h2>
          <div className="products-grid">
            {recommendedProducts.map(product => (
              <div key={product.product_id} className="product-card">
                <img 
                  src={images(`./${product.imageUrl}`)} 
                  alt={product.product_name} 
                  onClick={() => onProductClick(product)} 
                />
                <h3>{product.product_name}</h3>
                <p>{formatPrice(product.cost)} VND</p>
                <div className="add-to-cart-icon" onClick={() => handleAddToCart(product)}>
                  <button className="custom-buy-button">Mua</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="all-products">
        <h2>Tất Cả Sản Phẩm</h2>
        <div className="products-grid">
          {currentItems.length > 0 ? (
            currentItems.map(product => (
              <div key={product.product_id} className="product-card">
                <img 
                  src={images(`./${product.imageUrl}`)} 
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
      </div>

      <div className="pagination">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
            disabled={totalPages === 1}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Phần lịch sử sản phẩm đã xem */}
      {viewedProducts.length > 0 && (
        <div className="viewed-products">
          <h2>Lịch sử sản phẩm đã xem</h2>
          <div className="products-grid">
            {viewedProducts.map(product => (
              <div key={product.product_id} className="product-card">
                <img 
                  src={images(`./${product.imageUrl}`)} 
                  alt={product.product_name} 
                  onClick={() => onProductClick(product)} 
                />
                <h3>{product.product_name}</h3>
                <p>{formatPrice(product.cost)} VND</p>
                <div className="add-to-cart-icon" onClick={() => handleAddToCart(product)}>
                  <button className="custom-buy-button">Mua</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedProduct && showProductDetail && (
        <ProductDetail 
          selectedProduct={selectedProduct} 
          brandName={brandName} 
          categoryName={categoryName}
          closePopup={closePopup}
          handleAddToCart={handleAddToCart} 
          onProductClick={onProductClick} 
          showProductDetail={showProductDetail} // Truyền prop showProductDetail
        />
      )}
    </div>
  );
};

export default Products;