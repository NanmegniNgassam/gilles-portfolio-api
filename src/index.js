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
    db.query(`INSERT INTO offers (subject, body) VALUES ('${data['subject']}', '${data['body']}');`, (error, result) => {
      if (error) {
        res.status(500).json({ log : 'Database connection error', error });
      } else {
        res.json({ subject: data['subject'], body: data['body'] });
      }
    });

  } else {
    res.status(401).json({ message: 'The current offer is empty' });
  }
})

// Preparing the db connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'gillesng_dev',
  password: process.env.USER_PASSWORD,
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
