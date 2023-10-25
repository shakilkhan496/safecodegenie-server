const sendResponse = require('../../utilities/sendModel')
const request = require('request')
const chat=require('./chat')


exports.getChat = (req, res) => {
    chat.getChat(req.user._id,req.query.page)
    .then(resp=>{
        sendResponse.success(res, 'success', resp)
    }).catch(err=> sendResponse.error(res,402,'Error while fetching data'))
}

exports.getAnswer = (req, res) => {
    try {
        const {question,answer} = req.body
       let options = {
        'method': 'POST',
        'url': 'http://inference-lb-36339029.eu-west-2.elb.amazonaws.com/query/',
        'headers': {
            'Content-Type': 'application/json',

        },
        body: JSON.stringify({
            "query": question
        })

    };
    request(options, function (err, response,body) {
        if (err){
            console.log('error======', err);
        sendResponse.error(res,402,'Error while fetching data')
        }
        else {
            console.log('-------------------',response.body); 
            let answer
            try {
              answer=JSON.parse(response.body).body  
            } catch (error) {
                answer='Not found'
            }
            
            
           chat.createChat({
            question,
            answer,
            createdBy:req.user._id
           })
           sendResponse.success(res, 'success', {
                answer})
        }
    });
    // console.log(req.body) 
    // sendResponse.success(res, 'success', {
    //                 answer:'hello i am chat bot how are you dsd dsd sds dsds dsd sdsd sds dsd ss dsddf sdfgsdg sdfgsdf gsdfg sdfg sdfgsdf gsdfg sdfg sdfgsfg sdfg sdfg sdfgsdf gdf hfdh fghghfg fj fhj jfgj ghjk ghj fgh dfg dfgf dd hfgh '})
    } catch (error) {
        console.log('error======', error);
        sendResponse.error(res,402,'Error while fetching data')
    }

}