// import required dependencies
const express = require('express')
const bodyParser = require('body-parser')
const multer  = require('multer')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path');
const passport = require('passport')
require('module-alias/register')

const authenticateMiddleware = require('./middlewares/authenticate')
require('dotenv').config()


// initiate express app instance
var app = express()

// DB Connection
require('@config/db')()

// passport config
require('@config/passport')


// Use middlewares

// Serve Static Files
// app.use(express.static('images'));
app.use('/images', express.static(path.join(__dirname, 'images')))
// CORS Enabled for all requesting sources
app.use(cors())
// Request Logs
app.use(morgan('tiny'))

// Parse request body 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({limit: '50mb'}))

// passport
app.use(passport.initialize());

// Parse multi-part form data
app.use(multer().any())

// Default route
app.get('/', (req,res)=>{
    res.json({
        'name': 'Travel Right',
        'description': 'multi vendor ecommerce api',
        'version': '1.0',
        'base': '/api/v1'
    })
})

// Middlewares
app.use(authenticateMiddleware)

// Initiate other routes router
require('./routes/router')(app)

// App listening to requests
app.listen(process.env.PORT, ()=>{
    console.log("App listening to port: ", process.env.PORT)
})