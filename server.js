const express = require("express");
var router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
require('dotenv').config()

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

    var transport = {
      host: 'mx1.sitehost.co.nz',
      auth: {
        user:process.env.SITEHOST_USERNAME,
        pass:process.env.SITEHOST_PASSWORD
      }
    }
    
    var transporter = nodemailer.createTransport(transport)
    
    transporter.verify((error, success) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Server is ready to take messages');
      }
    });
    
    app.post("/api/email", (req, res) => {
      const { firstName,lastName,email, message,phoneNumber } = req.body;  
     
      let name = firstName +""+ lastName
      let uemail = email
      let msg = message
      let content = `name: ${name} \n email: ${uemail} \n phonenumber: ${phoneNumber} \n message: ${msg} `
    
      let mail = {
        from: name,
        to: 'eric@netbloom.co.nz',  //Change to email address that you want to receive messages on
        subject: 'New Message from Contact Form',
        text:content
      }
    
      transporter.sendMail(mail, (err, data) => {
        if (err) {
          res.json({
            msg: 'fail'
          })
        } else {
          res.json({
            msg: 'success'
          })
        }
      })
    });

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App is served at port ${port}`);
});