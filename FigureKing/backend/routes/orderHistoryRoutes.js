const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Đảm bảo bạn đã có cấu hình kết nối MySQL.

router.get('/order-history/:acc_id', (req, res) => {
    const { acc_id } = req.params;

    // Cập nhật câu truy vấn để lấy đường dẫn ảnh sản phẩm
    const query = `
        SELECT 
            o.order_id, 
            o.address, 
            o.phone_number, 
            o.total, 
            o.pay_status, 
            o.full_name, 
            fo.order_status,
            oi.product_id, 
            oi.quantity_items, 
            oi.price,
            p.product_name,
            p.imageUrl  
        FROM \`order\` o
        LEFT JOIN follow_order fo ON o.order_id = fo.order_id
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.product_id
        WHERE o.acc_id = ?
        ORDER BY o.order_id DESC;
    `;

    db.query(query, [acc_id], (err, result) => {
        if (err) {
            console.error('Lỗi khi lấy lịch sử đơn hàng:', err);
            return res.status(500).json({ message: 'Lỗi khi lấy lịch sử đơn hàng' });
        }

        // Xử lý kết quả thành cấu trúc cần thiết
        const orders = {};
        result.forEach(row => {
            if (!orders[row.order_id]) {
                orders[row.order_id] = {
                    order_id: row.order_id,
                    address: row.address,
                    phone_number: row.phone_number,
                    total: row.total,
                    pay_status: row.pay_status,
                    full_name: row.full_name,
                    order_status: row.order_status,
                    created_at: row.created_at,
                    order_items: []
                };
            }
            if (row.product_id) {
                orders[row.order_id].order_items.push({
                    product_id: row.product_id,
                    product_name: row.product_name,
                    quantity_items: row.quantity_items,
                    price: row.price,
                    image_url: row.imageUrl // Lưu đường dẫn ảnh sản phẩm
                });
            }
        });

        // Trả về mảng các đơn hàng
        res.status(200).json(Object.values(orders));
    });
});

module.exports = router;
