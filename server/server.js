const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const port = 3000;
const MONGO_URI = 'mongodb+srv://atulcp2001deploy2db:zCZPzqQy5IQN0GIr@cluster0.vkyq1pm.mongodb.net/deploy2db?retryWrites=true&w=majority'

// Connect to MongoDB Atlas
const connectDB = async () => {

        try {
            const conn = await mongoose.connect(MONGO_URI);
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


app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.get('/api/options', async (req,res) => {
    try {
        const options = await Option.find({});
        res.json(options);
      } catch (error) {
        console.error('Failed to fetch options from MongoDB', error);
        res.status(500).json({ error: 'Failed to fetch options' });
      }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


const optionData = [
    '1 - Find your mission',
    '2 - Address your fears',
    '3 - Deepen your relationships',
    '4 - Design your roadmap of possibilities',
    '5 - Create your legacy',
];


const optionData1 = [
    {id: 1, desc:'Find your mission'},
    {id: 2, desc:'Address your fears'},
    {id: 3, desc:'Deepen your relationships'},
    {id: 4, desc:'Design your roadmap of possibilities'},
    {id: 5, desc:'Create your legacy'},
]

// atulcp2001deploy2db: zCZPzqQy5IQN0GIr