const mongoose=require("mongoose");


const Schema=mongoose.Schema;

const Profile=Schema({
    username: {
        type:String,
        required:true,
       

    },
    name:String,
    profession:String,
    DOB:String,
    titleline:String,
    about:String,

    image:{
       
        
            data: Buffer,
            contentType: String,
         
        default:"" 
    },
    timestamp: { type : Date, default: Date.now }
});

module.exports=mongoose.model("Profile",Profile);