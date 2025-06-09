import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import twilio from 'twilio';
import rateLimit from 'express-rate-limit';
import { cookieOptions, clearCookieOptions } from '../utils/cookieConfig.js';
import { validateCookieOptions } from '../utils/authTest.js';

// Initialize Twilio client with account credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;
const client = twilio(accountSid, authToken);

// Create rate limiter
const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { 
        success: false, 
        message: "Too many OTP requests. Please try again after 15 minutes." 
    }
});

// Count total number of users
export const countUsers = async (req, res) => {
    try {
        const userCount = await userModel.countDocuments(); // Count total users
        res.json({ count: userCount });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching user count',
            error: error.message
        });
    }
};


// Update sendOTP function
const sendOTP = async (req, res) => {
  try {
      // Check for required credentials
      if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
          throw new Error('Missing Twilio credentials');
      }

      const { mobile } = req.body;
      if (!mobile || mobile.length !== 10) {
          return res.status(400).json({
              success: false,
              message: 'Please provide a valid 10-digit mobile number'
          });
      }

      // Initialize Twilio client
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      // Send SMS
      const message = await client.messages.create({
          body: `Your Yummiz verification code is: ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: `+91${mobile}` // Assuming Indian numbers
      });

      // Store OTP in user document
      await userModel.findOneAndUpdate(
          { mobile },
          { 
              otp,
              otpExpiry: new Date(Date.now() + 5 * 60000) // 5 minutes expiry
          },
          { upsert: true }
      );

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (twilioError) {
    // Handle Twilio-specific errors
    console.error("Twilio Error:", twilioError);

    if (twilioError.code === 20003) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed with Twilio",
      });
    }

    if (twilioError.code === 21211) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
      });
    }
    throw twilioError;
  }
} catch (error) {
  console.error('OTP Send Error:', error);
  res.status(500).json({
      success: false,
      message: error.message || 'Failed to send OTP'
  });
}
};

// Update verifyOTP function
const verifyOTP = async (req, res) => {
  const { mobile, otp } = req.body;
  try {
      if (!mobile || !otp) {
          return res.status(400).json({
              success: false,
              message: "Mobile number and OTP are required"
          });
      }

     // Find user and verify OTP from our database
     const user = await userModel.findOne({ 
      mobile,
      otp,
      otpExpiry: { $gt: new Date() }
  });

  if (!user) {
      return res.status(400).json({
          success: false,
          message: "Invalid OTP or OTP has expired"
      });
  }

  // Clear the OTP after successful verification
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie('token', token, cookieOptions);

  res.json({
    success: true,
    token,
    user: { 
        name: user.name, 
        mobile: user.mobile 
    },
    message: "OTP verified successfully"
});

} catch (error) {
console.error('OTP Verification Error:', error);
res.status(500).json({
    success: false,
    message: "Failed to verify OTP",
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
});
}
};

// login user
const loginUser = async (req, res) => {
  const { email, password, mobile } = req.body;
  try {
      // Find user by email or mobile
      const user = await userModel.findOne({ 
          $or: [
              { email: email },
              { mobile: mobile }
          ]
      });

      if (!user) {
          return res.json({ success: false, message: "User doesn't exist" });
      }
// If login with password
if (password) {
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
  }
  const token = createToken(user._id);
  res.cookie('token', token, cookieOptions);
  
  // Validate cookie settings in development
  if (process.env.NODE_ENV !== 'production') {
    const cookieValidation = validateCookieOptions(res);
    console.log('Cookie validation:', cookieValidation);
  }
  
  return res.json({ 
      success: true, 
      token, 
      user: { name: user.name, email: user.email },
      message: "User logged in successfully" 
  });
}

         // If login with OTP
         if (mobile) {
          // Generate OTP
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          
          // Store OTP in user document
          user.otp = otp;
          user.otpExpiry = new Date(Date.now() + 5 * 60000); // 5 minutes expiry
          await user.save();

          // Send SMS using your existing Twilio setup
          await client.messages.create({
              body: `Your Yummiz login verification code is: ${otp}`,
              from: process.env.TWILIO_PHONE_NUMBER,
              to: `+91${mobile}`
          });

      return res.json({
        success: true,
        requireOTP: true,
        message: "OTP sent successfully",
      });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

// Create JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Register user
const registerUser = async (req, res) => {
  const { name, email, password, mobile } = req.body;
  try {
    // Validate input
    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if user exists
    const existingUser = await userModel.findOne({ 
      $or: [
          { email: email },
          { mobile: mobile }
      ]
  });

  if (existingUser) {
    if (existingUser.email === email) {
        return res.json({ 
            success: false, 
            message: "Email already registered" 
        });
    }
    if (existingUser.mobile === mobile) {
        return res.json({ 
            success: false, 
            message: "Mobile number already registered" 
        });
    }
}

// Validate email
if (!validator.isEmail(email)) {
    return res.json({ 
        success: false, 
        message: "Invalid email format" 
    });
}

    // Validate password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      mobile: mobile || undefined, // Only add mobile if provided
    });

    // Save user
    const savedUser = await newUser.save();

    // Generate token
    const token = createToken(savedUser._id);

    // Send success response
    res.json({
      success: true,
      token,
      user: {
        name: savedUser.name,
        email: savedUser.email,
        mobile: savedUser.mobile,
      },
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error details:", error);

    // Send appropriate error message
    if (error.code === 11000) {
      res.json({
        success: false,
        message: "Email or mobile number already exists",
      });
    } else {
      res.json({
        success: false,
        message: "Registration failed. Please try again.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
};

export { loginUser, registerUser, sendOTP, verifyOTP, otpLimiter };
