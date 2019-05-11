const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  body : {
    type : String,
    required : true,
    trim : true,
  },
  blogPost :{
     type: Schema.Types.ObjectId,
     required: true,
     ref : 'Post'
  },
  createdAt : {
    type: Date,
    default: Date.now
  }
})


const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
