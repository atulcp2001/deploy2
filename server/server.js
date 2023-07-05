const path = require('path'); 
// require('dotenv').config({ path: path.join(__dirname, '../.env') }); // comment it for production deployment
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cookieParser = require("cookie-parser");
const nodemailer = require('nodemailer');
const User = require('./models/User');
const app = express();
const cors = require('cors');
const port = process.env.PORT|| 3000;
const emailAccount = process.env.EMAIL_ACCOUNT;
const emailPassword = process.env.EMAIL_PASSWORD;
const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT;
const secretKey = process.env.JWT_SECRET;
const clientUrl = process.env.CLIENT_URL;
// const serverUrl = process.env.SERVER_URL; //for development
const serverUrl = "https://deploy2be.onrender.com"; // for production deployment



// Connect to MongoDB Atlas
const connectDB = async () => {

        try {
            const conn = await mongoose.connect(process.env.MONGO_URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true,
            });
            console.log(`Mongo DB connected: ${conn.connection.host}`)
        } catch (error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
        }
    };
    
// Define a schema for the options collection
const optionSchema = new mongoose.Schema({
    id: Number,
    desc: String,
  });
  
  // Define a model for the options collection
  const Option = mongoose.model('Option', optionSchema, 'options');

// Helper function to generate a unique verification token
function generateVerificationToken() {
  // Generate a random string or use a specific algorithm to generate a unique token
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Helper function to send a verification email
function sendVerificationEmail(email, verificationToken) {
  const transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: true,
    auth: {
      user: emailAccount,
      pass: emailPassword,
    },
  });

  const mailOptions = {
    from: emailAccount,
    to: email,
    subject: 'Account Verification',
    text: `Please verify your account by clicking the following link: ${serverUrl}/verify/${verificationToken}`,
    // You can also include an HTML version of the email with a link/button styled as a hyperlink
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending verification email:', error);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
}

// Helper function to generate a reset password token
function generateResetToken() {
  const token = crypto.randomBytes(20).toString('hex');
  return token;
}

// Helper function to send a reset password email
function sendResetPasswordEmail(email, resetToken) {
  const transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: true,
    auth: {
      user: emailAccount,
      pass: emailPassword,
    },
  });

  const mailOptions = {
    from: emailAccount,
    to: email,
    subject: 'Reset Password',
    text: `To reset your password, please click the following link: ${serverUrl}/reset-password/${resetToken}`,
    // You can also include an HTML version of the email with a link/button styled as a hyperlink
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending reset password email:', error);
    } else {
      console.log('Reset password email sent:', info.response);
    }
  });
}

  //
connectDB();

// Serve static files (e.g., CSS, JavaScript) from the "build" folder
app.use(express.static(path.join(__dirname, '../client/build')));

// app.use(cors({origin: 'http://localhost:3001', credentials: true}));
app.use(cors({origin: `${clientUrl}`, credentials: true}));
app.use(express.json());
app.use(cookieParser());

//Routes - Api end points

//Home
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});


// Send Options

app.get('/options', async (req,res) => {
    try {
        const options = await Option.find({});
        res.json(options);
      } catch (error) {
        console.error('Failed to fetch options from MongoDB', error);
        res.status(500).json({ error: 'Failed to fetch options' });
      }
});


//Signup user endpoint

app.post('/signup', async (req,res) => {

    const { name, email, password } = req.body;
    console.log('signup data received!');

    try{
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
              console.log('user already exists');
            return res.status(400).json({ message: 'User already exists' });
            
            }

            // Generate a unique verification code
              const verificationToken = generateVerificationToken();


            // Generate salt
            const salt = await bcrypt.genSalt(10);

            // Hash the password with the generated salt
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create a new user with the hashed password
            const newUser = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken, 
            });

            // Save the user to the database
            const savedUser = await newUser.save();

            // Send verification email
            console.log('The serverUrl is:', serverUrl);
            sendVerificationEmail(savedUser.email, savedUser.verificationToken);
  
            // Return a success response
            res.status(200).json({ message: 'User registered successfully!' });

    } catch (error) {

        // Handle any errors
        console.error('Error registering user',error);
        res.status(500).json({ error: 'Server error' });

    }

});


