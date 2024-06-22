const crypto = require("crypto");
const nodemailer = require("nodemailer");

async function generateVerificationToken(user) {
  const token = crypto.randomBytes(32).toString("hex");
  user.emailVerificationToken = token;
  user.emailVerificationExpires = Date.now() + 3600000;
  await user.save();
  return token;
}

async function sendVerificationEmail(user, token) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "daviverma97819@gmail.com",
      pass: "omyf vldb xclb umnp",
    },
  });

  const mailOptions = {
    from: "daviverma97819@gmail.com",
    to: user.email,
    subject: "Email Verification",
    text: `Please verify your email by clicking the following link: 
           http://localhost:3000/api/user/verify-email?token=${token}`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  generateVerificationToken,
  sendVerificationEmail,
};
