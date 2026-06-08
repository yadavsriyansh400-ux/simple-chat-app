import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = uuidv4();

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      verificationToken,
    });

    const verificationLink =
      `${process.env.BASE_URL}/api/auth/verify/${verificationToken}`;

    const html = `
      <h2>Email Verification</h2>

      <p>Click below to verify your account:</p>

      <a href="${verificationLink}">
        Verify Email
      </a>
    `;

    await sendEmail(
      email,
      "Verify Your Email",
      html
    );

    res.status(201).json({
      message: "Verification email sent",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
    });

    if (!user) {
      return res.status(400).send("Invalid token");
    }

    user.isVerified = true;

    user.verificationToken = "";

    await user.save();

    res.send("Email verified successfully");
  } catch (error) {
    console.log(error);

    res.status(500).send("Server Error");
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email first",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};