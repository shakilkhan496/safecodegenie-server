const jwt=require('jsonwebtoken')
const secret='test@123'

module.exports={
    encode:(obj)=>{
      let token =jwt.sign(obj,secret)
      return token
    },
    decode:(token)=>{
        let data =jwt.verify(token,secret)
        return data 
    }
}