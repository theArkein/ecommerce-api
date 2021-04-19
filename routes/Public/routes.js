const express = require('express')
const router = express.Router()

require('./category')(router)
require('./product')(router)
require('./vendor')(router)


module.exports = router