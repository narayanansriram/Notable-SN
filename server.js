var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
var pool = mysql.createPool({
    connectionLimit : 10,
    host  : 'localhost',
    user  : 'user',
    password: 'root'
    database: 'notable'
});

app.set('port', 3000);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS appointments", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE appointments("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "doctor_name VARCHAR(255) NOT NULL,"+
    "patient_name VARCHAR(255) NOT NULL,"+
    "date DATE,"+
    "time TIME)";
    pool.query(createString, function(err){
      res.render('home',context);
    })
  });
});


// Home page
app.get('/', function(req,res){
  var context = {};
  res.render('home', context);
});

// Gets database data 
app.get('/get-data', function(req,res,next){
  sendTablePayload(req,res,next);
});

// Gets data from client to add a new completed exercise
app.post('/add', function(req,res,next){
  pool.query("INSERT INTO appointments (`id`, `doctor_name`,`patient_name`,`date`,`time`,`kind`) VALUES (?,?,?,?,?,?)", [req.body.doctorname,req.body.patientname,req.body.date,req.body.time,req.body.kind], function(err, result){
    if(err){
      next(err);
      return;
    }
    sendTablePayload(req,res,next);
  });
});


app.post('/delete', function(req, res, next){
  pool.query("DELETE FROM appointments WHERE id = ?", [req.body.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    sendTablePayload(req,res,next);
  });
});

// Selects data in  database and sends to client
function sendTablePayload(req,res, next){
  pool.query('SELECT * FROM appointments ORDER BY id', function(err, rows, fields){
  if(err){
    next(err);
    return;
  }
  res.type('application/json');
  res.send(rows);
  });

}

// Updates existing data in the database with the new data from client
app.post('/update',function(req,res,next){
  pool.query("UPDATE appointments SET patient_name=?, date=?, time=?, kind=? WHERE id = ?", [req.body.patientname, req.body.date, req.body.time, req.body.kind, req.body.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    sendTablePayload(req,res,next);
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Server started on ' + app.get('port') + '; press Ctrl-C to terminate.');
});
