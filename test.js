'use strict';
const mongoose = require('mongoose')
const Post = require('./database/model/post')

//Database connection
const db = require('./config/keys').MongoURI
mongoose.connect(db, {
        useNewUrlParser: true
    })
    .then(() => console.log("Mongodb connected"))
    .catch(err => console.log(err))


// Post.findByIdAndUpdate("5c98d151aea9c6303c94659f", {
//     title: "Maxwell"
// }, (error, post) => {
//     console.log(error, post)
// })


Post.find({}, (error, post) =>{
    console.log(error, post)
})



// Post.create({
//     name: "Brian mwangi",
//     title: "Names",
//     description: "Name description",
//     content: "My name is Brian Mwangi"
// }, (error, post) =>{
//     console.log(error, post)
// })


