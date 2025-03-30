import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa'; 
import './navbar.css';

const Navbar = ({ cartItemCount }) => {  
    return (
        <nav className="navbar">
            <div className="container">
                <div className="logo">FIGURE KING</div>
                <ul className="nav-links">
                    <li><Link to="/admin">ADMIN</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
