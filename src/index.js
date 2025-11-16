const express = require('express')

const cors = require('cors')
const { status } = require('express/lib/response')

const app = express()

app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    return res.status(200).send({messege:"Welcome to Riwaaz api -node",status:true})
})

const authRoutes = require('./routes/auth.route.js');
app.use('/auth',authRoutes);

const userRoutes = require('./routes/user.route.js');
app.use('/api/users',userRoutes);

const productRouter=require("./routes/product.routes.js");
app.use("/api/products",productRouter);

const adminProductRouter=require("./routes/adminProduct.routes.js");
app.use("/api/admin/products",adminProductRouter);

const cartRouter=require("./routes/cart.routes.js")
app.use("/api/cart",cartRouter)

const cartItemRouter=require("./routes/cartItem.routes.js");
app.use("/api/cart_items",cartItemRouter);

const orderRouter=require("./routes/order.routes.js");
app.use("/api/orders",orderRouter)

const AdminOrderRouter=require("./routes/adminOrder.routes.js");
app.use("/api/admin/orders",AdminOrderRouter)

const reviewRouter=require("./routes/review.routes.js");
app.use("/api/reviews",reviewRouter)

const ratingRouter=require("./routes/rating.routes.js");
app.use("api/ratings",ratingRouter)
module.exports = app;