import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './edit_category.css';

Modal.setAppElement('#root');

const EditCategory = ({ isOpen, onRequestClose, onSave, category }) => {
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        setCategoryName(category ? category.cate_name : '');
    }, [category]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...category, cate_name: categoryName });
        toast.success(category ? 'Sửa danh mục thành công!' : 'Thêm danh mục thành công!');
        onRequestClose();
    };

    const handleDelete = () => {
        if (category) {
            toast.success('Xóa danh mục thành công!');
            onRequestClose();
        } else {
            toast.error('Không có danh mục nào để xóa!');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Thêm hoặc Sửa Danh Mục"
            className="edit-category-modal"
            overlayClassName="edit-category-overlay"
        >
            <h2 className="edit-category-title">{category ? 'Sửa Danh Mục' : 'Thêm Danh Mục'}</h2>
            <form onSubmit={handleSubmit} className="edit-category-form">
                <label className="edit-category-label">
                    Tên Danh Mục:
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                        className="edit-category-input"
                    />
                </label>
                <button type="submit" className="edit-category-btn-save">Lưu</button>
                <button type="button" onClick={onRequestClose} className="edit-category-btn-cancel">Hủy</button>
            </form>
        </Modal>
    );
};

export default EditCategory;
