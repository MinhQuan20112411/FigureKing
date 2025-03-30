// routes/brands.js
const express = require('express');
const db = require('../../db');
const router = express.Router();

// Lấy tất cả thương hiệu
router.get('/', (req, res) => {
    db.query('SELECT * FROM brands', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Thêm thương hiệu mới
router.post('/', (req, res) => {
    const { brand_id, brand_name } = req.body;
    db.query('INSERT INTO brands (brand_id, brand_name) VALUES (?, ?)', [brand_id, brand_name], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Brand added', id: result.insertId });
    });
});

// Cập nhật thương hiệu
router.put('/:brand_id', (req, res) => {
    const { brand_name } = req.body;
    const { brand_id } = req.params;
    db.query('UPDATE brands SET brand_name = ? WHERE brand_id = ?', [brand_name, brand_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Brand updated' });
    });
});

// Xóa thương hiệu
router.delete('/:brand_id', (req, res) => {
    const { brand_id } = req.params;
    db.query('DELETE FROM brands WHERE brand_id = ?', [brand_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Brand deleted' });
    });
});

module.exports = router;
