import React, { useState, useEffect } from 'react';
import './OrderHistory.css';

const images = require.context('../assets', false, /\.(png|jpe?g|svg)$/);

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const acc_id = localStorage.getItem('acc_id');
        if (!acc_id) {
          throw new Error('User chưa đăng nhập hoặc thiếu thông tin acc_id');
        }

        const response = await fetch(`http://localhost:5000/api/order-history/${acc_id}`);
        if (!response.ok) {
          throw new Error(`Lỗi khi gọi API: ${response.statusText}`);
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error('Lỗi khi lấy lịch sử đơn hàng:', err);
        setError(err.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  if (loading) return <div className="order-history__loading">Loading...</div>;
  if (error) return <div className="order-history__error">{error}</div>;

  const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN') + ' VND'; // Định dạng theo VND với dấu phẩy
  };

  const formatPaymentStatus = (status) => {
    if (status === 'pending') {
      return 'Đang chờ thanh toán'; // Nếu là pending, hiển thị là "Đang chờ thanh toán"
    }
    return status; // Nếu không phải pending, trả về trạng thái gốc
  };

  return (
    <div className="order-history">
      <h1 className="order-history__title">Lịch sử đặt hàng</h1>
      <div className="order-history__list">
        {orders.length === 0 ? (
          <p>Chưa có đơn hàng nào.</p>
        ) : (
          orders.map(order => (
            <div key={order.order_id} className="order-history__item">
              <div className="order-history__header">
                <h3>MÃ ĐƠN HÀNG #{order.order_id}</h3>
                <p className="order-history__total">Tổng tiền: {formatCurrency(order.total)}</p>
                <p>Trạng thái thanh toán: {formatPaymentStatus(order.pay_status)}</p>
                <p>Trạng thái đơn hàng: {order.order_status}</p>
                <p>Địa chỉ giao hàng: {order.address}</p>
              </div>
              <div className="order-history__items">
                {order.order_items.map(item => {
                  // Kiểm tra nếu ảnh có sẵn trong assets
                  const imagePath = images(`./${item.image_url}`); // Đảm bảo rằng image_url trùng tên file trong thư mục assets

                  return (
                    <div key={item.product_id} className="order-history__item-details">
                      <div className="order-history__product-info">
                        <img 
                          src={imagePath} 
                          alt={item.product_name} 
                          className="order-history__product-image"
                        />
                        <div className="order-history__product-details">
                          <p className="order-history__product-name">{item.product_name}</p>
                          <p>Số lượng: {item.quantity_items}</p>
                          <p>Giá: {formatCurrency(item.price)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
