const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234567890',
  database: 'foodiesuserdatabase'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});

app.post('/signup', (req, res) => {
  console.log(req.body);
  const { username, email, password, phone } = req.body;
  const user = { username, email, password, phone };
  db.query('INSERT INTO foodiesuserdatabase SET ?', user, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving user');
      return;
    }
    console.log('User saved successfully');
    res.status(200).send('User saved successfully');
  });
});

app.get('/login', (req, res) => {
  const { username, password } = req.query;
  db.query(
    `SELECT * FROM foodiesuserdatabase WHERE username = ? AND password = ?`,
    [username, password],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error logging in');
        return;
      }
      if (result.length === 0) {
        res.status(401).send('Invalid username or password');
        return;
      }
      res.status(200).send('Login successful');
    }
  );
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
