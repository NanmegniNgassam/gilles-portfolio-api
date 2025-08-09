require('dotenv').config();
const { Resend } = require('resend');
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

app.post('/offers', async (req, res) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
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
    const response = await resend.emails.send({
      from: 'gilles@api.gillesngassam.com',
      to: 'nanmegningassam@gmail.com',
      subject: data['subject'],
      html: data['body'],
    });

    if(response.error) {
      res.status(501).json({ message: "The email wasn't delivered!", error: response.error })
    }
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


app.listen(PORT, () => {
  console.log(`Your application is running on port : ${PORT}`);
})

// Making the connection with the database
db.connect((error) => {
  if(error) {
    console.error('An error occured while connectiong to the database : ', error);
  } else {
    // Running the server
    app.listen(PORT, () => {
      console.log(`Your application is running on port : ${PORT}`);
    })
  }
})
