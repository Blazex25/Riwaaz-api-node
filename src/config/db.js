const mongoose = require("mongoose");

const mondbURL="mongodb+srv://gaudvishal20_db_user:GQcsVdkjGWUfSpH7@cluster0.d208ypn.mongodb.net/?appName=Cluster0"

const connectDB=()=>{
    return mongoose.connect(mondbURL);
}

module.exports={connectDB}