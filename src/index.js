const express = require('express');
const mysql = require('mysql2');

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
    res.json({ message: 'The current offer is empty' });
  }
})

// Preparing the db connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'gillesng_dev',
  password: ']q&C3)}U)sb0',
  database: 'gillesng_portfolio'
});


// Making the connection with the database
db.connect((error) => {
  if(error) {
    console.error('An error occured while connectiong to the database : ', error.message);
  } else {
    // Running the server
    app.listen(PORT, () => {
      console.log(`Your application is running on port : ${PORT}`);
    })
  }
})
  
