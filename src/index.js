const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome on my portfolio api !');
})

app.post('/offers', (req, res) => {
  const data = req.body;
  if(data) {
    // Save the actual offer inside the dedicated database

    res.json({ message: `Current offer has been successfully saved`, offer: data});
  } else {
    res.statusCode = 401;
    res.json({ message: 'The current offer is empty' })
  }
})

app.listen(PORT, () => {
  console.log(`Your application is running on port : ${PORT}`)
})