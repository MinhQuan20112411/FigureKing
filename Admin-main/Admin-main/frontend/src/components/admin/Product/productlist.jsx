import React, { useState, useEffect } from 'react';
import ProductCard from './product_card'; 
import EditProduct from './edit_product'; 
import './productlist.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    
    useEffect(() => {
        fetchProductsAndCategories();
    }, []);

    const fetchProductsAndCategories = async () => {
        const [productResponse, brandResponse, categoryResponse] = await Promise.all([
            fetch('http://localhost:8080/api/admin/products'),
            fetch('http://localhost:8080/api/admin/brands'),
            fetch('http://localhost:8080/api/admin/categories'),
        ]);
    
        const [productsData, brandsData, categoriesData] = await Promise.all([
            productResponse.json(),
            brandResponse.json(),
            categoryResponse.json(),
        ]);
    
        setProducts(productsData.map(product => ({
            ...product,
            description: product.description || 'Không có mô tả' // Gán giá trị mặc định
        })));
        setBrands(brandsData);
        setCategories(categoriesData);
    };
    

    const handleEdit = (product) => {
        setEditingProduct(product);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            const response = await fetch(`http://localhost:8080/api/admin/products/${productId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setProducts(products.filter(product => product.product_id !== productId));
                alert('Sản phẩm đã được xóa thành công!');
            } else {
                alert('Có lỗi xảy ra khi xóa sản phẩm.');
            }
        }
    };

    const handleSave = (updatedProduct) => {
        if (updatedProduct.product_id) {
            setProducts(products.map(product => 
                product.product_id === updatedProduct.product_id ? updatedProduct : product
            ));
        } else {
            setProducts([...products, updatedProduct]); // Thêm sản phẩm mới
        }
        setEditingProduct(null);
    };

    const handleAddProduct = () => {
        setEditingProduct({ 
            product_name: '', 
            cost: '', 
            quantity: 0, 
            brand_id: '', 
            cate_id: '', 
            description: '' // Thêm trường description
        });
    };

    return (
        <div className="product-list">
            <h2>Danh Sách Sản Phẩm</h2>
            <button className="add-product-button" onClick={handleAddProduct}>Thêm Sản Phẩm</button>
            <div className="product-cards">
                {products.map(product => (
                    <ProductCard 
                        key={product.product_id} 
                        product={product} 
                        onEdit={handleEdit} 
                        onDelete={handleDelete} 
                    />
                ))}
            </div>
            {editingProduct && (
                <EditProduct 
                    product={editingProduct} 
                    brands={brands} 
                    categories={categories} 
                    onSave={handleSave} 
                    onClose={() => setEditingProduct(null)} 
                />
            )}
        </div>
    );
};

export default ProductList;
