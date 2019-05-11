const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username:  {
        type: String,
        required: true
    },
    firstName : String,
    secondName : String,
    email : {
        type: String,
        unique: true,
        required: true
    },
    profilePhoto : {
        type: String
    },
    password:  {
        type: String,
        required: true
    },
    posts : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
});

UserSchema.pre('save', function(next) {
    const user = this

    bcrypt.hash(user.password, 12, function(error, encrypt) {
        user.password = encrypt
        next()
    })
})

module.exports = mongoose.model('User', UserSchema)
