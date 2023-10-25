const sendResponse = require('../../utilities/sendModel')
const request = require('request')
const User=require('./users')


exports.getUsers = (req, res) => {
    User.getUsers()
    .then(resp=>{
       sendResponse.success(res, 'success', resp) 
    }).catch(err=>{
        sendResponse.error(res, 400,'Error while fetching users', err)
    })
    
}

exports.approveUnapprove = (req, res) => {
    const {userId,isApproved}=req.body
    User.updateUser(userId,{isApproved})
    .then(resp=>{
       sendResponse.success(res, 'success', resp) 
    }).catch(err=>{
        sendResponse.error(res, 400,'Error while updating users', err)
    })
    
}

exports.enableDisable = (req, res) => {
    const {userId,isDeleted}=req.body
    User.updateUser(userId,{isDeleted})
    .then(resp=>{
       sendResponse.success(res, 'success', resp) 
    }).catch(err=>{
        sendResponse.error(res, 400,'Error while updating users', err)
    })
    
}