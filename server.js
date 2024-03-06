// Import necessary libraries
const express = require('express');
const twilio = require('twilio');

// Twilio credentials and setup
const accountSid = 'AC16cb07da6c2be5c7774ddf1f7c934b67'; // Replace with your Account SID
const authToken = '95be779850850b7deff78a011cafe354'; // Replace with your Auth Token
const client = new twilio(accountSid, authToken);

// Initialize your Express app
const app = express();
app.use(express.json()); // To parse JSON bodies

let verifiedNumbers = {}; // Store verified numbers

// Endpoint to start verification
app.post('/start-verification', (req, res) => {
  const { phoneNumber } = req.body;

  const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code
  verifiedNumbers[phoneNumber] = { verificationCode, isVerified: false };

  // Ideally, you would send this verification code via SMS to the user.
  // For demonstration, we'll just log it and return a message.
  console.log(`Verification code for ${phoneNumber}: ${verificationCode}`);

  res.status(200).send('Verification code sent. Please verify.');
});


// Endpoint to verify the code
app.post('/verify-code', (req, res) => {
    const { phoneNumber, verificationCode } = req.body;
  
    if (verifiedNumbers[phoneNumber] && verifiedNumbers[phoneNumber].verificationCode == verificationCode) {
      verifiedNumbers[phoneNumber].isVerified = true;
      res.status(200).send('Phone number verified successfully.');
    } else {
      res.status(400).send('Invalid code or phone number.');
    }
  });
  

// Define a POST route to send SMS
app.post('/send-sms', (req, res) => {
  const { to, body } = req.body;
    
  client.messages
    .create({
      body: body,
      to: to,  // Text this number
      from: '+1 (509) 774-2295' // From a valid Twilio number
    })
    .then((message) => {
      console.log(message.sid);
      res.status(200).send('Message sent!');
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Failed to send message.');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
