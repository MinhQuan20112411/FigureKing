const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. Route để tạo đơn hàng mới
router.post('/create', (req, res) => {
  const { address, phone_number, total, acc_id, orderItems, full_name } = req.body;

  console.log("Thông tin đơn hàng nhận được:", req.body);

  db.beginTransaction((err) => {
    if (err) {
      console.error('Lỗi khi bắt đầu transaction:', err);
      return res.status(500).json({ message: 'Lỗi khi bắt đầu transaction' });
    }

    // Thêm order_time vào câu lệnh INSERT (nếu không dùng DEFAULT CURRENT_TIMESTAMP)
    const orderQuery = `
      INSERT INTO \`order\` (address, phone_number, total, pay_status, acc_id, full_name, order_time)
      VALUES (?, ?, ?, 'Đang chờ thanh toán', ?, ?, NOW())
    `;
    db.query(orderQuery, [address, phone_number, total, acc_id, full_name], (err, orderResult) => {
      if (err) {
        console.error('Lỗi khi tạo đơn hàng:', err);
        return db.rollback(() => {
          res.status(500).json({ message: 'Lỗi khi tạo đơn hàng' });
        });
      }

      const orderId = orderResult.insertId;
      console.log("Đơn hàng đã được tạo, orderId:", orderId);

      // Thêm trạng thái ban đầu vào bảng follow_order
      const followOrderQuery = `
        INSERT INTO follow_order (order_status, order_id)
        VALUES ('Đã tiếp nhận', ?)
      `;
      db.query(followOrderQuery, [orderId], (err) => {
        if (err) {
          console.error('Lỗi khi thêm trạng thái ban đầu vào bảng follow_order:', err);
          return db.rollback(() => {
            res.status(500).json({ message: 'Lỗi khi thêm trạng thái ban đầu vào bảng follow_order' });
          });
        }
        console.log('Trạng thái ban đầu đã được thêm vào bảng follow_order');
      });

      // Thêm sản phẩm vào order_items và giảm số lượng sản phẩm
      const itemPromises = orderItems.map((item) => {
        const { product_id, quantity_items, price } = item;

        console.log(`Thêm sản phẩm vào order_items, product_id: ${product_id}, quantity_items: ${quantity_items}, price: ${price}`);

        const orderItemQuery = `
          INSERT INTO order_items (order_id, product_id, quantity_items, price)
          VALUES (?, ?, ?, ?)
        `;
        return new Promise((resolve, reject) => {
          db.query(orderItemQuery, [orderId, product_id, quantity_items, price], (err) => {
            if (err) {
              console.error('Lỗi khi thêm sản phẩm vào order_items:', err);
              return reject(err);
            }

            const updateProductQuery = `
              UPDATE products
              SET quantity = quantity - ?
              WHERE product_id = ? AND quantity >= ?
            `;
            db.query(updateProductQuery, [quantity_items, product_id, quantity_items], (err, result) => {
              if (err) {
                console.error('Lỗi khi cập nhật số lượng sản phẩm:', err);
                return reject(err);
              }

              if (result.affectedRows === 0) {
                console.error(`Sản phẩm ${product_id} không đủ số lượng`);
                return reject(new Error(`Sản phẩm ${product_id} không đủ số lượng`));
              }
              resolve();
            });
          });
        });
      });

      // Xóa giỏ hàng của người dùng
      const clearCartQuery = `
        DELETE FROM cart WHERE acc_id = ?
      `;
      const deleteCartPromise = new Promise((resolve, reject) => {
        db.query(clearCartQuery, [acc_id], (err) => {
          if (err) {
            console.error('Lỗi khi xóa giỏ hàng:', err);
            return reject(err);
          }
          resolve();
        });
      });

      // Đợi tất cả các thao tác hoàn thành
      Promise.all([...itemPromises, deleteCartPromise])
        .then(() => {
          db.commit((err) => {
            if (err) {
              console.error('Lỗi khi commit transaction:', err);
              return db.rollback(() => {
                res.status(500).json({ message: 'Lỗi khi commit transaction' });
              });
            }
            res.status(201).json({ message: 'Đơn hàng đã được tạo thành công', orderId });
          });
        })
        .catch((err) => {
          console.error('Lỗi khi xử lý sản phẩm trong đơn hàng hoặc xóa giỏ hàng:', err);
          db.rollback(() => {
            res.status(500).json({ message: 'Lỗi khi xử lý sản phẩm trong đơn hàng hoặc xóa giỏ hàng', error: err.message });
          });
        });
    });
  });
});

// 2. Route để cập nhật trạng thái thanh toán của đơn hàng
router.put('/update/:orderId', (req, res) => {
  const { orderId } = req.params;
  const { pay_status } = req.body;

  const query = `
    UPDATE \`order\` SET pay_status = ? WHERE order_id = ?
  `;
  
  db.query(query, [pay_status, orderId], (err, result) => {
    if (err) {
      console.error('Lỗi khi cập nhật trạng thái thanh toán:', err);
      return res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái thanh toán' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    return res.status(200).json({ message: 'Trạng thái thanh toán đã được cập nhật' });
  });
});

module.exports = router;