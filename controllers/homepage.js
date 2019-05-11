const express = require('express')
const router = express.Router()
const User = require('../database/model/Users')
const bcrypt = require('bcryptjs');
const redirectIfAuthenticated = require('../middleware/redirectIfAuthenticated')


router.get('/', (req, res) => {
    res.render('home', {
        title: "Home"
    })
})


router.get('/login', redirectIfAuthenticated, (req, res) => {
    res.render('login', {
        title: "Sign In"
    })
})

router.get('/signup', redirectIfAuthenticated,  (req, res) => {
    // console.log(req.flash('data'))
    res.render('register', {
        title: "Sign Up"
    })
})


router.post('/login', redirectIfAuthenticated, (req, res) => {
            const {
                email,
                password
            } = req.body
            req.flash('data', req.body)
            User.findOne({
                email
            }, (error, user) => {
                if (user) {
                    bcrypt.compare(password, user.password, (error, same) => {
                        if (same) {
                            req.session.userId = user._id
                            req.session.user = user
                            res.redirect('/blogs/posts')
                        } else {
                            req.flash('error_msg', "Wrong credentials")
                            return res.redirect('/login')
                        }
                    })
                } else {
                    req.flash('error_msg', "Email not registered")
                    return res.redirect('/login')
                }
            })
        }
)


router.post('/register', redirectIfAuthenticated, (req, res) => {
    req.flash('data', req.body)


    const {
        username,
        firstName,
        secondName,
        email,
        password,
        password2
    } = req.body

    let ers = []

    if (!username || !firstName || !secondName || !email || !password || !password2) {
        ers.push({
            msg: "Please fill in all your details"
        })
    }
    if (username.length < 3) {
        ers.push({
            msg: "Please enter a valid username with at least 3 characters"
        })
    }
    if (password !== password2) {
        ers.push({
            msg: "Passwords don't match"
        })
    }
    if (password.length < 6) {
        ers.push({
            msg: "Password should contain at least 6 characters"
        })
    }
    //console log the errors
    console.log(ers);
    User.findOne({
            email: email
        })
        .then(user => {
            if (user) {
                ers.push({
                    msg: "Email already registered.."
                })
            }
            if (ers.length > 0) {
                res.render('register', {
                    ers,
                    title: "Sign up"
                })
            } else {
                const newUser = new User({
                    username,
                    firstName,
                    secondName,
                    email,
                    password
                })
                newUser.save()
                    .then(user => {
                        req.flash('success_msg', "You are now registered and can login")
                        res.redirect('/login')
                    })
                    .catch(error => console.log(error))
            }
        })
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

module.exports = router
