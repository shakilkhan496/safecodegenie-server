const express = require('express')
const router = express.Router()

router.use('/chat',require('./chat'))
router.use('/auth',require('./auth'))
router.use('/user',require('./users'))

module.exports = router;