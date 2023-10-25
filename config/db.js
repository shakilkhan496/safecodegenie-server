const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://safecode:PiouDfqXrhH5bpM4@cluster0.83izqje.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});