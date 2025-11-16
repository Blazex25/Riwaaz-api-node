const mongoose = require("mongoose");
const { default: paymentLink } = require("razorpay");
const {Schema} = mongoose;

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
    },
    orderItems:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"cartItems",
    }],
    orderDate:{
        type:Date,
        required:true,
    },
    deliveryDate:{
        type:Date,
        required:true,
    },
    shippingAddress:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"addresses",
    },
    paymentDetails:{
        paymentMethod:{
            type:String,
        },
    transectionId:{
            type:String,
        },
    paymentId:{
            type:String,
        },
    paymentStatus:{
            type:String,
            default:"PENDING"
        },
    },
    totalPrice:{
        type:Number,
        required:true,
    },
    totalDiscountedPrice:{
        type:Number,
        required:true,
    },
    discount:{
        type:Number,
        required:true,
    },
    orderStatus:{
        type:String,
        required:true,
        default:"PENDING"
    },
    totalItems:{
        type:Number,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
});

const Order=mongoose.model("orders",orderSchema);

module.exports=Order;