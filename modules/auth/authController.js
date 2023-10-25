const users = require('../users/users')
const sendResponce = require('../../utilities/sendModel')
const { encode } = require('../../utilities/jwt')
const bcrypt = require('bcryptjs')
const stripe = require('stripe')(`${process.env.sk}`);


module.exports = {
   login: async (req, res) => {
      try {
         let { email, password } = req.body
         if (!email) {
            return sendResponce.error(res, 400, 'Email is required')
         }
         if (!password) {
            return sendResponce.error(res, 400, 'Password is required')
         }

         let user = await users.getUserByEmail(email.trim())
         if (!user)
            return sendResponce.error(res, 400, 'Bad credentials')
         if (!user.isApproved)
            return sendResponce.error(res, 400, 'Your account under process please contact your admin')
         if (user.isDeleted)
            return sendResponce.error(res, 400, 'Your account disabled please contact your admin')

         // console.log(user, 'user data-----------');
         const pass = await bcrypt.compare(password, user.password)
         if (!pass)
            return sendResponce.error(res, 400, 'Bad credentials')
         let token = encode({ _id: user._id })
         sendResponce.success(res, 'success', { token, type: user.type })
      } catch (error) {
         sendResponce.error(res, 400, 'Bad credentials')
      }
   },
   signup: async (req, res) => {
      console.log('i am here')
      const expirationTime = Math.floor(Date.now() / 1000) + 1860; // 1860 seconds (31 minutes)
      try {
         let { firstName, lastName, email, password } = req.body
         password = bcrypt.hashSync(password, 8);
         let user = await users.createUser({ firstName, email, password })


         // const userId = userResponse._id.toString();
         console.log(user._id.toString())

         const { id } = await stripe.customers.create({
            email: email, // optional
            name: firstName, // optional
            metadata: {
               user_id: user._id.toString()  // Or anything else
            }
         })

         const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], // Accept card payments
            customer: id, // Specify the customer ID
            metadata: {
               user_id: user._id.toString()  // Or anything else
            },
            line_items: [
               {
                  price: `${process.env.price}`, // Specify the product or price ID
                  quantity: 1, // Quantity of the product
               },
            ],
            mode: 'subscription', // You can use 'subscription' if it's a recurring payment
            success_url: 'https://bot.crocsocial.com/#/auth', // Redirect URL after successful payment
            cancel_url: 'https://bot.crocsocial.com/#/auth', // Redirect URL if the payment is canceled
            expires_at: expirationTime,
         });

         sendResponce.success(res, 'success', session)
      } catch (error) {
         if (error.code == 11000)
            sendResponce.error(res, 400, 'Email already exist')
         else
            sendResponce.error(res, 400, 'Error while signup user')
      }
   },
}