// Verify user account endpoint

app.get('/verify/:verificationToken', async (req, res) => {
  
  console.log('about to verify the account!')
  const { verificationToken } = req.params;
  
  try {
    // Find the user with the matching verification token
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({ message: 'Invalid verification token' });
    }

    // Update user's account as verified
    
    user.isVerified = true;
    user.verificationToken = null; // Reset the verification token
    await user.save();
    
    console.log('User verficiation complete!')
    // Redirect the user to the main website or display a success message
    
    res.redirect(`${process.env.CLIENT_URL}/verified`);
    
  } catch (error) {
    console.error('Error verifying user account:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Login endpoint

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('data received!');
  
  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Passwords match, generate a JWT token
      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

      // Set the token as a cookie in the response 
      res.cookie('jwttoken', token, { httpOnly: true, maxAge: 3600000,sameSite:'none', secure: true, }); // Production - Max age set to 1 hour
      // res.cookie('jwttoken', token, { httpOnly: true, maxAge: 3600000,sameSite:'lax', secure: false }); // Development - Max age set to 1 hour

      // Console log the generated cookie
      //console.log('Generated cookie:', res.get('Set-Cookie'));

      // Return a success message along with the token
      console.log(`User ${user.email} successfully logged in`);
      res.send({ message: 'Login successful'});

    } else {
      // Passwords do not match, authentication failed
      res.status(401).json({ message: 'Invalid credentials!' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//Logout endpoint

app.get('/logout', (req, res) => {
  
  // Clear session data and perform logout logic

  res.clearCookie('jwttoken');
  // Additional logic to invalidate the JWT token on the server-side if necessary

  // Redirect to the homepage or any other desired page
  // res.redirect(`${process.env.CLIENT_URL}`);
   res.send('ok');
});

// Protected endpoint - requires authentication
app.get('/protected', (req, res) => {
  // Check if the token exists in the request cookies
  const token = req.cookies.jwttoken;

  if (!token) {
    //console.log('unauthorized! Could not find the user token in cookie');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify the token and extract the user ID
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId;

    // Use the user ID to retrieve user information from the database
    // and perform any necessary actions

    res.status(200).json({ message: 'Access granted to protected endpoint' });
  } catch (error) {
    console.error('Error:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
});


// Forgot Password endpoint
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset password token
    const resetToken = generateResetToken();

    // Save the reset password token to the user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expiration time: 1 hour
    await user.save();

    // Send reset password email
    sendResetPasswordEmail(user.email, resetToken);

    res.json({ message: 'Reset password email sent' });
  } catch (error) {
    console.error('Error sending reset password email:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset Password endpoint
app.post('/reset-password', async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    // Find the user with the matching reset password token and token expiration time
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({ message: 'Invalid or expired reset token' });
    }

    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Hash the new password with the generated salt
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password and clear the reset password token fields
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    console.log('Password reset successfully for user', user.email)
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset Password Token End point - when the user clicks the link in the resetPassword email.
app.get('/reset-password/:resetToken', async (req, res) => {
  const { resetToken } = req.params;

  try {
    // Find the user with the matching reset token
    const user = await User.findOne({ resetPasswordToken: resetToken });

    if (!user) {
      console.log('no user found with the resToken');
      return res.redirect(`${process.env.CLIENT_URL}`);
    }

    // Redirect the user to the frontend reset password page
    console.log('user found with the resToken. Redirecting to reset-password page!')
    res.redirect(`${process.env.CLIENT_URL}/reset-password?resetToken=${resetToken}`);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

//Complete the password reset with token
app.post('/reset-password/:resetToken', async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  try {
    // Find the user with the matching reset token
    const user = await User.findOne({ resetPasswordToken: resetToken });

    if (!user) {
      console.log('No user found with the given token')
      return res.status(404).json({ message: 'Invalid reset token' });
    }

    // Reset the user's password
    
    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Hash the new password with the generated salt
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    user.resetPasswordToken = null; // Reset the reset token field
    await user.save();

    // Return a success response
    console.log('Password reset successfully for user', user.email);
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Catch-all route to serve the "index.html" file
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});