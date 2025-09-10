require('dotenv').config();
const { Resend } = require('resend');
const express = require('express');
const mysql = require('mysql2')

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
    // Send the email to the owner of the portfolio
    const response = await resend.emails.send({
      from: 'gilles@api.gillesngassam.com',
      to: 'nanmegningassam@gmail.com',
      subject: data['subject'],
      html: data['body'],
    });

    if(response.error) {
      return res.status(501).json({ message: "The email wasn't delivered!", error: response.error })
    }

    return res.status(200).json(response);
  } else {
    res.status(401).json({ message: 'The current offer is empty' });
  }
});

const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'gillesng_dev',
  password: process.env.USER_PASSWORD,
  database: 'gillesng_portfolio'
})

// Running the server
db.connect((error) => {
  if (error) {
    console.error('❌ Failed to connect to MySQL:', error.code, error.message);
  } else {
    app.listen(PORT, () => {
      console.log(`Your application is running on port : ${PORT}`);
    })
  }
})
