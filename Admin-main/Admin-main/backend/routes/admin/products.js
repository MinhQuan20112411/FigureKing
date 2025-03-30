const express = require('express');
const db = require('../../db');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Cấu hình multer để xử lý file tải lên
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../../../../FigureKing/frontend/src/assets')); // Đặt đúng đường dẫn tới thư mục assets
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({ storage });

// Lấy tất cả sản phẩm kèm tên thương hiệu và danh mục
router.get('/', (req, res) => {
    const query = `
        SELECT p.*, b.brand_name, c.cate_name
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.brand_id
        LEFT JOIN categories c ON p.cate_id = c.cate_id
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Thêm sản phẩm mới
router.post('/', upload.single('image'), (req, res) => {
    const { product_name, cost, description, quantity, brand_id, size_id, cate_id } = req.body;

    // Đường dẫn ảnh
    const imageUrl = req.file ? req.file.filename : null;

    const sql = `
        INSERT INTO products (product_name, cost, description, quantity, brand_id, size_id, cate_id, imageUrl) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [product_name, cost, description, quantity, brand_id, size_id, cate_id, imageUrl], (err, result) => {
        if (err) {
            console.error('Error inserting product:', err);
            return res.status(500).json({ error: 'Lỗi khi thêm sản phẩm.' });
        }
        res.status(201).json({
            product_id: result.insertId, 
            product_name,
            cost,
            description,
            quantity,
            brand_id,
            size_id,
            cate_id,
            imageUrl
        });
    });
});

// Sửa sản phẩm
router.put('/:product_id', upload.single('image'), (req, res) => {
    const { product_id } = req.params;
    const { product_name, cost, description, quantity, brand_id, size_id, cate_id } = req.body;

    // Đường dẫn ảnh nếu có, nếu không thì giữ nguyên ảnh cũ
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = `
        UPDATE products 
        SET product_name = ?, cost = ?, description = ?, quantity = ?, brand_id = ?, size_id = ?, cate_id = ?, imageUrl = COALESCE(?, imageUrl)
        WHERE product_id = ?`;

    db.query(sql, [product_name, cost, description, quantity, brand_id, size_id, cate_id, imageUrl, product_id], (err) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).json({ error: 'Lỗi khi sửa sản phẩm.' });
        }
        const updatedProduct = { product_name, cost, description, quantity, brand_id, size_id, cate_id, imageUrl };
        res.status(200).json({ message: 'Sản phẩm đã được cập nhật thành công.', data: updatedProduct });
    });
});

// Xóa sản phẩm
router.delete('/:product_id', (req, res) => {
    const { product_id } = req.params;

    db.query('DELETE FROM products WHERE product_id = ?', [product_id], (err) => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ error: 'Lỗi khi xóa sản phẩm.' });
        }
        res.json({ message: 'Sản phẩm đã được xóa thành công.' });
    });
});

module.exports = router;
