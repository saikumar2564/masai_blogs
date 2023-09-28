const mongoose = require("mongoose");
require("dotenv").config();


const blogSchema = mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This establishes a relationship with the User model
    required: true,
  },
  title: {
    type: String
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      username: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
    },
  ],
},{versionKey:false});

const blogmodel = mongoose.model("blog", blogSchema);

module.exports = { blogmodel };
