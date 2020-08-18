const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;

const app = express();

app.use(bodyParser.json());

// MySql
const connection = mysql.createConnection({
  host: 'us-cdbr-east-02.cleardb.com',
  user: 'bab843682e72fd',
  password: 'b0714587',
  database: 'heroku_48733283c1cb889'
});

const pool  = mysql.createPool({
  host: 'us-cdbr-east-02.cleardb.com',
  user: 'bab843682e72fd',
  password: 'b0714587',
  database: 'heroku_48733283c1cb889'
});
 
// ... later
pool.query('select 1 + 1', (err, rows) => { /* */ });


// Route
app.get('/', (req, res) => {
  res.send(`<h1>Welcome to my API</h1>
  <h2>This is an API CRUD build in nodejs with mysql working on heroku!</h2>
  <p>GET: https://cprieto-node-mysql.herokuapp.com/customers</p>
  <p>GET by ID: https://cprieto-node-mysql.herokuapp.com/customers/id</p>
  <p>POST: https://cprieto-node-mysql.herokuapp.com/add</p>
  <p>PUT: https://cprieto-node-mysql.herokuapp.com/update/id</p>
  <p>DELETE: https://cprieto-node-mysql.herokuapp.com/delete/id</p>
  `);
});

// all customers
app.get('/customers', (req, res) => {
  const sql = 'SELECT * FROM customers';

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('Not result');
    }
  });
});

app.get('/customers/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM customers WHERE id = ${id}`;
  connection.query(sql, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      res.json(result);
    } else {
      res.send('Not result');
    }
  });
});

app.post('/add', (req, res) => {
  const sql = 'INSERT INTO customers SET ?';

  const customerObj = {
    name: req.body.name,
    city: req.body.city
  };

  connection.query(sql, customerObj, error => {
    if (error) throw error;
    res.send('Customer created!');
  });
});

app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { name, city } = req.body;
  const sql = `UPDATE customers SET name = '${name}', city='${city}' WHERE id =${id}`;

  connection.query(sql, error => {
    if (error) throw error;
    res.send('Customer updated!');
  });
});

app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM customers WHERE id= ${id}`;

  connection.query(sql, error => {
    if (error) throw error;
    res.send('Delete customer');
  });
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
