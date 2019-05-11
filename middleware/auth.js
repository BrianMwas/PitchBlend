const User = require('../database/model/Users')

module.exports = (req, res, next) => {
    User.findById(req.session.userId, (error, user) => {
        if (error || !user) {
            req.flash('error_msg', 'Log in to view the resource')
            return res.redirect('/login')
        }
        next()
    })
}