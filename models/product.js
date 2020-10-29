const mongoose= require("mongoose") ;
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
var productSchema= new mongoose.Schema({
    name:String,
    sellingPrice:String,
    brand:String,
    age:String,
    category:String,
    description:String,
    sellerName:String,
    sellerLocation:String,
    sellerPhone:String,
    sellerEmail:String,
    image:String
}) ;
productSchema.set('timestamps', true);
module.exports=mongoose.model("product",productSchema) ;