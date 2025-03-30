import React, { useState } from 'react';
import './edit_product.css';

const EditProduct = ({ product, brands, categories, onSave, onClose }) => {
    const [productName, setProductName] = useState(product?.product_name || '');
    const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');
    const [price, setPrice] = useState(product?.cost || 0);
    const [quantity, setQuantity] = useState(product?.quantity || 0);
    const [brandId, setBrandId] = useState(product?.brand_id || '');
    const [categoryId, setCategoryId] = useState(product?.cate_id || '');
    const [description, setDescription] = useState(product?.description || 0);
    const [imageFile, setImageFile] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            setImageUrl(URL.createObjectURL(file));
        }
    };

    const formatPrice = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const handlePriceChange = (event) => {
        const value = event.target.value.replace(/[^0-9]/g, ''); 
        setPrice(value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newProduct = {
            product_id: product?.product_id || null,
            product_name: productName,
            cost: Number(price.replace(/[^0-9]/g, '')),
            quantity,
            // brand_id: brandId,
            cate_id: categoryId,
            description, // Thêm description
        };

        if (!productName || newProduct.cost <= 0 || quantity < 0  || !categoryId) {
            alert('Vui lòng điền đầy đủ thông tin sản phẩm.');
            return;
        }

        try {
            const formData = new FormData();
            if (imageFile) {
                formData.append('image', imageFile, imageFile.name); 
            }
            Object.keys(newProduct).forEach(key => {
                formData.append(key, newProduct[key]);
            });

            const method = product?.product_id ? 'PUT' : 'POST';
            const url = `http://localhost:8080/api/admin/products${product?.product_id ? `/${product.product_id}` : ''}`;

            const response = await fetch(url, {
                method: method,
                body: formData,
            });

            if (!response.ok) {
                const errorResponse = await response.text();
                console.error('Error response:', errorResponse);
                alert('Có lỗi xảy ra: ' + errorResponse);
                return;
            }

            const resultText = await response.text();
            console.log('Response Text:', resultText);
            if (resultText) {
                const result = JSON.parse(resultText);
                onSave(result);
            } else {
                console.error('Phản hồi từ server trống.');
                alert('Phản hồi từ server trống.');
            }
        } catch (error) {
            console.error('Lỗi Fetch:', error);
            alert('Đã xảy ra lỗi khi gửi yêu cầu: ' + error.message);
        }
    };

    return (
        <div className="edit-product-modal">
            <form onSubmit={handleSubmit}>
                <h2>{Object.keys(product).length === 0 ? 'Thêm Sản Phẩm' : 'Sửa Sản Phẩm'}</h2>
                <label>
                    Tên Sản Phẩm:
                    <input 
                        type="text" 
                        value={productName} 
                        onChange={event => setProductName(event.target.value)} 
                        required 
                    />
                </label>
                <label>
                    Hình Ảnh:
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                    />
                    {imageUrl && <img src={imageUrl} alt="Preview" style={{ width: '100px', height: 'auto' }} />}
                </label>
                <label>
                    Giá:
                    <input 
                        type="text" 
                        value={formatPrice(price)} 
                        onChange={handlePriceChange} 
                        required 
                    />
                </label>
                <label>
                    Số Lượng:
                    <input 
                        type="number" 
                        value={quantity} 
                        onChange={event => setQuantity(Number(event.target.value))} 
                        required 
                    />
                </label>
                {/* <label>
                    Thương Hiệu:
                    <select 
                        value={brandId} 
                        onChange={event => setBrandId(event.target.value)} 
                        required
                    >
                        <option value="">Chọn Thương Hiệu</option>
                        {brands.map(brand => (
                            <option key={brand.brand_id} value={brand.brand_id}>
                                {brand.brand_name}
                            </option>
                        ))}
                    </select>
                </label> */}
                <label>
                    Danh Mục:
                    <select 
                        value={categoryId} 
                        onChange={event => setCategoryId(event.target.value)} 
                        required
                    >
                        <option value="">Chọn Danh Mục</option>
                        {categories.map(category => (
                            <option key={category.cate_id} value={category.cate_id}>
                                {category.cate_name}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Mô Tả:
                    <textarea
                        value={description}
                        onChange={event => setDescription(event.target.value)}
                        rows="4"
                        required
                    />
                </label>
                <button type="submit">Lưu</button>
                <button type="button" onClick={onClose}>Đóng</button>
            </form>
        </div>
    );
};

export default EditProduct;
