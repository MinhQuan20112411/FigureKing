import React, { useState, useEffect } from 'react';
import './OrderList.css';

const OrderList = () => {
    const [orders, setOrders] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const images = require.context('../../../../../backend/uploads', false, /\.(png|jpe?g|svg)$/);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/admin/orders');
                
                if (!response.ok) {
                    throw new Error(`Lỗi: ${response.status} - Không tìm thấy dữ liệu đơn hàng`);
                }
                
                const data = await response.json(); 
                setOrders(data); 
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu đơn hàng:', error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const updatedData = { order_status: newStatus };
    
            // Nếu trạng thái là "Đã giao hàng" thì cập nhật luôn "pay_status"
            if (newStatus === "Đã giao hàng") {
                updatedData.pay_status = "Đã thanh toán";
            }
    
            const response = await fetch(`http://localhost:8080/api/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể cập nhật trạng thái đơn hàng');
            }
    
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.order_id === orderId
                        ? { ...order, order_status: newStatus, ...(newStatus === "Đã giao hàng" && { pay_status: "Đã thanh toán" }) }
                        : order
                )
            );
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error.message);
            setError(error.message);
        }
    };
    

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    if (loading) {
        return <div>Đang tải dữ liệu...</div>; 
    }

    if (error) {
        return (
            <div>
                <h2>Lỗi khi tải dữ liệu</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <table className="order-list-table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Địa chỉ</th>
                    <th>Số điện thoại</th>
                    <th>Sản phẩm</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái thanh toán</th>
                    <th>ID tài khoản</th>
                    <th>Tên đầy đủ</th>
                    <th>Trạng thái đơn hàng</th>
                </tr>
            </thead>
            <tbody>
                {orders.map(order => (
                    <tr key={order.order_id}>
                        <td>{order.order_id}</td>
                        <td>{order.address}</td>
                        <td>{order.phone_number}</td>
                        <td>
                            {order.order_items && order.order_items.map((product, index) => (
                                <div key={index}>
                                    <img 
                                        src={images(`./${product.image_url}`)} 
                                        alt={product.product_name} 
                                        width={50} 
                                        height={50} 
                                    />
                                    <span>{product.product_name} (Số lượng: {product.quantity_items})</span>
                                </div>
                            ))}
                        </td>
                        <td>{formatCurrency(order.total)}</td>
                        <td>{order.pay_status}</td>
                        <td>{order.acc_id}</td>
                        <td>{order.full_name}</td>
                        <td>
                            <select 
                                value={order.order_status || ""} 
                                onChange={(e) => updateOrderStatus(order.order_id, e.target.value)}
                            >
                                <option value="" disabled>Chọn trạng thái</option>
                                <option value="Đã tiếp nhận">Đã tiếp nhận</option>
                                <option value="Đã gửi hàng đi">Đã gửi hàng đi</option>
                                <option value="Đang giao hàng">Đang giao hàng</option>
                                <option value="Đã giao hàng">Đã giao hàng</option>
                                <option value="Đã hủy">Đã hủy</option>
                            </select>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default OrderList;
