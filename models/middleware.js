const jwt=require("jsonwebtoken");
const config=require("../models/config");

const checkToken=(req,res,next)=>{
    console.log("in check token");

    let token=req.headers["authorization"];
    console.log(token);
   token=token.slice(7,token.length);
   console.log(token);

   if(token){
       console.log("cobf key  is"+config.key)
       jwt.verify(token,config.key,(err,decoded)=>{
        console.log("decode out is"+decoded);

           if(err){
            console.log(err);

               return res.json({
                   status:false,
                   msg:"token is invalid"
               })
           }else{
            console.log("decode is"+decoded);

               req.decoded=decoded;
               next();
           }
       })
   }else{
       return res.json({status:false,
    msg:"Token is not provided"})
   }
  
}

module.exports={checkToken:checkToken}