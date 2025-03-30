import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageUser.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/admin/user');
            setUsers(response.data);
        } catch (error) {
            setError(error.message || 'Đã xảy ra lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa người dùng này?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8080/api/admin/user/${id}`);
            setUsers(users.filter((user) => user.acc_id !== id)); // Cập nhật danh sách sau khi xóa
            alert('Xóa người dùng thành công!');
        } catch (error) {
            alert('Không thể xóa người dùng: ' + (error.message || 'Lỗi không xác định'));
        }
    };

    return (
        <div className="user-list">
            <h2>Quản Lý Người Dùng</h2>
            {loading && <p>Đang tải dữ liệu...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && (
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Họ</th>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.acc_id}>
                                <td>{user.acc_id}</td>
                                <td>{user.first_name}</td>
                                <td>{user.last_name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button 
                                        className="delete-button" 
                                        onClick={() => handleDelete(user.acc_id)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserList;
