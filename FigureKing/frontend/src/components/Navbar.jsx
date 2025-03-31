import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import AuthPopup from './AuthPopup';
import CartPopup from './CartPopup';
import { FaShoppingCart, FaUserCircle, FaSearch, FaBars, FaSignOutAlt, FaHistory } from 'react-icons/fa';
import logo from '../assets/logo.png';

const Navbar = ({ cartItems, setCartItems, setFilteredProducts, allProducts }) => {
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    if (loggedUser) {
      setUser(loggedUser);
    }

    const fetchCategoriesAndBrands = async () => {
      try {
        const categoryResponse = await fetch('http://localhost:5000/api/category');
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);

        const brandResponse = await fetch('http://localhost:5000/api/brands');
        const brandData = await brandResponse.json();
        setBrands(brandData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu danh mục và thương hiệu:", error);
      }
    };

    fetchCategoriesAndBrands();
  }, []);

  // Lọc gợi ý sản phẩm dựa trên searchQuery
  useEffect(() => {
    if (searchQuery.trim() && allProducts) {
      const filteredSuggestions = allProducts
        .filter((product) =>
          product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5); // Giới hạn 5 gợi ý
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, allProducts]);

  const toggleProductDropdown = () => {
    setProductDropdownOpen(!productDropdownOpen);
    if (brandDropdownOpen) setBrandDropdownOpen(false);
  };

  const toggleBrandDropdown = () => {
    setBrandDropdownOpen(!brandDropdownOpen);
    if (productDropdownOpen) setProductDropdownOpen(false);
  };

  const openLoginPopup = () => {
    if (!user) {
      setIsLoginPopupOpen(true);
    }
  };

  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
  };

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.menu-container') && !event.target.closest('.search-bar')) {
        setMenuOpen(false);
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const openCartPopup = () => setIsCartPopupOpen(true);
  const closeCartPopup = () => setIsCartPopupOpen(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSuggestions([]);
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
  };

  const handleCategoryFilter = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products?category=${categoryId}`);
      const data = await response.json();
      setFilteredProducts(data);
      console.log(`Sản phẩm theo danh mục: ${categoryId}`);
    } catch (error) {
      console.error("Lỗi khi lọc sản phẩm theo danh mục:", error);
    }
  };

  const handleSuggestionClick = (productName) => {
    setSearchQuery(productName);
    setSuggestions([]);
    navigate(`/search?query=${encodeURIComponent(productName)}`);
  };

  // Hàm xử lý đường dẫn hình ảnh (giả định)
  const getImageUrl = (imageUrl) => {
    try {
      return require(`../assets/${imageUrl}`); // Điều chỉnh theo cách bạn lưu trữ hình ảnh
    } catch (error) {
      console.error('Error loading image:', error);
      return 'placeholder-image.jpg'; // Hình ảnh mặc định nếu lỗi
    }
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo StyleHub" />
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <FaSearch className="search-icon" onClick={handleSearch} />
          {/* Dropdown gợi ý sản phẩm với hình ảnh */}
          {suggestions.length > 0 && (
            <ul className="search-suggestions">
              {suggestions.map((product) => (
                <li
                  key={product.product_id}
                  onClick={() => handleSuggestionClick(product.product_name)}
                  className="suggestion-item"
                >
                  <img
                    src={getImageUrl(product.imageUrl)} // Giả định có thuộc tính imageUrl
                    alt={product.product_name}
                    className="suggestion-image"
                  />
                  <span>{product.product_name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <ul className="nav-links">
          <li><Link to="/">TRANG CHỦ</Link></li>
          <li className="dropdown" 
            onMouseEnter={() => setProductDropdownOpen(true)} 
            onMouseLeave={() => setProductDropdownOpen(false)}>
            <Link to="#">DANH MỤC SẢN PHẨM</Link>
            {productDropdownOpen && (
              <ul className="dropdown-menu">
                {categories.map(category => (
                  <li key={category.cate_name}>
                    <Link to={`/category-product/${category.cate_name}`}>{category.cate_name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li><Link to="/about">VỀ CHÚNG TÔI</Link></li>
        </ul>
        <div className="user-actions">
          <div className="cart-icon" onClick={openCartPopup}>
            <FaShoppingCart className="icon" />
            {cartItems.length > 0 && (
              <span className="cart-count">
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </div>
          {user ? (
            <div className="user-info">
              <span className="welcome-text">Xin chào, {user.last_name}!</span>
              <div className="menu-container">
                <button
                  className="menu-toggle"
                  onClick={() => setMenuOpen((prev) => !prev)}
                >
                  <FaBars className="menu-icon" />
                </button>
                {menuOpen && (
                  <ul className="menu-dropdown">
                    <li>
                      <Link to="/order-history" className="menu-item-history">
                        <FaHistory className="menu-icon" /> Lịch sử đặt hàng
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="menu-item logout-btn">
                        <FaSignOutAlt className="menu-icon" /> Đăng xuất
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <Link to="#" onClick={openLoginPopup} className="login-link">
              <FaUserCircle className="icon" /> ĐĂNG NHẬP
            </Link>
          )}
        </div>
      </nav>
      {isLoginPopupOpen && <AuthPopup isOpen={isLoginPopupOpen} onClose={closeLoginPopup} />}
      {isCartPopupOpen && (
        <CartPopup
          isOpen={isCartPopupOpen}
          onClose={closeCartPopup}
          cartItems={cartItems}
          setCartItems={setCartItems}
        />
      )}
    </header>
  );
};

export default Navbar;