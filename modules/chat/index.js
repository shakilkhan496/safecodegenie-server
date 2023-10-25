const express= require('express')
const router=express.Router()
const controller= require('./chatController')
const { tokenVerification } = require('../../middlewares/authetication')

router.get('/',tokenVerification,controller.getChat)
router.post('/',tokenVerification,controller.getAnswer)


module.exports = router;