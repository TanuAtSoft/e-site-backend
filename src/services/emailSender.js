const nodemailer = require('nodemailer');
const User = require("../models/user.model")


// Create a transporter with your email service provider's configuration
const transporter = nodemailer.createTransport({
  service: 'E-site Order Service',
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // use SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Function to send email
const sendEmail = async (to, subject, text) => {
  try {
    // Define the email options
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to,
      subject,
      text,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};



async function getUserEmailById(id) {
  try {
    const seller = await User.findById(id);
    return seller.email; // Assuming the seller model has an 'email' field
  } catch (error) {
    console.error('Error fetching seller email:', error);
    throw error;
  }
}


module.exports = { transporter, sendEmail, getUserEmailById  };