"use strict";
exports.__esModule = true;
var metrics_1 = require("./metrics");
var express = require("express");
var bodyparser = require("body-parser");
var mongodb = require("mongodb");
var db;
var app = express();
// Initialize connection once
var MongoClient = mongodb.MongoClient; // Create a new MongoClient
MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function (err, client) {
    if (err)
        throw err;
    db = client.db('mydb');
    // Start the application after the database connection is ready
    var port = process.env.PORT || '8115';
    app.listen(port, function (err) {
        if (err) {
            throw err;
        }
        console.log("server is listening on port " + port);
    });
});
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.post('/metrics', function (req, res) {
    if (req.body.value) {
        var metric = new metrics_1.Metric(new Date().getTime().toString(), parseInt(req.body.value));
        console.log('Posted');
        new metrics_1.MetricsHandler(db).save(metric, function (err, result) {
            if (err)
                return res.status(500).json({ error: err, result: result });
            res.status(201).json({ error: err, result: true });
        });
    }
    else {
        return res.status(400).json({ error: 'Wrong request parameter', });
    }
});
app["delete"]('/metrics', function (req, res) {
    if (req.body.value) {
        console.log('Removed');
        new metrics_1.MetricsHandler(db).remove({ value: req.body.value }, function (err, result) {
            if (err)
                return res.status(500).json({ error: err, result: result });
            res.status(201).json({ error: err, result: true });
        });
    }
    else {
        return res.status(400).json({ error: 'Wrong request parameter', });
    }
});
app.get('/metrics', function (req, res) {
    if (req.body.value) {
        console.log('Got');
        var metric = new metrics_1.Metric(new Date().getTime().toString(), parseInt(req.body.value));
        new metrics_1.MetricsHandler(db).getA(metric, function (err, result) {
            if (err) {
                throw err;
            }
            res.json(result);
        });
    }
    else {
        console.log('GotAll');
        new metrics_1.MetricsHandler(db).getB(function (err, result) {
            if (err) {
                throw err;
            }
            res.json(result);
        });
    }
});
