const express = require('express');
const router = express.Router();
const db = require('../../db');

// Lấy danh sách tất cả người dùng
router.get('/', (req, res) => {
    const query = 'SELECT acc_id, first_name, last_name, email FROM account';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi khi truy vấn MySQL:', err.message);
            res.status(500).json({ error: 'Lỗi máy chủ' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Lấy thông tin người dùng theo ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT acc_id, first_name, last_name, email FROM account WHERE acc_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Lỗi khi truy vấn MySQL:', err.message);
            res.status(500).json({ error: 'Lỗi máy chủ' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Người dùng không tồn tại' });
        } else {
            res.status(200).json(results[0]);
        }
    });
});


// Xóa người dùng
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM account WHERE acc_id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Lỗi khi truy vấn MySQL:', err.message);
            res.status(500).json({ error: 'Lỗi máy chủ' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Người dùng không tồn tại' });
        } else {
            res.status(200).json({ message: 'Người dùng đã được xóa' });
        }
    });
});

module.exports = router;
