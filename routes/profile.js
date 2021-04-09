const express=require("express");
const config=require("../models/config");
const middleware=require("../models/middleware")
const jwt=require("jsonwebtoken");
var path=require("path")
const multer=require("multer");
const profile_model = require("../models/profile_model");

const router =express.Router();
const storge=multer.diskStorage({
  destination:(req,file,cb)=>{
      cb(null,"./uploads");
  },

  filename:function(req, file, cb) {
     console.log( "offfff"+file.fieldname)
     
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));      }
});

const filefliter=(req,file,cb)=>{
    console.log( file.mimetype)
  if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
    console.log("image jpg or png ok");
   cb(null, true);
  } else {
    cb(null, false);
      cb(new Error('Only .jpg or .png files are accepted'), true);   
  }

}
const upload=multer({
  storage:storge,
  limits:{
      fileSize:1024*1024*5,
  }
  ,fileFilter:filefliter
});
  router.route("/add/image").patch(middleware.checkToken,
    upload.single("img"),async(req,res)=>{
        const file = req.file    
if (!file) {      
const error = new Error('Please upload a file')   
   error.httpStatusCode = 400      
   console.log(error)
} 
        console.log(typeof req.file)
        console.log("anagggggggggaaaaa"+req.decoded.username+"path is:"+req.file.path);
        await profile_model.findOneAndUpdate(
            {
                username:req.decoded.username
            },{
                $set:{image:req.file.path,
                }},{new:true },(err,profile)=>{
                if(err)
                return res.status(500).send(err);
                const response={
                    message:"image added successfully updated",
                    deta:profile
                };
                return  res.status(200).send(response);
            }
        )

});
router.route("/add").post(middleware.checkToken,(req,res)=>
{
    console.log("inside the Add Profile :"+req.decoded.username);
   
    const user=new profile_model({
        username:req.decoded.username,
        name: req.body.name, 
        DOB:req.body.DOB,
        titleline: req.body.titleline,
        about: req.body.about,
        
           
    });
    user.save().then(()=>{
        console.log("Added profile");
        
        res.status(200).json(user);
    }).catch((err)=>{
        res.status(400).json({msg:err});
    
    });
});
router.route("/checkprofile").get(middleware.checkToken,(req,res)=>{
    profile_model.findOne({username:req.decoded.username},
        (err,result)=>{
            if (err)
            return res.status(500)
            .json({msg_error:err});
            if(result==null){
                return res.json({
                    status:false,
                   
                });}
                else{
                    return res.json({
                        status:true,
                        username:req.decoded.username,
                    });
              
            }
        }); 
})

module.exports=router;