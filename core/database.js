"use strict";
let sqlDB = require('mssql');
let settings = require('../settings');

//FUNCION QUE EJECUTA TODAS LAS QUERIES
exports.executeSql = function (sql, callback) {
	let conn = new sqlDB.Connection(settings.dbConfig);
	conn.connect().then(function() {
		let req = new sqlDB.Request(conn);
		req.query(sql).then(function(recordSet) {
			callback(recordSet);
		}).catch(function(err) {
			console.log(err);
			callback(null, err);
		});
	}).catch(function(err) {
		console.log(err);
		callback(null, err);
	});
};
