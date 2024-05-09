import mongoose,{Schema} from "mongoose";

const readyProductSchema= new Schema({
    rawProduct:{
        type:Schema.Types.ObjectId,
        ref:"RawProduct",
        required:true
    },
    seller:{
        type:Schema.Types.ObjectId,
        ref:"Seller",
        required:true
    },
    p_mrp:{
        type:Number,
        required:true
    },
    p_discount:{
        type:Number,
        required:true,
        default:5
    },
    p_addedQuantity:{
        type:Number,
        required:true
    },
},{timestamps:true})

const ReadyProduct= mongoose.model("ReadyProduct",readyProductSchema);

export default ReadyProduct;