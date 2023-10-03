const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { KnownEmailSendStatus,EmailClient } = require("@azure/communication-email");
require("dotenv").config();
// This code demonstrates how to fetch your connection string
// from an environment variable.
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
const emailClient = new EmailClient(connectionString);

//REGISTER
router.post('/register', async (req,res) => {
    //Check if user exists
    const userExist = await User.findOne({username: req.body.username});
    if(userExist) return res.status(400).send('User already exists');

    //hash the password 
    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(req.body.password, salt);

    //create user in database
    const user = new User({
        username: req.body.username,
        password: hashpass
    });
    const savedUser = await user.save();

    res.redirect('/success.html');
});


//LOGIN
router.post('/login', async (req,res) => {
    //Check if user exists
    const user = await User.findOne({username: req.body.username});
    if(!user) return res.status(400).send('Username doesnt ecist');

    //Check if password is valid
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Username or password incorrect');

    //create and assign token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, { expiresIn: "1hr"});

    res.cookie("token", token,{
        httpOnly: true
    });

    return res.redirect("/home/home");
});

router.post('/email', async (req,res) =>{
    const POLLER_WAIT_TIME = 10
    try {
      const message = {
        senderAddress: "<DoNotReply@799aa518-9ea0-4ae5-8531-600088599e6a.azurecomm.net>",
        content: {
          subject: req.body.name+" "+req.body.email,
          plainText: req.body.message,
        },
        recipients: {
          to: [
            {
              address: "<coletzyn@gmail.com>",
              displayName: "Customer Name",
            },
          ],
        },
      };
  
      const poller = await emailClient.beginSend(message);
  
      if (!poller.getOperationState().isStarted) {
        throw "Poller was not started."
      }
  
      let timeElapsed = 0;
      while(!poller.isDone()) {
        poller.poll();
        console.log("Email send polling in progress");
  
        await new Promise(resolve => setTimeout(resolve, POLLER_WAIT_TIME * 1000));
        timeElapsed += 10;
  
        if(timeElapsed > 18 * POLLER_WAIT_TIME) {
          throw "Polling timed out.";
        }
      }
  
      if(poller.getResult().status === KnownEmailSendStatus.Succeeded) {
        res.send("SUCCESS");
        console.log(`Successfully sent the email (operation id: ${poller.getResult().id})`);
      }
      else {
        throw poller.getResult().error;
      }
    } catch (e) {
      console.log(e);
    }
  
});

module.exports = router;
