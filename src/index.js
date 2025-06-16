const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome on my portfolio api !');
})

app.listen(PORT, () => {
  console.log(`Your application is running on port : ${PORT}`)
})