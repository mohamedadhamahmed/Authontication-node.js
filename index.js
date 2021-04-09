const express=require("express")
const monogoose=require("mongoose");

const app=express();
monogoose.set('useFindAndModify', false);
monogoose.connect("mongodb+srv://blogApp:adhammedo3334444@cluster0.d3xck.mongodb.net/blogApp?retryWrites=true&w=majority"
,{useNewUrlParser:true,useCreateIndex:true,
    useUnifiedTopology:true,useFindAndModify:false})

const connection =monogoose.connection;
connection.once("open",()=>{
    console.log("MongoDb Connected");
})
 
//middleware
app.use("/uploads",express.static("uploads"));
app.use(express.json());
const userRoute=require("./routes/user");
app.use("/user",userRoute);
const profileRoute=require("./routes/profile");

app.use("/profile",profileRoute);


const port =process.env.PORT||5000
app.route("/").get((req,res)=>res.json("your frist rest api blog"));

app.listen(port,()=>console.log("you server is running on port "+port));