var express=require('express');
var app=express.Router();
var path = require('path')
app.use(express.static("pages"));

const session=require('express-session');


// const res = require("express/lib/response");
app.use(session({secret:'project'}));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

const Userregister=require('../schema/userlogin.js');
const order=require("../schema/cart.js");
const product=require("../schema/products_schema.js");
const checkout=require("../schema/checkout.js");
const mongodb=require("../mongodb/mongodb.js");




app.get('/userlogin', function(req,res){
        res.sendFile(path.resolve('pages/login-register.html'));
})

var user1;
app.post("/userlogin",(req,res)=>{
    console.log(req.body)
    var a=req.body.usermail;
    var b=req.body.password;
    Userregister.findOne({usermail:a,password:b},function(err,result1){
        if(err)
        {
            console.log(err);
        }
        else
        {
            if(result1 == null)
            {
                res.send("error")
            }
            else{
                user1=result1;
                req.session.visited=true;
                res.send("success")
            }
        }
        
    })
})

app.post("/userregister",(req,res)=>{
    var a=req.body.ufname;
    var b=req.body.ulname;
    var c=req.body.usermail;
    var d=req.body.upassword;
    var e=req.body.umobilenumber;
    Userregister.findOne({usermail:c,mobilenumber:e},(err,result)=>{
        if(!err)
        {
            if(result==null)
            {
                Userregister.create({
                    firstname:a,
                    lastname:b,
                    usermail:c,
                    password:d,
                    mobilenumber:e,
                },function(err){
                    if(err)
                    console.log('Something Went wrong'+err);
                    else
                    console.log('User registered');
                    res.redirect('/user/userlogin')
                });
            }
            else{
                res.redirect("/user/userlogin")
            }
        }
        else{

        }
    })

});

//profile page
app.get("/userprofile",(req,res)=>{
    if(req.session.visited==true){
    res.sendFile(path.resolve("pages/myprofile.html"))
    }
    else{
        res.redirect("/user/userlogin")
    }
});

app.get("/home",(req,res)=>{
    if(req.session.visited==true){
        res.sendFile(path.resolve("pages/home.html"))
    }
    else{
        res.redirect("/user/userlogin")
    }    
    })
//getting user data
app.get("/userprofiledata",(req,res)=>{
    var a=user1.usermail;
    Userregister.findOne({usermail:a},(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log(result)
            res.send(result)
        }
    }
    ) 
});

app.get("/userforgotpassword",(req,res)=>{
    res.sendFile(path.resolve("pages/forgotpassword.html"));
});

app.post("/userforgotpassword",(req,res)=>{
    a=req.body.email;
    if(!a){
        res.redirect("/userforgotpassword");
    }
    else{
        res.redirect("/userupdatepassword");
    }
});


app.get("/userupdatepassword",(req,res)=>{
    res.sendFile(path.resolve("pages/updatepassword.html"))
});
app.post("/userupdatepassword",(req,res)=>{
    a=req.body.newpassword;
    b=req.body.rnewpassword;
    c=req.body.email;
    if(a===b){
        Userregister.updateOne({usermail:c,password:a},function(err,result){
            if(err){
                console.log(err)  
            }
            else{
                if(result.modifiedCount==0)
                {
                    res.redirect('/user/userupdatepassword');
                }
                else{
                    console.log(result);
                    res.redirect('/user/userlogin');
                } 
                
            }
        });
    }
    else{
        res.redirect("/user/userupdatepassword")
        req.session.visited=false;
    }
    
});




var productdata;
var orderdata;
app.post("/getproductid",(req,res)=>{
    product.find({"Product_name":req.body.productname},function(err,docs){
        if(err){
            res.send(err)
        }
        else{
            console.log(docs)
            productdata=docs
            res.send(docs)
        }
    })
})

