import React, { useState, useEffect } from 'react';
import ProductCard from './product_card';
import EditProduct from './edit_product';
import './productlist.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // Danh sách sản phẩm sau khi lọc
  const [editingProduct, setEditingProduct] = useState(null);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState(''); // Từ khóa tìm kiếm

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

    const mappedProducts = productsData.map((product) => ({
      ...product,
      description: product.description || 'Không có mô tả',
    }));
    setProducts(mappedProducts);
    setFilteredProducts(mappedProducts); // Ban đầu, danh sách lọc bằng danh sách đầy đủ
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
        const updatedProducts = products.filter((product) => product.product_id !== productId);
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts); // Cập nhật danh sách lọc sau khi xóa
        alert('Sản phẩm đã được xóa thành công!');
        if (currentProducts.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        alert('Có lỗi xảy ra khi xóa sản phẩm.');
      }
    }
  };

  const handleSave = (updatedProduct) => {
    if (updatedProduct.product_id) {
      const updatedProducts = products.map((product) =>
        product.product_id === updatedProduct.product_id ? updatedProduct : product
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    } else {
      const newProducts = [...products, updatedProduct];
      setProducts(newProducts);
      setFilteredProducts(newProducts);
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
      description: '',
    });
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm

    if (query === '') {
      setFilteredProducts(products); // Nếu không có từ khóa, hiển thị tất cả sản phẩm
    } else {
      const filtered = products.filter((product) =>
        product.product_name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    }
  };

  // Tính toán phân trang dựa trên danh sách đã lọc
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="product-list">
      <h2>Danh Sách Sản Phẩm</h2>
      <div className="product-list-controls">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
        <button className="add-product-button" onClick={handleAddProduct}>
          Thêm Sản Phẩm
        </button>
      </div>
      <div className="product-cards">
        {currentProducts.map((product) => (
          <ProductCard
            key={product.product_id}
            product={product}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Phân trang */}
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