const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '../.env') }); // comment it for production deployment
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('./models/User');
const app = express();
const cors = require('cors');
const port = process.env.PORT|| 3000;
const emailAccount = process.env.EMAIL_ACCOUNT;
const emailPassword = process.env.EMAIL_PASSWORD;
const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT;
const serverUrl = "https://deploy2be.onrender.com"; // for production deployment
// const serverUrl = "http://localhost:3000"; // for development



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

  //
connectDB();

app.use(cors());
app.use(express.json());


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


// Verify user account endpoint
app.get('/verify/:verificationToken', async (req, res) => {
  const { verificationToken } = req.params;

  try {
    // Find the user with the matching verification token
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({ message: 'Invalid verification token' });
    }

    // Update user's account as verified
    user.isVerified = true;
    await user.save();

    // Redirect the user to the main website or display a success message
    res.redirect('/verified');
  } catch (error) {
    console.error('Error verifying user account:', error);
    res.status(500).json({ error: 'Server error' });
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
            sendVerificationEmail(savedUser.email, savedUser.verificationToken);
  
            // Return a success response
            res.status(200).json({ message: 'User registered successfully!' });

    } catch (error) {

        // Handle any errors
        console.error('Error registering user',error);
        res.status(500).json({ error: 'Server error' });

    }

});


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

app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});