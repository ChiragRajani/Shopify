var mongoose=require("mongoose") ;
var passportLocalMongoose=require("passport-local-mongoose") ;


var loginSchema= new mongoose.Schema({
    username:String,
    name:String,
    contact:Number,
    password:String
}) ;
loginSchema.plugin(passportLocalMongoose) ;
module.exports=mongoose.model("users",loginSchema) ;
