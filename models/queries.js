var mongoose=require("mongoose") ;
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
var querySchema= new mongoose.Schema({
    
    buyerUserName:String,
    buyerName:String,
    sellerEmail:String,
    message:String,
    product:ObjectId
}) ;

querySchema.set('timestamps', true);
module.exports=mongoose.model("queries",querySchema) ;
