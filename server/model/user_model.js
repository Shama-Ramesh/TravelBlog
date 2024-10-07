const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  
  username: {
    type: String,
    required: true
  },
  age: {
    type: Number,

  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
 
  },
  address: {
    type: String,

  },
  password: {
    type: String,
    required: true
  },
  image: {
    type: String, // You can store the image URL or path here
    required: false
  },
  status: {
    type: String, // You can store the image URL or path here
  
  }
});

module.exports = mongoose.model("user", userSchema);
