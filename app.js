var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// we need it to parse content-type application/json
app.use(bodyParser.json());

// we need it to parse content-type application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

let users = [
  {
    id: 1,
    firstName: 'yuri',
    lastName: 'stsepaniuk',
  },
  {
    id: 2,
    firstName: 'ilya',
    lastName: 'grigorik',
  },
];

for(let i = 3; i < 5000; i++) {
  users.push({
    id: i,
    firstName: `firstName${i}`,
    firstName: `lastName${i}`,
  });
}

app.get('/user', function (req, res) {
  if(req.query.id) {
    return res.json(users.filter(user => Number(req.query.id) === user.id)[0]);
  }
  res.json(users);
});

app.get('/user/:id', function (req, res) {
  res.json(users.filter(user => Number(req.params.id) === user.id)[0]);
});

app.get('/user401/:id', function (req, res) {
  res.status(401).end();
});

app.get('/user500/:id', function (req, res) {
  // recursion, max call stack
  (function a(){
    a();
  }());

  res.end(`cool`);
});

app.post('/user', function (req, res) {
  let user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    id: users.length
  };
  users.push(user);

  res.json(user);
});

app.put('/user', function (req, res) {
  let user = users.filter(user => Number(req.body.id) === user.id)[0];
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;

  res.json(user);
});

app.delete('/user', function (req, res) {
  let id = req.query.id || req.body.id;
  users = users.filter(user => Number(id) !== user.id);
  res.json({idWasRemoved: Number(id)});
});

app.delete('/user/:id', function (req, res) {
  let id = req.params.id;
  users = users.filter(user => Number(id) !== user.id);
  res.json({idWasRemoved: Number(id)});
});

app.patch('/user', function (req, res) {
  let user = users.filter(user => Number(req.body.id) === user.id)[0];
  
  if (req.body.firstName) {
    user.firstName = req.body.firstName;
  }

  if (req.body.lastName) {
    user.lastName = req.body.lastName;
  }

  res.json(user);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});