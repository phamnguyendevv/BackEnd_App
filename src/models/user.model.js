const mongoose = require("mongoose");

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  addresses: [
    {
      name: String,
      number: String,
      street: String,
      city: String,
      country: String,
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
}, {
  timestamps: true, // Add timestamps to the document (createdAt, updatedAt)
  collection: COLLECTION_NAME, // Specify the collection name explicitly
});

module.exports = mongoose.model(DOCUMENT_NAME, userSchema);
