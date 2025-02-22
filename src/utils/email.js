const userModel = require("../models/user.model");
const nodemailer = require("nodemailer");

// Initialize nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: "phamtrungnguyenvx99@gmail.com",
    pass: "jquv uecu futl rocg",
  },
});

const checkEmails = async (email) => {
  try {
    const existingUser = await userModel.findOne({ email });

    return existingUser;
  } catch (error) {
    throw error;
  }
};

const sendEmail = async (email, subject, text) => {
  const mailOptions = {
    from: "phamtrungnguyenvx99@gmail.com",
    to: email,
    subject: subject,
    html: text,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  checkEmails,
  sendEmail,
};
