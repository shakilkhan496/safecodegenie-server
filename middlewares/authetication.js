const { decode } = require('../utilities/jwt')
const sendResponce = require('../utilities/sendModel')
const { getUserById } = require('../modules/users/users')

module.exports.tokenVerification = (req, res, next) => {
     try {
          let token = req.headers.token
          // console.log('token==========',req.headers)
          if (!token)
               return sendResponce.error(res, '401', "Unauthrized")

          let tokenData = decode(token)
          getUserById(tokenData._id)
               .then(resp => {
                    if (!resp)
                         return sendResponce.error(res, '401', "Unauthrized")
                    req.user = resp
                    // console.log('userdata', req.user);
                    next()
               }).catch(err => sendResponce.error(res, '401', "Unauthrized"))
     } catch (error) {
          sendResponce.error(res, '401', "Unauthrized")
     }



}

module.exports.adminTokenVerification = (req, res, next) => {
     try {
          let token = req.headers.token
          // console.log('token==========',req.headers)
          if (!token)
               return sendResponce.error(res, '401', "Unauthrized")

          let tokenData = decode(token)
          getUserById(tokenData._id)
               .then(resp => {
                    if (!resp)
                         return sendResponce.error(res, '401', "Unauthrized")
                    if (resp.type!='admin')
                         return sendResponce.error(res, '401', "Unauthrized")
                    req.user = resp
                    // console.log('userdata', req.user);
                    next()
               }).catch(err => sendResponce.error(res, '401', "Unauthrized"))
     } catch (error) {
          sendResponce.error(res, '401', "Unauthrized")
     }



}



