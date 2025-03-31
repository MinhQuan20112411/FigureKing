/**
 * Created by CTT VNPAY
 */

const db = require('../config/db'); 
let express = require('express');
let router = express.Router();
let $ = require('jquery');
const request = require('request');
const moment = require('moment');
const crypto = require("crypto");
const querystring = require('qs');
const config = require('config');

router.get('/', function(req, res, next){
    res.render('orderlist', { title: 'Danh sách đơn hàng' })
});

router.get('/create_payment_url', function (req, res, next) {
    res.render('order', {title: 'Tạo mới đơn hàng', amount: 10000})
});

router.get('/querydr', function (req, res, next) {
    let desc = 'truy van ket qua thanh toan';
    res.render('querydr', {title: 'Truy vấn kết quả thanh toán'})
});

router.get('/refund', function (req, res, next) {
    let desc = 'Hoan tien GD thanh toan';
    res.render('refund', {title: 'Hoàn tiền giao dịch thanh toán'})
});

router.post('/create_payment_url', (req, res, next) => {
    const { totalAmount, bankCode, language, fullName, phoneNumber, address, acc_id } = req.body;

    process.env.TZ = 'Asia/Ho_Chi_Minh';

    try {
        // Validate input
        if (!totalAmount || isNaN(totalAmount)) {
            return res.status(400).json({ message: 'Invalid total amount' });
        }
        if (!fullName || !phoneNumber || !address || !acc_id) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const insertQuery = `
            INSERT INTO \`order\` (address, phone_number, total, pay_status, acc_id, full_name) 
            VALUES (?, ?, ?, 'pending', ?, ?)
        `;
        db.query(insertQuery, [address, phoneNumber, totalAmount, acc_id, fullName], (err, result) => {
            if (err) {
                console.error("Error inserting order:", err);
                return res.status(500).json({ message: 'Error creating order' });
            }

            const orderId = result.insertId;
            console.log("Order ID:", orderId);

            const tmnCode = config.get('vnp_TmnCode');
            const secretKey = config.get('vnp_HashSecret');
            const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
            const returnUrl = "http://localhost:5000/api/vnpay/vnpay_return";
            const createDate = moment(new Date()).format('YYYYMMDDHHmmss');

            let locale = language || 'vn';
            let currCode = 'VND';
            let vnp_Params = {
                vnp_Version: '2.1.0',
                vnp_Command: 'pay',
                vnp_TmnCode: tmnCode,
                vnp_Locale: locale,
                vnp_CurrCode: currCode,
                vnp_TxnRef: orderId,
                vnp_OrderInfo: `Thanh toan don hang #${orderId}`,
                vnp_OrderType: 'other',
                vnp_Amount: totalAmount * 100,
                vnp_ReturnUrl: returnUrl,
                vnp_IpAddr: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                vnp_CreateDate: createDate
            };

            if (bankCode) {
                vnp_Params['vnp_BankCode'] = bankCode;
            }
            vnp_Params = sortObject(vnp_Params);
            const signData = querystring.stringify(vnp_Params, { encode: false });
            const hmac = crypto.createHmac("sha512", secretKey);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
            vnp_Params['vnp_SecureHash'] = signed;

            const paymentUrl = vnpUrl + '?' + querystring.stringify(vnp_Params, { encode: false });
            console.log("Generated Payment URL:", paymentUrl);

            return res.json({ paymentUrl });
        });
    } catch (error) {
        console.error("Error creating payment URL:", error);
        res.status(500).json({ message: 'Error creating payment URL' });
    }
});

