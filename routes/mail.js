const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const AWS = require("aws-sdk");

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  SES: new AWS.SES({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-2",
  }),
});

router.post("/mailsend", async (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log("Data: ", req.body);

  const messageHtml = message.replace(/\n/g, "<br>");

  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${name}</li>
        <li>Email: ${email}</li>
        <li>Subject: ${subject}</li>
    </ul>
    <h3>Message</h3>
    <p>${messageHtml}</p>
  `;

  const mailOptions = {
    from: "k2awesomeness@gmail.com",
    to: "k2awesomeness@gmail.com",
    subject: subject,
    html: output,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ msg: "Email has been sent" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error sending email");
  }
});

module.exports = router;
