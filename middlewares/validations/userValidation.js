const sendResponce = require('../../utilities/sendModel')

exports.create = (req, res, next) => {
    let { firstName, lastName, email, password } = req.body
    if (!firstName)
        return sendResponce.error(res, '402', 'First name is required')
    // if(!lastName)
    // return sendResponce.error(res,'402','Last name is required')
    if (!email)
        return sendResponce.error(res, '402', 'Email is required')
    if (!password)
        return sendResponce.error(res, '402', 'Passward is required')
    if (password.length < 6)
        return sendResponce.error(res, '402', 'Passward length minimum 6 characters')
    next()
}

exports.update = (req, res, next) => {
    let { firstName, lastName, email, password } = req.body
    const { id } = req.params
    if (!id)
        return sendResponce.error(res, '402', 'User id not found')
    if (!firstName)
        return sendResponce.error(res, '402', 'First name is required')
    if (!lastName)
        return sendResponce.error(res, '402', 'Last name is required')
    if (!email)
        return sendResponce.error(res, '402', 'Email is required')
    if (!password)
        return sendResponce.error(res, '402', 'Passward is required')
    if (password.length < 6)
        return sendResponce.error(res, '402', 'Passward length minimum 6 characters')
    next()
}