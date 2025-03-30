import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './edit_brand.css';

Modal.setAppElement('#root');

const EditBrand = ({ isOpen, onRequestClose, onSave, brand }) => {
    const [brandName, setBrandName] = useState('');

    useEffect(() => {
        setBrandName(brand ? brand.brand_name : ''); 
    }, [brand]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...brand, brand_name: brandName });
        onRequestClose(); // Đóng modal sau khi lưu
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Thêm hoặc Sửa Thương Hiệu"
            className="edit-brand-modal"
            overlayClassName="edit-brand-overlay"
        >
            <h2 className="edit-brand-title">{brand ? 'Sửa Thương Hiệu' : 'Thêm Thương Hiệu'}</h2>
            <form onSubmit={handleSubmit} className="edit-brand-form">
                <label className="edit-brand-label">
                    Tên Thương Hiệu:
                    <input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        required
                        className="edit-brand-input"
                    />
                </label>
                <button type="submit" className="edit-brand-btn-save">Lưu</button>
                <button type="button" onClick={onRequestClose} className="edit-brand-btn-cancel">Hủy</button>
            </form>
        </Modal>
    );
};

export default EditBrand;