app.get("/checkout",(req,res)=>{
    if(req.session.visited==true)
    {
        res.sendFile(path.resolve("pages/checkout.html"))
    }
    else{
        res.redirect("/user/userlogin")
    }
    
});
app.get("/product",(req,res)=>{
    if(req.session.visited==true){
        res.sendFile(path.resolve("pages/single-product.html"))
    }
    else{
        res.redirect("/user/userlogin")
    }
});
//cart
app.get("/maincart",(req,res)=>{
    if(req.session.visited==true){
    res.sendFile(path.resolve("pages/shopping-cart.html"))
    }
    else{
        res.redirect("/user/userlogin")
    }
});
//adding cart
app.get("/cart",(req,res)=>{
    var a=user1.usermail;
    var b=productdata[0].Store_id;
    var c=productdata[0].Price;
    var d=productdata[0].Product_name;
    var e=productdata[0].Images
    console.log(productdata)
    console.log(user1)
    order.create({
        usermail:a,
        sellermail:b,
        product_name:d,
        price:c,
        images:e
    },(err)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log("add to cart")
            res.redirect("/user/maincart")
        }
    })
})

//cartdata
app.get("/cartdata",(req,res)=>{
    var a=user1.usermail;
    order.find({usermail:a},(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            orderdata=result;
            res.send(result)
        };
    });

});
//deleting in cart
app.get("/deletecart/:id",(req,res)=>{
    var id=req.params.id;
    order.deleteOne(orderdata[id],(err)=>{
        if(err){
            console.log(err)
        }
        else{
            res.redirect("/user/maincart")
        }
    })
});

//placing order
app.post("/orderproduct",(req,res)=>{
    for(var i=0;i<orderdata.length;i++){
        var a=req.body.fname;
        var b=req.body.lname;
        var c=req.body.address;
        var d=req.body.city;
        var e=req.body.state;
        var f=req.body.pincode;
        var g=req.body.number;
        var h=orderdata[i].usermail;
        var j=orderdata[i].sellermail;
        var k=orderdata[i].price;
        var l=orderdata[i].product_name;
        var m=orderdata[i].images
        if(a==""||b==""||c==""||d==""||e==""||f==""||g==""){
            res.redirect("/user/checkout")
        }
        else{
        checkout.create({
            usermail:h,
            sellermail:j,
            product_name:l,
            price:k,
            username:a,
            Address:c,
            Mobile_number:g,
            State:e,
            Pincode:f,
            Images:m,
        },(err)=>{
            if(err){
                console.log(err)
            }
            else{
                console.log("ordered")
                id=req.params.id
                order.deleteOne(orderdata[id],(error)=>{
                    if(error){
                        console.log(error)
                    }
                    else{
                        res.redirect("/user/myorders")
                    }

                })
            }
        })
    }
    };
})

app.get("/shopcart",(req,res)=>{
    if(req.session.visited==true){
    res.sendFile(path.resolve("pages/shop-list-left-sidebar.html"))
    }
    else{
        res.redirect("/user/userlogin")
    }
});
app.get("/logout",(req,res)=>{
    res.redirect("/user/userlogin")
    req.session.visited=false;
});

app.get("/myorders",(req,res)=>{
    if(req.session.visited==true){
    res.sendFile(path.resolve("pages/myorders.html"))
    }
    else{
        res.redirect("/user/userlogin");
    }
})
//my orders data
var myorder
app.get("/myorder",(req,res)=>{
    var a=user1.usermail;
    checkout.find({usermail:a},(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            myorder=result
            res.send(result)
        }
    })
})
//cancel order

app.get("/cancel/:id",(req,res)=>{
    var id=req.params.id;
    order.deleteOne(myorder[id],(err)=>{
        if(err){
            console.log(err)
        }
        else{
            res.redirect("/user/myorders")
        }
    })
});
app.get("/about",(req,res)=>{
    res.sendFile(path.resolve("pages/about-us.html"))
});

app.get("/contact",(req,res)=>{
    res.sendFile(path.resolve("pages/contact.html"))
});
app.get("/faq",(req,res)=>{
    res.sendFile(path.resolve("pages/faq.html"))
});

app.get("/userupdatepassword",(req,res)=>{
    res.sendFile(path.resolve("pages/updatepassword.html"))
});

app.get("/testing",(req,res)=>{
    product.find({},function(err,docs){
        if(err){
            console.log(err)
        }
        else{
            console.log(docs.length)
            res.send(docs)
        }
    })
})

app.get("/getinfo",(req,res)=>{
    product.find({},function(err,docs){
        if(err){
            console.log(err)
        }
        else{
            console.log(docs.length)
            res.send(docs)
        }
    })
});

app.get("/usercount",(req,res)=>{
    Userregister.find({},function(err,result){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.send(result);
        }
        
    })

})

module.exports=app;