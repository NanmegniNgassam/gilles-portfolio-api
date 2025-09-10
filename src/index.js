require('dotenv').config();
const { Resend } = require('resend');
const express = require('express');
const mysql = require('mysql2')

const app = express();
const PORT = process.env.PORT || 3000
app.use(express.json());

const allowedOrigins = [
  'https://gilles-ngassam.pisoftlite.com',
  'https://gillesngassam.com'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if(allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
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
    // Save the offer inside the database
    db.query(`INSERT INTO offers (subject, body) VALUES ("${data['subject']}", "${data['body']}");`, (error, result) => {
      if (error) {
        res.status(500).json({ log : 'Database connection error', error });
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
      return res.status(501).json({ message: "The email wasn't delivered!", error: response.error })
    }

    return res.status(200).json({ subject: data['subject'], body: data['body'] });;
  } else {
    res.status(401).json({ message: 'The current offer is empty' });
  }
});

const db = mysql.createConnection({
  host: process.env.HOST_URL,
  port: process.env.PORT,
  user: process.env.USER_NAME,
  password: process.env.USER_PASSWORD,
  database: process.env.DATABASE_NAME
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
