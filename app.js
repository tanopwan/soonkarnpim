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
	if (req.query.key) {
		console.log('[GET] /customers : get ' + req.query.key);
		var o_id = mongodb.ObjectID(req.query.key);
		var cursor = db.collection('customers').findOne({"_id": o_id}, function(err, item) {
			res.send(item);
		});
	}
	else {
		console.log('[GET] /customers : get all customers');
		var cursor = db.collection('customers').find({}, {_id: 1, name: 1}).toArray(function(err, results) {
			res.send(results);
		});
	}
	
});

app.post('/customer', function (req, res) {
	console.log('[POST] /customers');
	db.collection('customers').save(req.body, function(err, result) {
		if (err) {
			console.log('[POST] /customers err: ' + JSON.stringify(err));
		} else {
			console.log('[POST] /customers ...saved to database');
			res.redirect('/#/route/customer');
		}
	});
});

app.post('/customers/:key', function (req, res) {
	console.log("[POST] /customer/" + req.params.key);
	var o_id = mongodb.ObjectID(req.params.key);
	var cursor = db.collection('customers').replaceOne({"_id": o_id}, req.body, function(err, result) {
		if (err) {
			console.log(err);
		}
		else {
			console.log("[POST] /customer/" + req.params.key + '...updated');
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
			console.log('OST /quotations ...saved');
			res.redirect('/#/route/quotation');
		}
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
	console.log("[POST] /quotations/" + req.params.key);
	var o_id = mongodb.ObjectID(req.params.key);
	var cursor = db.collection('quotations').replaceOne({"_id": o_id}, req.body, function(err, result) {
		if (err) {
			console.log("[POST] /quotations/" + req.params.key + " err: " + JSON.stringify(err));
		}
		else {
			console.log("[POST] /quotations/" + req.params.key + '...updated');
			res.redirect('/#/route/quotation');
		}
	});
});

app.post('/quotations/:key/sum_mode', function (req, res) {
	var sum_mode = req.body.sum_mode;
	var o_id = mongodb.ObjectID(req.params.key);
	var cursor = db.collection('quotations').update({"_id": o_id}, {$set: {"sum_mode": sum_mode}}, function(err, result) {
		if (err) {
			console.log("[POST] /quotations/" + req.params.key + "/sum_mode err: " + JSON.stringify(err));
		}
		else {
			console.log("[POST] /quotations/" + req.params.key + '/sum_mode ...updated ' + sum_mode);
			res.redirect('/#/route/quotation');
		}
	});
});

app.post('/quotations/:key/vat_mode', function (req, res) {
	var vat_mode = req.body.vat_mode;
	var o_id = mongodb.ObjectID(req.params.key);
	var cursor = db.collection('quotations').update({"_id": o_id}, {$set: {"vat_mode": vat_mode}}, function(err, result) {
		if (err) {
			console.log("[POST] /quotations/" + req.params.key + "/vat_mode err: " + JSON.stringify(err));
		}
		else {
			console.log("[POST] /quotations/" + req.params.key + '/vat_mode ...updated' + vat_mode);
			res.redirect('/#/route/quotation');
		}
	});
});

app.delete('/quotations', function (req, res) {
	console.log("[DELETE] /quotations/" + req.query.key);
	var o_id = mongodb.ObjectID(req.query.key);
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
	if (req.query.key) {
		console.log('[GET] /quotations : get ' + req.query.key);
		var o_id = mongodb.ObjectID(req.query.key);
		var cursor = db.collection('quotations').findOne({"_id": o_id}, function(err, item) {
			res.send(item);
		});
	}
	else {
		console.log('[GET] /quotations : get all quotations');
		var cursor = db.collection('quotations').find({status: {$ne: "accept"}}, {_id: 1, job_name: 1, job_date: 1, month: 1, year: 1, customer_id: 1}).sort({job_date: -1}).toArray(function(err, results) {
			res.send(results);
		});
	}
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

app.post('/quotation/accept', function (req, res) {
	console.log("[POST] /quotation/accept");
	var select_price = req.body.select_price;
	var o_id = mongodb.ObjectID(req.body.key);
	var cursor = db.collection('quotations').update({"_id": o_id}, {$set: {"status": "accept", "select_price": select_price}}, function(err, result) {
		if (err) {
			console.log("[POST] /quotation/accept err: " + JSON.stringify(err));
		}
		else {
			console.log("[POST] /quotation/accept ...accepted");
		}
	});
	res.send({code: 200});
});

// QUOTATIONS END HERE

// JOBS BEGIN HERE

app.get('/jobs', function(req, res) {
	if (req.query.key) {
		console.log('[GET] /jobs : get ' + req.query.key);
		var o_id = mongodb.ObjectID(req.query.key);
		var cursor = db.collection('quotations').findOne({"_id": o_id}, function(err, item) {
			res.send(item);
		});
	}
	else {
		console.log('[GET] /jobs : get all jobs');
		var cursor = db.collection('quotations').find({status: {$eq : "accept"}}, {_id: 1, job_name: 1, job_date: 1, month: 1, year: 1, customer_id: 1}).sort({job_date: -1}).toArray(function(err, results) {
			res.send(results);
		});
	}
});

// JOBS END HERE

app.get('/create', function (req, res) {
	db.collection('counters').insert({_id: "quotation", seq: 0}, function(err, result) {
		res.send(result);
	})
});

app.listen(8080, function () {
	console.log('Example app listening on port 8080!');
});


