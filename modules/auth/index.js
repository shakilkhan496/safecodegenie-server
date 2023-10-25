const controller = require('./authController')
const express = require('express')
const router = express.Router()
const userValidation = require('../../middlewares/validations/userValidation')

router.post('/login',controller.login)
router.post('/signup',userValidation.create,controller.signup)

module.exports = router;