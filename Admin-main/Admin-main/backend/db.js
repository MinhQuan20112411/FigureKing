var mysql = require('mysql');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',           
    password: '',          
    database: 'FigureKing'    
});

// Kết nối đến MySQL
db.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối MySQL:', err);
        return;
    }
    console.log('Kết nối thành công tới MySQL!');
});

module.exports = db;
