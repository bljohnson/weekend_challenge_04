var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false}); // required in order to POST (app.post)
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/weekend_challenge_04';

// spin up server
app.listen(3000, 'localhost', function (req, res) {
  console.log('Now serving 3000');
});

// make public folder static
app.use(express.static('public'));

// base URL
// logs to Atom terminal since coming from server side
app.get('/', function (req, res) {
  console.log('in base URL');
  res.sendFile(path.resolve('views/index.html')); // gets this path
});

app.get('/getList', function (req, res){
  console.log('in getList URL');
  // create array to hold animal stock
    var list = [];
    pg.connect(connectionString, function (err, client, done){
      // get all animals in zoo and store in stock var
      var currentList = client.query('SELECT task, category, completed FROM list;');
      // push each row into list array
      var rows = 0;
      currentList.on('row', function (row) {
        list.push(row);
      }); // end stock push
      currentList.on('end', function (){
        return res.json(list); // allows list to be displayed in DOM
      });
    }); // end connect function
  }); // end app.get for getList

// post route (requires the urlencodedParser 'INJECTION' between route and function)
app.post('/postNewTask', urlencodedParser, function(req, res){
  console.log('in postNewTask URL:' + req.body.taskName);
  pg.connect(connectionString, function(err, client, done){
    client.query('INSERT INTO list (task, category, completed) VALUES ($1, $2, $3)', [req.body.taskName, req.body.categoryName, req.body.taskStatus]); // add new row in db table for animal being added by user
  }); // end connect function
}); // end app.post for postNewAnimal
