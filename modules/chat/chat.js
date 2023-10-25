const Chat= require('./chatModel')


module.exports={
    createChat:async(obj)=>{
      try {
        let chat= new Chat(obj)
       let data =await chat.save()
       return data
      } catch (error) {
        throw error
      }
       
    },

    getChat:async(createdBy,page=0)=>{
      let data= await Chat.find({createdBy}).sort({_id:-1}).skip(page*10).limit(10)
      return data
    },
}