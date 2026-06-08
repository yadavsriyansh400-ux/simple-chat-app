import User from "../models/User.js";

export const searchUser = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const users = await User.find({
      email: {
        $regex: email,
        $options: "i",
      },
    }).select("-password");

    res.json(users);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};