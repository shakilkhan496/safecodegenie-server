const express = require('express')
const router = express.Router()
const controller = require('./userController');
const { adminTokenVerification } = require('../../middlewares/authetication');

router.get('/',adminTokenVerification,controller.getUsers)
router.put('/approval',adminTokenVerification,controller.approveUnapprove)
router.put('/enable',adminTokenVerification,controller.enableDisable)

module.exports = router;