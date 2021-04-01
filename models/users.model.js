const mongoose=require("mongoose");


const Schema=mongoose.Schema;

const User=Schema({
    username: {
        type:String,
        required:true,
        unique:true

    },
    password:{
        type:String,
        unique:true
    },
    email:{
        type:String,
        unique:true 
    }
});

module.exports=mongoose.model("User",User);