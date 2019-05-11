

const validationCreatePostMiddleWare = (req, res, next) => {
    if (!req.files) {
        res.redirect('/newblog')
    }
    next()
}

module.exports = validationCreatePostMiddleWare