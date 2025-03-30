// src/components/Admin/CategoryList.jsx
import React, { useState, useEffect } from 'react';
import EditCategory from './edit_category';
import './categorylist.css';
import { FaEdit, FaTrash } from 'react-icons/fa'; 

const CategoryList = () => {
    const [categories, setCategories] = useState([]); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null); 

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/admin/categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Lỗi khi lấy danh mục:', error);
        }
    };

    const handleAddCategory = () => {
        setCurrentCategory(null); // Đặt về null để thêm mới
        setIsModalOpen(true);
    };

    const handleEditCategory = (category) => {
        setCurrentCategory(category);
        setIsModalOpen(true);
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
            try {
                await fetch(`http://localhost:8080/api/admin/categories/${id}`, {
                    method: 'DELETE',
                });
                setCategories(categories.filter((category) => category.cate_id !== id));
            } catch (error) {
                console.error('Lỗi khi xóa danh mục:', error);
            }
        }
    };

    const handleSaveCategory = async (category) => {
        if (category.cate_id) {
            // Cập nhật
            try {
                const response = await fetch(`http://localhost:8080/api/admin/categories/${category.cate_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ cate_name: category.cate_name }),
                });
                const updatedCategory = await response.json();
                setCategories(categories.map((c) => (c.cate_id === updatedCategory.cate_id ? updatedCategory : c)));
            } catch (error) {
                console.error('Lỗi khi cập nhật danh mục:', error);
            }
        } else {
            // Thêm mới
             // Thêm mới
             try {
                const newCategory = { cate_id: `cate-${categories.length + 1}`, cate_name: categories.cate_name };
                const response = await fetch('http://localhost:8080/api/admin/categories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newCategory),
                });
                const addedCategory = await response.json();
                setCategories([...categories, addedCategory]);
            } catch (error) {
                console.error('Lỗi khi thêm danh mục:', error);
            }
        }
        setIsModalOpen(false);
    };

    return (
        <div className="category-list">
            <h2>Quản Lý Danh Mục</h2>
            <button onClick={handleAddCategory} className="btn-add">Thêm Danh Mục</button>
            <table className="category-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Danh Mục</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category.cate_id}>
                            <td>{category.cate_id}</td>
                            <td>{category.cate_name}</td>
                            <td>
                                <button onClick={() => handleEditCategory(category)} ><FaEdit /></button>
                                <button onClick={() => handleDeleteCategory(category.cate_id)} ><FaTrash /></button> 
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <EditCategory
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    onSave={handleSaveCategory}
                    category={currentCategory}
                />
            )}
        </div>
    );
};

export default CategoryList;
