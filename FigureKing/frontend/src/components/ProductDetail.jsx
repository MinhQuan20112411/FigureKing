import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faStar } from '@fortawesome/free-solid-svg-icons';
import './ProductDetail.css';
import Cookies from 'js-cookie';

const images = require.context('../assets', false, /\.(png|jpe?g|svg)$/);

const ProductDetail = ({ 
  selectedProduct, 
  brandName, 
  categoryName, 
  closePopup, 
  handleAddToCart, 
  showProductDetail, 
  onProductClick 
}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const popupRef = useRef(null);
  const scrollProducts = (direction) => {
  const container = document.querySelector('.product-detail-related-products-list');
  const scrollAmount = direction === 'left' ? -200 : 200;
  
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };
  
 // Lấy danh sách đánh giá khi sản phẩm được chọn
 useEffect(() => {
  if (selectedProduct) {
    let viewedProducts = Cookies.get('viewedProducts');
    viewedProducts = viewedProducts ? JSON.parse(viewedProducts) : [];

    // Kiểm tra trùng lặp, nếu có thì xóa để đưa lên đầu danh sách
    viewedProducts = viewedProducts.filter(p => p.product_id !== selectedProduct.product_id);

    // Thêm sản phẩm vào đầu danh sách
    viewedProducts.unshift({
      product_id: selectedProduct.product_id,
      cate_id: selectedProduct.cate_id,
    });

    // Giới hạn chỉ lưu tối đa 10 sản phẩm gần nhất
    if (viewedProducts.length > 10) {
      viewedProducts.pop();
    }

    // Lưu vào cookie trong 7 ngày
    Cookies.set('viewedProducts', JSON.stringify(viewedProducts), { expires: 7 });
  }
}, [selectedProduct]);

// Hàm gửi đánh giá
const handleReviewSubmit = () => {
  const acc_id = localStorage.getItem('acc_id'); // Lấy acc_id từ localStorage

  if (!acc_id) {
    alert('Vui lòng đăng nhập để gửi đánh giá');
    return;
  }

  // Kiểm tra nếu người dùng chưa nhập đủ thông tin
  if (!rating) {
    alert('Vui lòng chọn số sao để đánh giá!');
    return;
  }

  fetch('http://localhost:5000/api/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      acc_id: acc_id,
      product_id: selectedProduct.product_id,
      rating,
      comment: review,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Đánh giá đã được gửi:', data);
      setReview(''); // Xóa nội dung đánh giá
      setRating(0); // Reset số sao

      // Hiển thị thông báo thành công
      alert('Đánh giá của bạn đã được gửi thành công!');

      // Tải lại danh sách đánh giá
      fetch(`http://localhost:5000/api/reviews/${selectedProduct.product_id}`)
        .then((response) => response.json())
        .then((data) => {
          setReviews(data); // Cập nhật lại danh sách đánh giá
        })
        .catch((error) => {
          console.error('Lỗi khi tải lại đánh giá:', error);
        });
    })
    .catch((error) => {
      console.error('Có lỗi xảy ra khi gửi đánh giá:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại!');
    });
};


  useEffect(() => {
    if (selectedProduct && selectedProduct.cate_id) {
        fetch(`http://localhost:5000/api/products/category_id/${selectedProduct.cate_id}`)
            .then(response => response.json())
            .then(data => {
                // Lọc sản phẩm liên quan
                const filteredRelatedProducts = data.filter(product => product.product_id !== selectedProduct.product_id);
                setRelatedProducts(filteredRelatedProducts);
            })
            .catch(error => {
                console.error("Lỗi khi lấy sản phẩm liên quan:", error);
            });
    }
}, [selectedProduct]);


  return (
    <div className={`product-detail-popup ${showProductDetail ? 'active' : ''}`}>
      <div ref={popupRef} className="product-detail-popup-content">
        <span className="product-detail-popup-close" onClick={closePopup}>
          <FontAwesomeIcon icon={faTimes} />
        </span>

        <div className="product-detail-container">
          {/* Cột 1: Ảnh sản phẩm */}
          <div className="product-detail-image">
            <img 
              src={images(`./${selectedProduct?.imageUrl}`)} 
              alt={selectedProduct?.product_name} 
            />
          </div>

          {/* Cột 2: Thông tin sản phẩm */}
          <div className="product-detail-info">
            <h3>{selectedProduct?.product_name}</h3>
            <p><strong>Thương hiệu:</strong> {brandName || 'Chưa có thương hiệu'}</p>
            <p><strong>Danh mục:</strong> {categoryName || 'Chưa có danh mục'}</p>
            <p><strong>Mô tả:</strong> {selectedProduct?.description || 'Không có mô tả'}</p>
            <p><strong>Giá:</strong> {selectedProduct?.cost.toLocaleString('vi-VN')} VND</p>
            <p><strong>Số lượng tồn kho:</strong> {selectedProduct?.quantity || 0}</p>

            {/* Thêm vào giỏ hàng */}
            <div className="product-detail-popup-buttons">
              <button onClick={() => handleAddToCart(selectedProduct)}>
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
          {/* Sản phẩm liên quan */}
          <div className="product-detail-related-products">
            <h4>Sản phẩm cùng danh mục:</h4>
            <div className="product-detail-related-products-container">
              <button className="slider-button left" onClick={() => scrollProducts('left')}>
                &#8592; {/* Mũi tên trái */}
              </button>
                  <div className="product-detail-related-products-list">
                  {relatedProducts.length > 0 ? (
            relatedProducts.map((product) => (
            <div 
                key={product.product_id} 
                className="product-detail-related-product"
                onClick={() => onProductClick(product)}  // Thêm sự kiện nhấp vào sản phẩm
            >
                <img 
                src={images(`./${product.imageUrl}`)} 
                alt={product.product_name} 
                className="product-detail-related-product-image" 
                />
                <p>{product.product_name}</p>
                <p>{product.cost.toLocaleString('vi-VN')} VND</p>
            </div>
            ))
        ) : (
            <p>Không có sản phẩm liên quan.</p>
        )}
        </div>
        <button className="slider-button right" onClick={() => scrollProducts('right')}>
        &#8594; {/* Mũi tên phải */}
        </button>
    </div>
    </div>


        <div className="product-detail-rating">
        <h4>Đánh giá sản phẩm:</h4>
        <div className="product-detail-rating-stars">
            {[...Array(5)].map((_, index) => (
            <FontAwesomeIcon 
                key={index} 
                icon={faStar} 
                className={`product-detail-star ${index < rating ? 'product-detail-star-filled' : ''}`} 
                onClick={() => setRating(index + 1)} 
            />
            ))}
        </div>
        <textarea 
            placeholder="Nhập đánh giá của bạn..." 
            value={review} 
            onChange={(e) => setReview(e.target.value)} 
        />
        <button className="product-detail-review-button" onClick={handleReviewSubmit}>Gửi đánh giá</button>

       {/* Hiển thị các đánh giá của người dùng */}
        <div className="reviews-list">
        {reviews.length > 0 ? (
            reviews.map((review) => (
            <div key={review.review_id} className="review-item">
                <div className="review-rating">
                {[...Array(review.rating)].map((_, index) => (
                    <FontAwesomeIcon key={index} icon={faStar} className="product-detail-star-filled" />
                ))}
                </div>
                <p className="review-comment">{review.comment}</p>
                <div className="review-footer">
                <span className="review-username">{review.full_name}</span> {/* Hiển thị tên đầy đủ */}
                <span className="review-date">{new Date(review.review_date).toLocaleDateString()}</span>
                </div>
            </div>
            ))
        ) : (
            <p>Chưa có đánh giá cho sản phẩm này.</p>
        )}


          </div>
        </div>
      </div>
    </div>
  
  );
};

export default ProductDetail;
