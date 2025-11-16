const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
    firstname:{type:String,required:true},
    lastname:{type:String,required:true},
    streetaddress:{type:String,required:true},
    city:{type:String,required:true},
    state:{type:String,required:true},
    zipCode:{type:Number,required:true},

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    mobile:{type:String,required:true}
})

const Address=mongoose.model("addresses",addressSchema);

module.exports=Address;