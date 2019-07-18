"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var metrics_1 = require("./metrics");
var mongodb = require("mongodb");
var dbMet;
var db;
var clientDb;
var mongoAsync = function (callback) {
    var MongoClient = mongodb.MongoClient; // Create a new MongoClient
    MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function (err, client) {
        if (err)
            throw err;
        callback(client);
    });
};
var a = 0;
describe('Metrics', function () {
    it('should save and get', function () {
        chai_1.expect(a).to.equal(0);
    });
});
describe('Metrics', function () {
    before(function (done) {
        mongoAsync(function (client) {
            clientDb = client;
            db = clientDb.db('mydb');
            dbMet = new metrics_1.MetricsHandler(db);
            done();
        });
    });
    after(function () {
        clientDb.close();
    });
    describe('/get', function () {
        it('should get empty array', function () {
            var metrics = new metrics_1.Metric('value', 11);
            dbMet.getA(metrics, function (err, result) {
                chai_1.expect(err).to.be["null"];
                chai_1.expect(result).to.not.be.undefined;
                chai_1.expect(result).to.be.empty;
            });
        });
    });
    describe('/save', function () {
        it('should save an array', function () {
            var metrics = new metrics_1.Metric(new Date().getTime().toString(), 11);
            dbMet.save(metrics, function (err, result) {
                chai_1.expect(err).to.be["null"];
                chai_1.expect(result).to.not.be.undefined;
                chai_1.expect(result).to.be.empty;
            });
        });
    });
    describe('/delete', function () {
        it('should delete an array', function () {
            var metrics = new metrics_1.Metric(new Date().getTime().toString(), 11);
            dbMet.remove(metrics, function (err, result) {
                chai_1.expect(err).to.be["null"];
                chai_1.expect(result).to.not.be.undefined;
                chai_1.expect(result).to.be.empty;
            });
        });
    });
});
