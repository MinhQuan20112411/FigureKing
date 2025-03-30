import React, { useState } from 'react';
import CategoryList from './Category/categorylist';
import BrandList from './Brand/brandlist';
import ProductList from './Product/productlist';
import UserList from './User/ManageUser'; // Import quản lý user
import OrderList from './Order/OrderList'; // Import quản lý đơn hàng
import './admin.css';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('categories');

    const renderContent = () => {
        switch (activeTab) {
            case 'categories':
                return <CategoryList />;
            case 'brands':
                return <BrandList />;
            case 'products':
                return <ProductList />;
            case 'users': 
                return <UserList />;
            case 'orders': 
                return <OrderList />;
            default:
                return <CategoryList />;
        }
    };

    return (
        <div className="admin-container">
            <nav className="admin-nav">
                <ul className="admin-nav-list">
                    <li 
                        className={`admin-nav-item ${activeTab === 'categories' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('categories')}
                    >
                        <a href="#" onClick={(e) => e.preventDefault()}>Quản Lý Danh Mục</a>
                    </li>
                    {/* <li 
                        className={`admin-nav-item ${activeTab === 'brands' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('brands')}
                    >
                        <a href="#" onClick={(e) => e.preventDefault()}>Quản Lý Thương Hiệu</a>
                    </li> */}
                    <li 
                        className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('products')}
                    >
                        <a href="#" onClick={(e) => e.preventDefault()}>Quản Lý Sản Phẩm</a>
                    </li>
                    <li 
                        className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('users')}
                    >
                        <a href="#" onClick={(e) => e.preventDefault()}>Quản Lý Người Dùng</a>
                    </li>
                    <li 
                        className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('orders')}
                    >
                        <a href="#" onClick={(e) => e.preventDefault()}>Quản Lý Đơn Hàng</a>
                    </li>
                </ul>
            </nav>
            <div className="admin-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default Admin;
