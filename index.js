const express = require('express')
const app = express()
const mongo = require('./config/db');
const users = require('./modules/users/users');
require('dotenv').config();
const stripe = require('stripe')(`${process.env.sk}`);
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path')
const cors = require('cors'); // Import the cors package

// Allow requests from a specific origin (http://localhost:4200)
const corsOptions = {
  origin: 'https://6538cd05de38746436b584d2--euphonious-mermaid-48586c.netlify.app',
  methods: 'GET,POST', // Add other HTTP methods as needed
};

app.use(cors(corsOptions));

function removeGmailDomain(email) {
  // Check if the email contains '@gmail.com'
  const indexOfGmail = email.indexOf('@gmail.com');

  if (indexOfGmail !== -1) {
    // Remove the '@gmail.com' portion
    return email.substring(0, indexOfGmail);
  } else {
    // If the email doesn't contain '@gmail.com', return it as is
    return email;
  }
}

//nodemailer+++++++++++++++++++++++
const config = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: `${process.env.user}`,
    pass: `${process.env.appPass}`
  }
}

const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve('./views/'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./views/'),
};

const transporter = nodemailer.createTransport(config);

const send = (data) => {
  const transporter = nodemailer.createTransport(config);
  transporter.sendMail(data, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info).response;
      return info.response
    }
  })
}
//++++++++++++++++++++++++++++++++++



// const endpointSecret = 'whsec_I4j13yXp3VGmMCTq8XL7FHRUJ4wBOmwU';
const endpointSecret = `${process.env.endpointSecret}`;

app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.expired':
      const checkoutSessionExpired = event.data.object;
      // const customerSubscription = event.data.object;
      // Then define and call a function to handle the event checkout.session.async_payment_succeeded
      // console.log(customerSubscription);
      const customerr = await stripe.customers.retrieve(checkoutSessionExpired.customer);
      users.deleteUserById(customerr.metadata.user_id)
      await stripe.customers.del(checkoutSessionExpired.customer);
      // console.log(customer.metadata.user_id);
      // Then define and call a function to handle the event checkout.session.expired
      break;

    case 'customer.subscription.created':
      const customerSubscription = event.data.object;
      // Then define and call a function to handle the event checkout.session.async_payment_succeeded
      // console.log(customerSubscription);
      const customer = await stripe.customers.retrieve(customerSubscription.customer);

      console.log(customer.metadata.user_id);

      await users.updateUser(customer.metadata.user_id, {
        isApproved: true
      })

      const user = await users.getUserById(customer.metadata.user_id);
      transporter.use('compile', hbs(handlebarOptions))
      if (user.email) {
        const mailOptions = {
          from: `"Welcome to SafeCode Genie" <${process.env.user}>`, // sender address
          template: "email", // the name of the template file, i.e., email.handlebars
          to: user.email,
          subject: `Welcome to SafeCode Genie, ${removeGmailDomain(user.email)}`,
          context: {
            name: user.firstName,
            company: 'my company'
          },
        };

        try {
          await transporter.sendMail(mailOptions);
          res.send({ message: 'success', user })
        } catch (error) {
          console.log(`Nodemailer error sending email to ${user.email}`, error);
        }
      }




      break;

    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");

  next();
});

const data = {
  firstName: 'Shakil',
  lastName: 'Khan',
  email: 'shakilkhan496@gmail.com',
  password: '$2a$08$EKlWnnHkDlLnktTYR3meB.Ica.lj3g41T0eZ2yLnbH3luYKuRI7lq',
  type: 'admin',
  isDeleted: false,
  createdAt: '2023-08-22T05:18:31.092Z',
  updatedAt: '2023-09-23T17:52:11.553Z',
  __v: 0,
  isApproved: true
}

app.get('/getUser', async (req, res) => {
  const user = await users.getUserByEmail('anish@gmail.com');
  res.send(user);
})



app.use('/api/v1', require('./modules'))



app.get('/', (req, res) => {
  res.send('hello')
})


app.listen(3000, () => {
  console.log('server run on 3000');
})