const Razorpay = require('razorpay');

const apiKey = "rzp_test_S2C8pfdr9cP9z2";
const apiSecret = "afyqlq62pZfxoop6Wtu1FHi8";


const razorpay = new Razorpay({
    key_id: apiKey,
    key_secret: apiSecret,
});

module.exports = { razorpay };