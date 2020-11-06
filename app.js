const mongoose= require('mongoose') ;
const express= require('express') ;
const app=express() ;
const product = require("./models/product.js");
const dotenv= require('dotenv').config()
const query = require("./models/queries.js");
const users = require("./models/user.js");
const bodyParser= require('body-parser') ;
const  path= require('path') ;
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session=require('express-session') ;
const flash=require('express-flash');
const passportLocalMongoose = require('passport-local-mongoose');
const user = require('./models/user.js');
const queries = require('./models/queries.js');
mongoose.Promise = global.Promise;
 mongoose.connect("mongodb://localhost:27017/olx",({ useNewUrlParser: true,useUnifiedTopology: true  }));
// mongoose.connect("mongodb+srv://chirag12:nisharajani@cluster0.fr1j0.mongodb.net/shopify?retryWrites=true&w=majority",({ useNewUrlParser: true,useUnifiedTopology: true  }))
const port=process.env.PORT || 5500 ;
app.use(bodyParser.urlencoded({extended:true})) ;
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine","ejs") ;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    session({
        secret: "SellProducts",
        resave: false,
        saveUninitialized: false,
    })
);

passport.use(new LocalStrategy(users.authenticate()));
passport.serializeUser(users.serializeUser());
passport.deserializeUser(users.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

app.get("/",(req,res)=>{
    if (req.query.search) {
        const regex = new RegExp(matchRegex(req.query.search), 'gi');
        product.find({"name": regex }, function(err, product) {
            if(err) {
                console.log(err);
            } else {
               res.render("show", {user:req.user, product:product });
            }
        }); 
     }
     else{
        product.find({}, function(err, product) {
            if(err) {
                console.log(err);
            } else {
               res.render("show", {user:req.user, product:product });
            }
        }); 
     }
}) ;

app.get("/edit-product/:id",(req,res)=>{
    var b=req.params.id ;
    product.findById(req.params.id,function(err,foundproduct){
        res.render("/edit",{user:req.user, product:foundproduct})
    }) ;
}) ;
app.get("/my-products",checkAuthenticated,(req,res)=>{
    product.find({'sellerEmail': req.user.username }, function(err, product) {
        if(err) {
            console.log(err);
        } else {
           res.render("my-products", {user:req.user, product:product });
        }
    }); 
})
app.post("/edit-product/:id",(req,res)=>{
    User.updateOne({ _id: req.params.id}, 
        { $set:
            {
                name:req.body.name,
                sellingPrice:req.body.price,
                brand:req.body.brand,
                age:req.body.age ,
                category:req.body.category,
                description:req.body.description,
                sellerName:req.body.sellerName,
                sellerLocation:req.body.location,
                sellerPhone:req.body.contact ,
                sellerEmail:req.body.email,
                image:req.body.image
            }
         }, function (err, user){
        if (err)
         return next(err);
        res.redirect("product/"+req.params.id) ;
        
        
});
}) ;
app.get("/post-product",checkAuthenticated,(req,res)=>{
    res.render("post-product",{ user:req.user}) ;
})

app.get("/register",(req,res)=>{

    res.render("register",{ user:req.user}) ;
}) 

app.post("/register", function (req, res) {
    users.register(
        new users({ username: req.body.email, name: req.body.name,  contact:req.body.contact }), req.body.password,
        function (err, user) {
            if (err) {
                var errors = err;
                console.log(err);
                return res.render("register", { error: err });
            }
            console.log("User Registerd "+ req.body.email);
            res.render("login",{user:req.user});
        }


    );
});

app.get("/login",(req,res)=>{
    res.render("login",{ user:req.user,expressFlash:""}) ;
}) 



app.get("/product/:id",(req,res)=>{
    var a = new mongoose.Types.ObjectId(req.params.id) ;
    var b =" ";

    if(req.user)
        b=req.user.username ;
    console.log(b) ;
    console.log(a) ;
    product.findById(req.params.id,function(err,foundproduct){
        if(err)
            console.log(err);
        else{
            queries.find({'product':a,'sellerEmail':b},function(err,foundQuery){
                if(err)
            console.log(err);
            else
            console.log(foundQuery)
                res.render("product-info",{user:req.user, product:foundproduct,query:foundQuery}) ;
            })
            
        }
    }); 
}) ;
app.post("/post/:id",(req,res)=>{
   console.log("pro id" + req.params.id)

  var id=new mongoose.Types.ObjectId(req.params.id.toString()) ;
var obj={
    buyerUserName:req.body.buyerUsername,
    buyerName:req.body.buyerName,
    sellerEmail:req.body.sellerEmail,
    message:req.body.message,
    product:id
    

} ;

queries.create(obj,function(err,query){
    if(err)
        console.log(err) ;
    else    
        console.log("Added sucesfully  " + query.buyerName) ;
    }) ;
res.redirect("/") ;

}) ;
app.post("/login",passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: "Invalid username or password.",
    }),(req, res)=>{
        console.log("User logged in",req.user)
    }
);

app.post("/addproduct",(req,res)=>{
    var obj={   
            name:req.body.name,
            sellingPrice:req.body.price,
            brand:req.body.brand,
            age:req.body.age ,
            category:req.body.category,
            description:req.body.description,
            sellerName:req.body.sellerName,
            sellerLocation:req.body.location,
            sellerPhone:req.body.contact ,
            sellerEmail:req.body.email,
            image:req.body.image
        } ;
       product.create(obj,function(err,products){
            if(err)
                console.log(err) ;
            else    
                console.log("Added sucesfully" + product) ;
            }) ;
     res.redirect("/");
})

app.get("/signout", (req, res) => {
    req.logOut();
    res.redirect("/");
});

app.get("/changepassword",checkAuthenticated,(req,res)=>{
res.render("change-password",{user:req.user})
}) ;
app.post('/changepassword', checkAuthenticated,function (req, res) {
    

    //userSchema.findOne({ 'username': req.user.username },(err, user) => {
      // Check if error connecting
      users.findOne({'username':req.user.username}, function(err,returneduser){
            returneduser.setPassword(req.body.newpassword, function(err) {
                  returneduser.save(function(err){
                      console.log(err);
                  });
              });
              req.logOut();
              req.flash("Password changed Sucessfully, Please Login again") ;
              res.render("login",{user:req,user,expressFlash:"Password changed sucessfully!Please Login Again"}) ;      
  });
});


function matchRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
}

app.listen(port);
