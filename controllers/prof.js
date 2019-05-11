const Post = require('../database/model/post');
const express = require('express')
const router = express.Router()
const User = require('../database/model/Users')
const auth = require('../middleware/auth')




router.get('/profile', auth, (req, res) => {
    // console.log(req.flash('data'))
    const {
        user
    } = req.session

    Post.find({
            user_id: user._id
        })
        .populate('user_id', 'username')
        .exec(function (err, post) {
            if (err) throw err;
            res.render('profile', {
                title: "Profile",
                user,
                post
            })
        })
})

router.get('/profile/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      console.log(err)
    } else {
      res.render('editProfile', {
          title: "Edit profile",
          user
        }
      )
    }
  })
})

router.post('/profile/:id', auth, async (req, res) => {
   await User.findById(req.params.id, (err, usr)=> {
        if (err) {
            console.log(err);
            res.status(500).send("sorry", err)
        }
        else {
            if(!usr) {
                res.status(404).send()
            } else {
                if(req.body.firstName) {
                    usr.firstName = req.body.firstName
                }

                if (req.body.secondName) {
                    usr.secondName = req.body.secondName
                }
                if (req.body.email) {
                    usr.email = req.body.email
                }
                usr.save()
                .then((user) => {
                  Post.find({
                          user_id: user._id
                      })
                      .populate('user_id', 'username')
                      .exec(function (err, post) {
                          if (err) throw err;
                          res.render('profile', {
                              title: "Profile",
                              user,
                              post
                          })
                      })
                }).catch((err) => {
                  res.status(500).send()
                })
            }
        }
    })
})

module.exports = router
