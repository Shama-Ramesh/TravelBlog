const mongoose = require('mongoose');

// Creating schema for bucket list
const bucketListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    famousPlace: {
        type: String,
        required: true
    },
    totalBudget: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
});

// Exporting model
module.exports = mongoose.model("bucketlist", bucketListSchema);
