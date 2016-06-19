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

app.get('/getList', function (req, res) {
  console.log('in getList URL');
  // create array to hold tasks
  var list = [];
  pg.connect(connectionString, function (err, client, done) {
    // get all tasks and store in list var
    var currentList = client.query('SELECT id, task, completed FROM list;');
    // push each row into list array
    var rows = 0;
    currentList.on('row', function (row) {
      list.push(row);
    }); // end list push
    currentList.on('end', function (){
      return res.json(list); // allows list to be displayed in DOM
    });
    done();
  }); // end connect function
}); // end app.get for getList

// post route (requires the urlencodedParser 'INJECTION' between route and function)
app.post('/postNewTask', urlencodedParser, function (req, res) {
  console.log('in postNewTask URL:' + req.body.taskName);
  pg.connect(connectionString, function (err, client, done) {
    client.query('INSERT INTO list (task, completed) VALUES ($1, $2)', [req.body.taskName, req.body.taskStatus]); // add new row in db table for task being added by user
    done();
  }); // end connect function
  res.end(); // ensures success function response sent
}); // end app.post for postNewTask

app.post('/completeTask', urlencodedParser, function (req, res) {
  pg.connect(connectionString, function (err, client, done) {
    var id = req.body.id;
    client.query('UPDATE list SET completed=true WHERE id='+id+';');
  done();
  });
  res.end(); // ensures success function response sent
}); // end app.post for completeTask

app.post('/deleteTask', urlencodedParser, function (req, res) {
  pg.connect(connectionString, function (err, client, done) {
      var id = req.body.id;
      client.query('DELETE FROM list WHERE id='+id+';');
  done();
  });
  res.end(); // ensures success function response sent
});


// -------------------


app.get('/getCompletedList', function (req, res) {
  console.log('in getCompletedList URL');
  // create array to hold completed tasks
  var completedList = [];
  pg.connect(connectionString, function (err, client, done) {
    // get all completed tasks and store in completedList var
    var doneList = client.query('SELECT * FROM list WHERE completed=true;');
    // push each row into completedList array
    var rows = 0;
    doneList.on('row', function (row) {
      completedList.push(row);
    }); // end stock push
    doneList.on('end', function (){
      return res.json(completedList); // allows completed list to be displayed in DOM
    });
    done();
  }); // end connect function
}); // end app.get for getCompletedList


// app.get('/getCompletedList', function (req, res) {
//   console.log('in getCompletedList URL');
//   // create array to hold animal stock
//     var list = [];
//     pg.connect(connectionString, function (err, client, done) {
//       // get all animals in zoo and store in stock var
//       var currentList = client.query('SELECT id, task, category, completed FROM list WHERE completed=true;');
//       // push each row into list array
//       var rows = 0;
//       currentList.on('row', function (row) {
//         list.push(row);
//       }); // end stock push
//       currentList.on('end', function (){
//         return res.json(list); // allows list to be displayed in DOM
//       });
//     }); // end connect function
//   }); // end app.get for getList
