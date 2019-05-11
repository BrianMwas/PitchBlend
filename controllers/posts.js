const express = require('express')
const router = express.Router()


const Post = require('../database/model/post');
const path = require('path')
const Comment = require('../database/model/Comment')
const auth = require('../middleware/auth')


router.get("/posts", auth, async (req, res) => {
        await Post.find({})
          .populate('user_id', 'username')
          .populate({
            path: 'comments',
            populate: {
              path: 'user',
              select: 'username'
            }
          })
          .exec(function (err, post) {
            if (err) throw err
            const {
              user
            } = req.session
            //new posts appear first..
            let reversedPosts = post.slice().reverse()
            res.render('post', {
              reversedPosts,
              title: "Posts",
              user
            })
          })
        })

router.get('/post/:id', auth, async (req, res) => {
  await Post.findById(req.params.id)
    .populate('user_id', 'username')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'username'
      }
    })
    .exec(function (err, post) {
      if (err) console.log(err)
      const {
        user
      } = req.session
      res.render('postUnit', {
        title: "Bloggit",
        post,
        user
      })
    })

})

router.post('/post/:id/comment', auth, async (req, res) => {
  const {
    user
  } = req.session
  const post = await Post.findById(req.params.id)
  const comment = new Comment()
  comment.body = req.body.comment
  comment.blogPost = post._id
  comment.user = user
  await comment.save()
  post.comments.push(comment._id)
  await post.save()
  res.redirect('/blogs/posts')
})


router.get('/newpost', auth,(req, res) => {
  const {
    user
  } = req.session
  if (req.session.userId) {
    return res.render('newpost', {
      user,
      title: "Bloggit"
    });
  }
  res.redirect('/login')
})

router.get('/newpost/:id', auth, (req, res) => {
  const {
    user
  } = req.session
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      throw err;
    }
    res.render('newpost', {
      title: "Update Post",
      post,
      user
    })
  })
})


router.post('/newpost/', auth, (req, res) => {
    //if there is no file selected then the page reloads...

        if (Object.keys(req.files).length == 0) {
          return res.redirect("/blogs/newpost")
        }

        let {
          image
        } = req.files

        image.mv(path.resolve(__dirname, '..', 'public/img', image.name), (error) => {
          Post.create({
            ...req.body,
            image: `/img/${image.name}`,
            user_id: req.session.userId
          }, (error, post) => {
            console.log(error)
            const {
              user
            } = req.session
            res.redirect("/blogs/posts")
          })
        })

})


router.post('/newpost/:id', auth,(req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if(!post) res.status(404).send('Post was not found')
    else {

      let {
        image
      } = req.files


      image.mv(path.resolve(__dirname, '..', 'public/img', image.name), (error) => {
        post.title = req.body.title
        post.description = req.body.description
        post.image = `/img/${image.name}`
        post.content = req.body.content
        post.save()
         .then((post) => {
           res.redirect('/user/profile')
         }).catch((err) => {
           res.json(err)
         })
      }
      )
    }
  })
})

 router.get('/delete/:id', auth, async (req, res) => {
   await Post.findByIdAndRemove(req.params.id, (err, delPost) => {
     if (err) {
       req.flash('error_msg', "Error while trying to delete")
     }
     req.flash('success_msg', "Success deleting post")
     res.redirect('/user/profile')
   })
 })

module.exports = router
