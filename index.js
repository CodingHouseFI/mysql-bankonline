var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var app = express();
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', router);
app.use(express.static('./client'));

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3307, // Generally this address should be: 3306
  user: 'root',
  password: '',
  database: 'bankonline',
  multipleStatements: true
});

connection.connect();

router.post('/mysql', function(req, res) {
  console.log(req.body.sql);
  console.log(req.body.params);
  connection.query(req.body.sql, req.body.params,
     function(err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(400).json({error: 'Internal server error'});
    }
    else {
      res.send(rows);
    }
  });
});

router.get('/customers', function(req, res) {
  var sql = 'SELECT id, name, balance FROM customers;';
  connection.query(sql,
     function(err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(400).json({error: 'Internal server error'});
    }
    else {
      res.send(rows);
    }
  });
});

router.post('/tranfer', function(req, res) {
  console.log(req.body.params);
  // from to amount
  var sql = '\
  START TRANSACTION;\
  SET @from = ?; SET @to = ?; SET @amount = ?;\
  INSERT INTO transactions (`from`, `to`, `amount`) values (@from, @to, @amount);\
  UPDATE customers SET balance = balance - @amount WHERE id = @from;\
  UPDATE customers SET balance = balance + @amount WHERE id = @to;\
  COMMIT;';

  connection.query(sql, req.body.params,
     function(err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(400).json({error: 'Internal server error'});
    }
    else {
      res.send(rows);
    }
  });
});

router.get('/transactions/:cid', function(req, res) {
  console.log(req.params.cid);
  var sql = '\
  SET @cid = ?;\
  SELECT transactions.`from`, transactions.amount, customers.name FROM transactions, customers WHERE\
    (transactions.`from` = @cid AND transactions.`to` = customers.id) OR\
    (transactions.`to` = @cid AND transactions.`from` = customers.id);';

  connection.query(sql, [req.params.cid],
     function(err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(400).json({error: 'Internal server error'});
    }
    else {
      res.send(rows);
    }
  });
});

router.get('/received/:cid', function(req, res) {
  console.log(req.params.cid);
  var sql = '\
  SELECT transactions.amount, customers.name FROM transactions, customers WHERE\
    transactions.`to` = ? AND transactions.`from` = customers.id;';

  connection.query(sql, [req.params.cid],
     function(err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(400).json({error: 'Internal server error'});
    }
    else {
      res.send(rows);
    }
  });
});

router.get('/sent/:cid', function(req, res) {
  console.log(req.params.cid);
  var sql = '\
  SELECT transactions.amount, customers.name FROM transactions, customers WHERE\
    transactions.`from` = ? AND transactions.`to` = customers.id;';

  connection.query(sql, [req.params.cid],
     function(err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(400).json({error: 'Internal server error'});
    }
    else {
      res.send(rows);
    }
  });
});

http.createServer(app).listen(3000);
console.log('http server is running on port #3000');
