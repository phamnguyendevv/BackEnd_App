

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'



var ProductSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    Price: {
        type: Number,
    },
    image: {
        type: String,
    },
    offer: {
        type: String,
    },
    carouselImages: {
        type: Array,
    },
    color: {
        type: String,
    },
    size: {
        type: String,
    },
    category_id:{
        type: mongoose.Schema.Types.ObjectId, 
        required:true,
        ref : 'Category ', 
        
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, ProductSchema);


