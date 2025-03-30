const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const categoriesRoutes = require('./routes/admin/categories');
const brandsRoutes = require('./routes/admin/brands');
const productsRoutes = require('./routes/admin/products');
const userRoutes = require('./routes/admin/user')
const orderRoutes = require('./routes/admin/order')
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/uploads', express.static('uploads'));
app.use('/api/admin/categories', categoriesRoutes);
app.use('/api/admin/brands', brandsRoutes);
app.use('/api/admin/user', userRoutes);
app.use('/api/admin/products', productsRoutes);
app.use('/api/admin/orders', orderRoutes);

app.use('/assets', express.static(path.join(__dirname, '../../../../../FigureKing/frontend/src/assets')));

app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});
