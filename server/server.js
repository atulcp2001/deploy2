const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '../.env') });
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

// Connect to MongoDB Atlas
const connectDB = async () => {

        try {
            const conn = await mongoose.connect(process.env.MONGO_URI);
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

connectDB();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.get('/options', async (req,res) => {
    try {
        const options = await Option.find({});
        res.json(options);
      } catch (error) {
        console.error('Failed to fetch options from MongoDB', error);
        res.status(500).json({ error: 'Failed to fetch options' });
      }
});


app.post('/signup', async (req,res) => {

    const { name, email, password } = req.body;
    console.log('signup data received!');

    try{
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
            }

            // Generate salt
            const salt = await bcrypt.genSalt(10);

            // Hash the password with the generated salt
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create a new user with the hashed password
            const newUser = new User({
            name,
            email,
            password: hashedPassword,
            });

            // Save the user to the database
            const savedUser = await newUser.save();

            // Send verification email
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
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
                text: 'Please verify your account by clicking the following link: http://localhost:3000/verify',
                // You can also include an HTML version of the email with a link/button styled as a hyperlink
            };
  
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                 console.error('Error sending verification email:', error);
                //  res.status(201).json({message: `error in sending verification email ${error}`})
                } else {
                console.log('Verification email sent:', info.response);
                }
            });
  
            // Return a success response
            res.status(200).json({ message: 'User registered successfully!' });

    } catch (error) {

        // Handle any errors
        console.error(error);
        res.status(500).json({ error: 'Server error' });

    }

});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});