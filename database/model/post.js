'use strict';

const mongoose = require('mongoose');


const PostSchema =  new mongoose.Schema({
    user_id : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title : {
      type: String,
      trim : true
    },
    description: {
      type: String,
      trim: true
    },
    image: {
        type:String,
        required: true,
    },
    content:{
      type: String,
      trim: true
    },
    comments : [
      {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Comment'
      }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Post = mongoose.model('Post', PostSchema)

module.exports = Post
