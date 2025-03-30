import React, { useState, useEffect } from 'react';
import EditBrand from './edit_brand'; 
import './brandlist.css';
import { FaEdit, FaTrash } from 'react-icons/fa'; 

const BrandList = () => {
    const [brands, setBrands] = useState([]); // Lưu trữ danh sách thương hiệu
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBrand, setCurrentBrand] = useState(null); // Thương hiệu hiện tại để chỉnh sửa

    // Lấy danh sách thương hiệu từ API khi component được mount
    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/admin/brands');
            const data = await response.json();
            setBrands(data);
        } catch (error) {
            console.error('Lỗi khi lấy thương hiệu:', error);
        }
    };

    const handleAddBrand = () => {
        setCurrentBrand(null); // Đặt về null để thêm mới
        setIsModalOpen(true);
    };

    const handleEditBrand = (brand) => {
        setCurrentBrand(brand);
        setIsModalOpen(true);
    };

    const handleDeleteBrand = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này không?')) return;

        try {
            await fetch(`http://localhost:8080/api/admin/brands/${id}`, {
                method: 'DELETE',
            });
            setBrands(brands.filter((brand) => brand.brand_id !== id));
        } catch (error) {
            console.error('Lỗi khi xóa thương hiệu:', error);
        }
    };

    const handleSaveBrand = async (brand) => {
        if (brand.brand_id) {
            // Cập nhật
            try {
                const response = await fetch(`http://localhost:8080/api/admin/brands/${brand.brand_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ brand_name: brand.brand_name }), // Cập nhật theo tên thương hiệu
                });
                const updatedBrand = await response.json();
                setBrands(brands.map((b) => (b.brand_id === updatedBrand.id ? updatedBrand : b)));
            } catch (error) {
                console.error('Lỗi khi cập nhật thương hiệu:', error);
            }
        } else {
            // Thêm mới
            try {
                const newBrand = { brand_id: `brand-${brands.length + 1}`, brand_name: brand.brand_name }; // Tạo brand_id tự động
                const response = await fetch('http://localhost:8080/api/admin/brands', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newBrand),
                });
                const addedBrand = await response.json();
                setBrands([...brands, addedBrand]);
            } catch (error) {
                console.error('Lỗi khi thêm thương hiệu:', error);
            }
        }
        setIsModalOpen(false);
    };

    return (
        <div className="brand-list">
            <h2>Quản Lý Thương Hiệu</h2>
            <button onClick={handleAddBrand} className="btn-add">Thêm Thương Hiệu</button>
            <table className="brand-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Thương Hiệu</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {brands.map((brand) => (
                        <tr key={brand.brand_id}>
                            <td>{brand.brand_id}</td>
                            <td>{brand.brand_name}</td>
                            <td>
                                <button onClick={() => handleEditBrand(brand)}><FaEdit /></button>
                                <button onClick={() => handleDeleteBrand(brand.brand_id)}><FaTrash /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <EditBrand
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    onSave={handleSaveBrand}
                    brand={currentBrand}
                />
            )}
        </div>
    );
};

export default BrandList;
