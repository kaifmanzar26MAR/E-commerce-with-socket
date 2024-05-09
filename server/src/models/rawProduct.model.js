import mongoose, {Schema} from 'mongoose'

const rawProductSchema= new Schema({
    created_by:{
        type:Schema.Types.ObjectId,
        ref:'Seller',
        required:true,
    },
    p_id:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    p_name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    p_title:{
        type:String,
        required:true,
    },
    p_description:{
        type:String,
        required:true,
    },
    
},{timestamps:true});

const RawProduct = mongoose.model('RawProduct', rawProductSchema);
export default RawProduct;
