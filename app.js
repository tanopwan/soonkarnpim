'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/nopwan';

var db;
// Use connect method to connect to the Server
MongoClient.connect(url, function (err, database) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);
    db = database;
  }
});
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));

// CUSTOMERS BEGIN HERE

app.get('/customers', function (req, res) {
	console.log('/customers');
	var cursor = db.collection('customers').find({}, {_id: 1, name: 1}).toArray(function(err, results) {
		res.send(results);
	});
});

app.get('/customers/:key', function (req, res) {
	console.log('/customers/:key');
	var o_id = mongodb.ObjectID(req.params.key);
	var cursor = db.collection('customers').findOne({"_id": o_id}, function(err, item) {
		res.send(item);
	});
});

app.post('/customer', function (req, res) {
	db.collection('customers').save(req.body, function(err, result) {
		if (err) {
			console.log('err');
		} else {
			console.log('saved to database');
			res.redirect('/#/route/customer');
		}
	});
	console.log('saved');
});

app.post('/customers/:key', function (req, res) {
	console.log("POST /customer/" + req.params.key);
	var o_id = mongodb.ObjectID(req.params.key);
	var cursor = db.collection('customers').replaceOne({"_id": o_id}, req.body, function(err, result) {
		if (err) {
			console.log(err);
		}
		else {
			console.log('...updatedl');
			res.redirect('/#/route/customer/edit/' + req.params.key);
		}
	});
});

// CUSTOMERS END HERE

// QUOTATIONS BEGIN HERE

app.post('/quotations', function (req, res) {
	console.log("POST /quotations");
	db.collection('quotations').save(req.body, function(err, result) {
		if (err) {
			console.log(err);
		}
		else {
			console.log('...saved');
			res.redirect('/#/route/quotation');
		}
	});
});

app.get('/quotations/:key', function (req, res) {
	var o_id = mongodb.ObjectID(req.params.key);
	var cursor = db.collection('quotations').findOne({"_id": o_id}, function(err, item) {
		res.send(item);
	});
});

app.get('/quotation/number/', function (req, res) {
	db.collection('counters').findAndModify(
        { _id: "quotation" },
        [],
        { $inc: { seq: 1 } },
        {new: true}
   	, function(err, result) {
   		console.log(err);
   		res.send({seq: result.value.seq});
   	});
});

app.post('/quotations/:key', function (req, res) {
	console.log("POST /quotations/" + req.params.key);
	var o_id = mongodb.ObjectID(req.params.key);
	var cursor = db.collection('quotations').replaceOne({"_id": o_id}, req.body, function(err, result) {
		if (err) {
			console.log(err);
		}
		else {
			console.log('...saved');
			res.redirect('/#/route/quotation');
		}
	});
});

app.delete('/quotations/:key', function (req, res) {
	var o_id = mongodb.ObjectID(req.params.key);
	db.collection('quotations').deleteOne({"_id": o_id}, function(err, results) {
		if (err) {
			res.send({message: 'Failed to delete!'});
		}
		else {
			res.send({message: 'Deleted!'});
		}
	})
});

app.get('/quotations', function(req, res) {
	var cursor = db.collection('quotations').find({}, {_id: 1, job_name: 1, job_date: 1, month: 1, year: 1, customer_id: 1}).sort({job_date: -1}).toArray(function(err, results) {
		res.send(results);
	});
});

app.get('/quotations/:year/:month', function (req, res) {
	var query = {
		'month': String(req.params.month),
		'year': String(req.params.year)
	};

	var cursor = db.collection('quotations').find(query, {_id: 1, job_name: 1, month: 1, year: 1, customer_id: 1}).sort({job_date: 1, customer_id: 1}).toArray(function(err, results) {
		res.send(results);
	});
});

app.get('/create', function (req, res) {
	db.collection('counters').insert({_id: "quotation", seq: 0}, function(err, result) {
		res.send(result);
	})
});

app.listen(8080, function () {
	console.log('Example app listening on port 8080!');
});


