const express=require("express");
const User=require("../models/users.model");
const config=require("../models/config");
const middleware=require("../models/middleware")

const jwt=require("jsonwebtoken")
const router =express.Router();
router.route("/update/:username").patch(middleware.checkToken,(req,res)=>{
    console.log("inside update")
    console.log(req.body.password)
    console.log(req.params.username)

    User.findOneAndUpdate(
        {username:req.params.username},
        {$set:{password:req.body.password}},
        (err,result)=>{
            if (err)return res.status(500).json({msg_error:err});
            const msg={
                msg:"password successfully updated",
                username:req.params.username
            };
            return res.json(msg);

        }
    );
});
router.route("/:username").get(middleware.checkToken,(req,res)=>{
    console.log("inside Show user");
    console.log(req.params.username)

    User.findOne({username:req.params.username},
    (err,result)=>{
        if (err)return res.status(500)
        .json({msg_error:err});
        res.json({
            data:result,
            username:req.params.username,
        });
    });
});
router.route("/checkusername/:username").get((req,res)=>{
    User.findOne({username:req.params.username},
        (err,result)=>{
            if (err)
            return res.status(500)
            .json({msg_error:err});
            if(result!==null){
                return res.json({
                    status:true,
                    username:req.params.username,
                });}
                else{
                    return res.json({
                        status:false,
                        username:req.params.username,
                    });
              
            }
        }); 
})

router.route("/login").post((req,res)=>{
    console.log("inside login");
    console.log(req.body.username)

    User.findOne({username:req.body.username},
    (err,result)=>{
        if (err)
        return res.status(500).json({msg_error:err});
        if(result===null){
         return   res.status(403).json("Either Username  incorrect")
        }
        if(result.password===req.body.password){
            //here we implement the jwt token  functionlity
         let token=   jwt.sign({username:req.body.username},config.key,{expiresIn:"24h"});
            res.json({token:token,
            msg:"seccess"})
        }
        else{
            res.status(403).json("password is incorrect")
        }
    });
});
router.route("/delete/:username").delete(middleware.checkToken,(req,res)=>{
    console.log("inside delete")


    User.findOneAndDelete(
        {username:req.params.username},
       
        (err,result)=>{
            if (err)return res.status(500).json({msg_error:err});
            const msg={
                msg:"user seleted",
                username:req.params.username
            };
            return res.json(msg);

        }
    );
});
router.route("/register").post((req,res)=>{
console.log("inside the register");
const user=new User({
    username:req.body.username,
    password: req.body.password,
    email:req.body.email
});
user.save().then(()=>{
    console.log("user registered");
    res.status(200).json("ok");
}).catch((err)=>{
    res.status(403).json({msg:err});

});
res.json("registerd")
})

module.exports=router;