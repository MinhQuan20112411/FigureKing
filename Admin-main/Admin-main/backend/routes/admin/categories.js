const express = require('express');
const db = require('../../db');
const router = express.Router();

// Lấy tất cả danh mục
router.get('/', (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Thêm danh mục mới
router.post('/', (req, res) => {
    const { cate_id, cate_name } = req.body;
    db.query('INSERT INTO categories (cate_id, cate_name) VALUES (?, ?)', [cate_id, cate_name], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Category added', id: result.insertId });
    });
});

// Cập nhật danh mục
router.put('/:cate_id', (req, res) => {
    const { cate_name } = req.body;
    const { cate_id } = req.params;
    db.query('UPDATE categories SET cate_name = ? WHERE cate_id = ?', [cate_name, cate_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Category updated' });
    });
});

// Xóa danh mục
router.delete('/:cate_id', (req, res) => {
    const { cate_id } = req.params;
    db.query('DELETE FROM categories WHERE cate_id = ?', [cate_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Category deleted' });
    });
});

module.exports = router;
