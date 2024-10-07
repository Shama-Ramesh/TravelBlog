const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    message: {
      type: String,
    },
  
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("feedback", FeedbackSchema);