router.get('/vnpay_return', async function (req, res, next) {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    const orderId = vnp_Params['vnp_TxnRef'];
    const rspCode = vnp_Params['vnp_ResponseCode'];

    vnp_Params = sortObject(vnp_Params);

    const config = require('config');
    const secretKey = config.get('vnp_HashSecret');
    const querystring = require('qs');
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        try {
            const updateQuery = `
                UPDATE \`order\`
                SET pay_status = ?
                WHERE order_id = ?
            `;
            const payStatus = rspCode === "00" ? "Đã thanh toán" : "failed";
    
            await new Promise((resolve, reject) => {
                db.query(updateQuery, [payStatus, orderId], (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });

            // Nếu thanh toán thành công
            if (rspCode === "00") {
                // 1. Thêm vào bảng follow_order
                const insertFollowOrderQuery = `
                    INSERT INTO follow_order (order_status, order_id)
                    VALUES ('Đã tiếp nhận', ?)
                `;
                await new Promise((resolve, reject) => {
                    db.query(insertFollowOrderQuery, [orderId], (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });

                // 2. Thêm tất cả sản phẩm trong giỏ hàng vào order_items
                const getCartItemsQuery = `
                    SELECT c.product_id, c.quantity, p.cost
                    FROM cart c
                    JOIN products p ON c.product_id = p.product_id
                    JOIN \`order\` o ON c.acc_id = o.acc_id
                    WHERE o.order_id = ?
                `;
                const cartItems = await new Promise((resolve, reject) => {
                    db.query(getCartItemsQuery, [orderId], (err, results) => {
                        if (err) reject(err);
                        else resolve(results);
                    });
                });

                if (cartItems.length > 0) {
                    const insertOrderItemsQuery = `
                        INSERT INTO order_items (order_id, product_id, quantity_items, price)
                        VALUES (?, ?, ?, ?)
                    `;
                    for (const item of cartItems) {
                        await new Promise((resolve, reject) => {
                            db.query(insertOrderItemsQuery, 
                                [orderId, item.product_id, item.quantity, item.cost], 
                                (err, result) => {
                                    if (err) reject(err);
                                    else resolve(result);
                                }
                            );
                        });
                    }

                    // 3. Xóa tất cả sản phẩm khỏi giỏ hàng
                    const deleteCartItemsQuery = `
                        DELETE FROM cart
                        WHERE acc_id = (SELECT acc_id FROM \`order\` WHERE order_id = ?)
                    `;
                    await new Promise((resolve, reject) => {
                        db.query(deleteCartItemsQuery, [orderId], (err, result) => {
                            if (err) reject(err);
                            else resolve(result);
                        });
                    });
                }
            }

            res.render('success', { code: rspCode });

        } catch (error) {
            console.error("Error in processing payment return:", error);
            res.render('success', { code: '99' }); // Lỗi cập nhật
        }
    } else {
        res.render('success', { code: '97' }); // Checksum không hợp lệ
    }    
});

router.get('/vnpay_ipn', function (req, res, next) {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];
    
    let orderId = vnp_Params['vnp_TxnRef'];
    let rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    let secretKey = config.get('vnp_HashSecret');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    
    let paymentStatus = '0';
    let checkOrderId = true;
    let checkAmount = true;
    if(secureHash === signed){
        if(checkOrderId){
            if(checkAmount){
                if(paymentStatus=="0"){
                    if(rspCode=="00"){
                        res.status(200).json({RspCode: '00', Message: 'Success'})
                    }
                    else {
                        res.status(200).json({RspCode: '00', Message: 'Success'})
                    }
                }
                else{
                    res.status(200).json({RspCode: '02', Message: 'This order has been updated to the payment status'})
                }
            }
            else{
                res.status(200).json({RspCode: '04', Message: 'Amount invalid'})
            }
        }       
        else {
            res.status(200).json({RspCode: '01', Message: 'Order not found'})
        }
    }
    else {
        res.status(200).json({RspCode: '97', Message: 'Checksum failed'})
    }
});

router.post('/querydr', function (req, res, next) {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();

    let vnp_TmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');
    let vnp_Api = config.get('vnp_Api');
    
    let vnp_TxnRef = req.body.orderId;
    let vnp_TransactionDate = req.body.transDate;
    
    let vnp_RequestId = moment(date).format('HHmmss');
    let vnp_Version = '2.1.0';
    let vnp_Command = 'querydr';
    let vnp_OrderInfo = 'Truy van GD ma:' + vnp_TxnRef;
    
    let vnp_IpAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let currCode = 'VND';
    let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');
    
    let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TxnRef + "|" + vnp_TransactionDate + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;
    
    let hmac = crypto.createHmac("sha512", secretKey);
    let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex"); 
    
    let dataObj = {
        'vnp_RequestId': vnp_RequestId,
        'vnp_Version': vnp_Version,
        'vnp_Command': vnp_Command,
        'vnp_TmnCode': vnp_TmnCode,
        'vnp_TxnRef': vnp_TxnRef,
        'vnp_OrderInfo': vnp_OrderInfo,
        'vnp_TransactionDate': vnp_TransactionDate,
        'vnp_CreateDate': vnp_CreateDate,
        'vnp_IpAddr': vnp_IpAddr,
        'vnp_SecureHash': vnp_SecureHash
    };
    
    request({
        url: vnp_Api,
        method: "POST",
        json: true,   
        body: dataObj
    }, function (error, response, body){
        console.log(response);
    });
});

router.post('/refund', function (req, res, next) {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();

    let vnp_TmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');
    let vnp_Api = config.get('vnp_Api');
    
    let vnp_TxnRef = req.body.orderId;
    let vnp_TransactionDate = req.body.transDate;
    let vnp_Amount = req.body.amount *100;
    let vnp_TransactionType = req.body.transType;
    let vnp_CreateBy = req.body.user;
            
    let currCode = 'VND';
    
    let vnp_RequestId = moment(date).format('HHmmss');
    let vnp_Version = '2.1.0';
    let vnp_Command = 'refund';
    let vnp_OrderInfo = 'Hoan tien GD ma:' + vnp_TxnRef;
            
    let vnp_IpAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');
    let vnp_TransactionNo = '0';
    
    let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TransactionType + "|" + vnp_TxnRef + "|" + vnp_Amount + "|" + vnp_TransactionNo + "|" + vnp_TransactionDate + "|" + vnp_CreateBy + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;
    let hmac = crypto.createHmac("sha512", secretKey);
    let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex");
    
    let dataObj = {
        'vnp_RequestId': vnp_RequestId,
        'vnp_Version': vnp_Version,
        'vnp_Command': vnp_Command,
        'vnp_TmnCode': vnp_TmnCode,
        'vnp_TransactionType': vnp_TransactionType,
        'vnp_TxnRef': vnp_TxnRef,
        'vnp_Amount': vnp_Amount,
        'vnp_TransactionNo': vnp_TransactionNo,
        'vnp_CreateBy': vnp_CreateBy,
        'vnp_OrderInfo': vnp_OrderInfo,
        'vnp_TransactionDate': vnp_TransactionDate,
        'vnp_CreateDate': vnp_CreateDate,
        'vnp_IpAddr': vnp_IpAddr,
        'vnp_SecureHash': vnp_SecureHash
    };
    
    request({
        url: vnp_Api,
        method: "POST",
        json: true,   
        body: dataObj
    }, function (error, response, body){
        console.log(response);
    });
});

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj){
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = router;