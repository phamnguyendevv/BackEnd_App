const express = require('express')
const access = require('./access')

const products = require('./products')

const router = express.Router()



router.use('/api/v0', access)
router.use('/api/v0', products)




module.exports = router
