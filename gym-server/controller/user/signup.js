const {
  generateVerificationToken,
  sendVerificationEmail,
} = require("../../emailService");
const User = require("../../models/user");

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Create new user (without email verification)
    const user = new User({ email, password, emailVerified: false });

    // Generate verification token
    const token = await generateVerificationToken(user);

    // Send verification email
    await sendVerificationEmail(user, token);

    res.status(201).json({
      message:
        "User registered. Please check your email to verify your account.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Email verification route
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // Verify the token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Verification link is invalid or has expired." });
    }

    // Update user to set email as verified
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email successfully verified!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signup, verifyEmail };
