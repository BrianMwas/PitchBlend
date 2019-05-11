
'use strict';
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fileupload = require('express-fileupload')
const expressSession = require('express-session')
const connectMongo = require('connect-mongo')
const flash = require('connect-flash');
const edge = require('edge.js')
const favicon = require('express-favicon')
const TWO_MIN = 1000 * 60 * 60 * 2;

//express start
const app = express()
const server = require('http').createServer(app)


const {
  PORT = 7000,
  NODE_ENV = 'development',
  SESS_NAME = 'sesionid',
  SESS_LIFETIME = TWO_MIN
} = process.env;

const IN_PROD = NODE_ENV === 'production';
const db = require('./config/keys').MongoURI


//Connect database
mongoose.connect(db, {
        useNewUrlParser: true
    })
    .then(()=> console.log('MongoDB connected'))
    .catch(err => console.log(err))

mongoose.Promise = global.Promise

//sessions
const mongoStore = connectMongo(expressSession)
app.use(expressSession({
    secret : 'secret',
    name : SESS_NAME,
    cookie : {
      maxAge: SESS_LIFETIME,
      sameSite : true,
      secure : IN_PROD
    },
    store : new mongoStore({
        mongooseConnection : mongoose.connection
    }),
    resave: false,
    saveUninitialized : false
}))
app.use(flash())

//Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})
const expressEdge = require('express-edge')



app.use(express.static('public'))
app.use(fileupload())
app.use(favicon(__dirname + '/public/favicon.png' ))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))
app.use(expressEdge)
app.set('views', `${__dirname}/views`)

app.use('*', (req, res, next) => {
  edge.global('auth', req.session.userId)
  next()
})

const validationCreatePostMiddleWare = require('./middleware/validationCreatePost')


//routes
app.use('/new/posts', validationCreatePostMiddleWare);
// app.use('/posts', validationCreatePostMiddleWare);

app.use('/', require('./controllers/homepage'))
app.use('/blogs', require('./controllers/posts'))
app.use('/user', require('./controllers/prof'))


server.listen(PORT, console.log(`App listening on port ${PORT}`))
