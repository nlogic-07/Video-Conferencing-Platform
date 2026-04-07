import { User } from "../models/user.model.js";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  const { name, username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (user) {
      return res.status(httpStatus.FOUND).json({
        message: "User already exists!!",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      username: username,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(httpStatus.CREATED).json({
      message: "Signup successful",
      success: true,
    });
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: `Something went wrong ${e}`,
      success: false,
    });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      message: "Enter username and password",
    });
  }
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "User doesnt exist , signup first",
        success: false,
      });
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(401).json({
        message: "wrong password",
        success: false,
      });
    }

    const jwtToken = jwt.sign(
      { username: user.username, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    user.token = jwtToken;
    await user.save();
    res.status(httpStatus.OK).json({
      message: "Login successful",
      success: true,
      jwtToken,
    });
  } catch (e) {
    res.status(500).json({
      message: `Something went wrong ${e}`,
      success: false,
    });
  }
};

export { login, register };
