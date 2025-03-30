import React from 'react';
import './product_card.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

// Sử dụng require.context nếu vẫn cần
const images = require.context('../../../../../../../FigureKing/frontend/src/assets', false, /\.(png|jpe?g|svg)$/);

const ProductCard = ({ product, onEdit, onDelete }) => {
    let imageSrc;
    try {
        imageSrc = product.imageUrl 
            ? images(`./${product.imageUrl}`) 
            : images('./default-image.png'); // Ảnh mặc định
    } catch (error) {
        console.error('Image not found:', product.imageUrl);
        imageSrc = '/default-image.png'; // Ảnh fallback
    }

    return (
        <div className="product-card">
            <img src={imageSrc} alt={product.product_name || "No image available"} />
            <h3>{product.product_name}</h3>
            <p>Giá: {parseFloat(product.cost).toLocaleString()} VND</p>
            <p>Số Lượng: {product.quantity}</p>
            <p>Thương Hiệu: {product.brand_name}</p>
            <p>Danh Mục: {product.cate_name}</p>
            {/* Hiển thị mô tả */}
            <p className="product-description">Mô Tả: {product.description || 'Không có mô tả.'}</p>
            <div className="product-actions">
                <button onClick={() => onEdit(product)}><FaEdit /></button>
                <button onClick={() => onDelete(product.product_id)}><FaTrash /></button>
            </div>
        </div>
    );
};

export default ProductCard;
