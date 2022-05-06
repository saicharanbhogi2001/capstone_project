var express=require('express');
var app=express.Router();
var path = require('path')
app.use(express.static("pages"));

const session=require('express-session');
const cookieparser=require("cookie-parser");

// const res = require("express/lib/response");
app.use(session({secret:'project'}));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

const Sellerregister=require('../schema/userlogin.js');
const order=require("../schema/cart.js");
const product=require("../schema/products_schema.js");
const checkout=require("../schema/checkout.js");
const mongodb=require("../mongodb/mongodb.js");

// seller dashboard
app.get("/sellerdashboard",(req,res)=>{
        res.sendFile(path.resolve("pages/Seller-Page.html"));
    });

//seller forgot password
app.get("/sellerforgotpassword",(req,res)=>{
    res.sendFile(path.resolve("pages/sforgotpassword.html"));
});

app.post("/sellerforgotpassword",(req,res)=>{
    a=req.body.email;
    if(!a){
        res.redirect("/seller/sellerforgotpassword");
    }
    else{
        res.redirect("/seller/sellerupdatepassword");
    }
});


//seller login
app.get("/loginseller",(req,res)=>{
    res.sendFile(path.resolve("pages/seller-login.html"))
});
app.post("/loginseller",(req,res)=>{
    a=req.body.username;
    b=req.body.password;
    Sellerregister.findOne({sellermail:a,password:b},function(err,result){
        if(err)
        {
            console.log(err);
        }
        else
        {
            if(result == null)
            {
                res.send("error")
            }
            else{
                res.send("success")
            }
        }
        
    })
})

//seller update password
app.get("/sellerupdatepassword",(req,res)=>{
    res.sendFile(path.resolve("pages/supdatepassword.html"));
});
app.post("/sellerupdatepassword",(req,res)=>{
    a=req.body.newpassword;
    b=req.body.rnewpassword;
    c=req.body.email;
    if(a===b){
        Sellerregister.updateOne({usermail:c,password:a},function(err,result){
            if(err){
                console.log(err)  
            }
            else{
                if(result.modifiedCount==0)
                {
                    res.redirect('/seller/sellerupdatepassword');
                }
                else{
                    console.log(result);
                    res.redirect('/seller/sellerdashboard');
                } 
                
            }
        });
    }
    else{
        res.redirect("/seller/suserupdatepassword")
    }
    
});
//seller register
app.post("/sellerregister",(req,res)=>{
    var a=req.body.sname;
    var b=req.body.sgst;
    var c=req.body.semail;
    var d=req.body.spassword;
    var e=req.body.smobilenumber;
    Sellerregister.findOne({sellermail:c,mobilenumber:e},(err,result)=>{
        if(err)
        {
            res.send()
        }
        else
        {
            if(result==null)
            {
                Sellerregister.create({
                    sellername:a,
                    gstno:b,
                    sellermail:c,
                    password:d,
                    mobilenumber:e,
                },function(err){
                    if(err)
                    {
                        console.log('Something Went wrong'+err);
                    }
                    else
                    {
                        console.log('Seller registered');
                        res.redirect('/seller/loginseller')
                    }
                });
            }
            else{
                res.redirect("/seller/loginseller")
            }
        }
    })

});



//product page
app.get("/addproduct",(req,res)=>{
        res.sendFile(path.resolve("pages/addproduct.html"));
});

//adding product
app.post("/addproduct",(req,res)=>{
    console.log(req.body)
    var a=req.body.product_name
    var b=req.body.product_id
    var c=req.body.store_name
    var d=req.body.store_id
    var e=req.body.Category_name
    var f=req.body.description
    var g=req.body.price
    var h=req.body.Images
    var i=req.body.brand_name
    product.findOne({Product_name:a},(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            if(result==null){
                product.create({
                    product_id:b,
                    Category_name:e,
                    Product_name:a,
                    Store_name:c,
                    Images:h,
                    Description:f,
                    Price:g,
                    Store_id:d,
                    Brand_name:i
                },(err)=>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        console.log("product added!!")
                        res.redirect("/seller/addproduct");
                    }
                })
            }
            
        }

    })
});

//update data
app.get("/updateproducts",(req,res)=>{
    res.sendFile(path.resolve("pages/products-list.html"));
});

var productsdata;
var ordereddata;
app.get("/sellerordereddata",(req,res)=>{
    checkout.find({},(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            ordereddata=result
            res.send(result)
        }
    })
})

//deleting data
app.get("/deleteproduct/:id",(req,res)=>{
    var id=req.params.id;
    console.log(productsdata)
    product.deleteOne(productsdata[id],(err)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log("deleted")
            res.redirect("/seller/updateproducts")
        }

    })
})

//total products
app.get("/productinfo",(req,res)=>{
    product.find({},(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            res.send(result)
            productsdata=result;
        };
    });

});
app.get("/confirmingorder/:id",(req,res)=>{
    id=req.params.id
    checkout.deleteOne(ordereddata[id],(err)=>{
        if(err){
            console.log(err)
        }
        else{
            res.redirect("/seller/sellerdashboard")
        }
    })
});
app.get("/contact",(req,res)=>{
    res.sendFile(path.resolve("pages/contact.html"))
});

app.get("/about",(req,res)=>{
    res.sendFile(path.resolve("pages/about-us.html"))
});
app.get("/faq",(req,res)=>{
    res.sendFile(path.resolve("pages/faq.html"))
});
app.get("/logout",(req,res)=>{
    res.redirect("/user/userlogin")
});


module.exports=app;