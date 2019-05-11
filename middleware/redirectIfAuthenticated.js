const User = require('../database/model/Users')

module.exports = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect('/posts')
  }
  next();
}
