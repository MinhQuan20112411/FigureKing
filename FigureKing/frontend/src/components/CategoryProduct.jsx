import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons';
import './products.css'; // Import CSS từ Product.jsx
import ProductDetail from './ProductDetail'; 

// Cách yêu cầu hình ảnh từ thư mục assets
const images = require.context('../assets', false, /\.(png|jpe?g|svg)$/);

const CategoryProducts = ({ addToCart }) => {
  const { cate_name } = useParams(); // Lấy tên danh mục từ URL params
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [showProductDetail, setShowProductDetail] = useState(false); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem); // Thay 'displayProducts' bằng 'products'
  const totalPages = Math.ceil(products.length / itemsPerPage); // Thay 'displayProducts' bằng 'products'

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const closePopup = () => {
    setSelectedProduct(null);
    setCategoryName('');
    setShowProductDetail(false); // Đóng popup khi đóng
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    closePopup(); // Đóng popup sau khi thêm sản phẩm vào giỏ hàng
  };

  // Hàm xử lý định dạng giá tiền
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN'); // Định dạng theo chuẩn Việt Nam (dấu phẩy phân cách hàng nghìn)
  };

  // Fetch tên danh mục từ API
  const fetchCategoryName = async (cateId) => {
    try {
        const response = await fetch(`http://localhost:5000/api/category/${cateId}`);
        if (!response.ok) {
            throw new Error(`Lỗi khi lấy tên danh mục: ${response.statusText}`);
        }
        const data = await response.json();
        setCategoryName(data.cate_name); // Lưu tên danh mục vào state
    } catch (error) {
        console.error('Lỗi khi lấy tên danh mục', error);
        setCategoryName('Chưa có danh mục');
    }
  };

  // Hàm mở popup chi tiết sản phẩm
  const openPopup = (product) => {
    setSelectedProduct(product);
    fetchCategoryName(product.cate_id); // Fetch tên danh mục
    setShowProductDetail(true); // Hiển thị popup chi tiết sản phẩm
  };

  // Fetch sản phẩm theo danh mục
  useEffect(() => {
    setLoading(true);
    const decodedCateName = decodeURIComponent(cate_name); // Giải mã tên danh mục nếu có ký tự %20
    fetch(`http://localhost:5000/api/products/category/${decodedCateName}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setError('Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại.');
      })
      .finally(() => setLoading(false));
  }, [cate_name]);

  if (loading) {
    return <div>Đang tải sản phẩm...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="products-grid">
        {currentItems.length > 0 ? (
          currentItems.map(product => (
            <div key={product.product_id} className="product-card">
              <img 
                src={images(`./${product.imageUrl}`)} 
                alt={product.product_name} 
                onClick={() => openPopup(product)} 
              />
              <h3>{product.product_name}</h3>
              <p>{formatPrice(product.cost)} VND</p> {/* Hiển thị giá tiền đã định dạng */}
              
            
              <div className="add-to-cart-icon" onClick={() => handleAddToCart(product)}>
                <button class="custom-buy-button">Mua</button>
              </div>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm nào.</p>
        )}
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

      {selectedProduct && showProductDetail && (
        <ProductDetail 
          selectedProduct={selectedProduct} 
          categoryName={categoryName}
          closePopup={closePopup}
          handleAddToCart={handleAddToCart} 
        />
      )}
    </div>
  );
};

export default CategoryProducts;
