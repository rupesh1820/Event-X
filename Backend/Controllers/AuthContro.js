import crypto from "node:crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../Models/Users.js";

const JWT_SECRET = process.env.JWT_SECRET || "eventx-development-secret";

export const Register = async(req, res)=>{

  try {
    const { fullName, emailAddress, password, confirmPassword } = req.body
  if(password!==confirmPassword){
    return res.json({message:"Password not matched"})
  }
  if(!fullName || !emailAddress || !password || !confirmPassword ){
    return res.status(400).json({ message: "All fields are required" })
  }
  const existUser = await User.findOne({ emailAddress })
  if(existUser){
    return res.status(401).json({message:" this email already in use"})
  }
     if(!validator.isEmail(emailAddress)){
      return res.status(400).json({message:"email is not valid"})
     }
  const hashedpass =await bcrypt.hash(password, 10);

  const Users= await User.create({
   fullName,
   emailAddress,
   password:hashedpass,
  })
  return res.status(201).json({message: "User create succesfully"})
  } catch (error) {
    return res.status(401).json({error: "User create failed"})
  }
  
};

export const register = Register;

export const login = async (req, res) => {
  try {
    const { emailAddress, password } = req.body;

    if (!emailAddress || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ emailAddress });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, emailAddress: user.emailAddress },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        emailAddress: user.emailAddress,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};