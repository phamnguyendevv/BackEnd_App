const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Token'    
const COLLECTION_NAME = 'Tokens'


// Declare the Schema of the Mongo model
var TokensSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref : 'User ', 
        
    },
    refreshTokensUsed:{
        type:Array,
        default  : [],
    },
    refreshToken:{
        type:String,
    },
    exp:{
        type:Date,
    },
},{
    timestamps:true,
    collection: COLLECTION_NAME,
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, TokensSchema);
