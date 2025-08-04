const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/', (_, res) => {
  res.send('Welcome on my portfolio api !');
})

app.post('/offers', (req, res) => {
  const data = req.body;
  if(data) {
    // Save the actual offer inside the dedicated database
    db.query(`INSERT INTO offers (subject, body) VALUES ("${data['subject']}", "${data['body']}");`, (error, result) => {
      if (error) {
        res.status(500).json({ log : 'Database connection error', error });
      } else {
        res.json({ subject: data['subject'], body: data['body'] });
      }
    });

    // Send the email to the owner of the portfolio

  } else {
    res.status(401).json({ message: 'The current offer is empty' });
  }
})

// Preparing the db connection
const db = mysql.createConnection({
  host: process.env.HOST_URL,
  user: process.env.USER_NAME,
  password: process.env.USER_PASSWORD,
  database: process.env.DATABASE_NAME
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
