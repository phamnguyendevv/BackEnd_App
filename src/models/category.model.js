const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Category'    
const COLLECTION_NAME = 'Categories'



var CategoriesSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    image:{
        type:String,
    },
    
},{
    timestamps:true,
    collection: COLLECTION_NAME,
});


module.exports = mongoose.model(DOCUMENT_NAME, CategoriesSchema);
