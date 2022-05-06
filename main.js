const express=require("express");
const app=express();
app.use(express.static("pages"));
var session1;
const mongodb=require("./mongodb/mongodb.js")
//routers


const router1=require('./controllers/user_controller.js');
const router2=require('./controllers/seller_controller.js');



//schemas
const Userregister=require('./schema/userlogin.js');
const Sellerregister=require('./schema/sellerlogin.js');
const product=require("./schema/products_schema.js");
const order=require("./schema/cart.js");
const checkout=require("./schema/checkout.js");
app.use(express.json());
app.use(express.urlencoded({extended:false}));


const session=require('express-session');
const cookieparser=require("cookie-parser");

app.get("/",(req,res)=>{
        res.sendFile(__dirname+'/pages/main.html');
});

app.use('/user',router1);
app.use("/seller",router2)

app.listen(3000,()=>{
    console.log("Server started!!");
})
