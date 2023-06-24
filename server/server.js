const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
const optionData = [
    '1 - Find your mission',
    '2 - Address your fears',
    '3 - Deepen your relationships',
    '4 - Design your roadmap of possibilities',
    '5 - Create your legacy',
];

const optionData1 = [
    {option:'1 - Find your mission'},
    {option:'2 - Address your fears'},
    {option:'3 - Deepen your relationships'},
    {option:'4 - Design your roadmap of possibilities'},
    {option:'5 - Create your legacy'},
]

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.get('/api/options', (req,res) => {
    console.log('data received from client!')
    const options = optionData;
    res.json(options);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
