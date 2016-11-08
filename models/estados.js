"use strict";
let db = require('../core/database');
let httpMessages = require('../core/httpMessages');
let validation = require('../core/validation');
let queryHelper = require('../core/query_helper');
let invalid = new Error("Parámetros de entrada inválidos");

exports.select = function(req, resp) {
  let query = [];
  let sqlScript = 'select * from estados ';
  if (validation.entero(req.query.id) > 0)
    query.push(`id=${validation.entero(req.query.id)}`);
  if (req.query.descripcion)
    query.push(`descripcion='${req.query.descripcion}'`);
  sqlScript += queryHelper.select(query);
  db.executeSql(sqlScript, function(data, err) {
    if (err)
      httpMessages.show500(req, resp, err);
    else
      httpMessages.sendJson(req, resp, data);
  });
};

exports.set = function(req, resp) {
  let estado = {
    'descripcion': req.body.descripcion
  };
  let sqlScript = 'insert into estados (descripcion) values ';
  sqlScript += `('${estado['descripcion']}');`;
  sqlScript += ' select scope_identity() as id';
  db.executeSql(sqlScript, function(data, err) {
    if (err)
      httpMessages.show500(req, resp, err);
    else {
      data = data[0];
      httpMessages.sendJson(req, resp, data);
    }
  });
};

exports.update = function(req, resp) {
  let estado = {
    'id': validation.entero(req.body.id),
    'descripcion': req.body.descripcion
  };
  let query = [];
  if (estado['descripcion'])
    query.push(`descripcion='${estado['descripcion']}'`);
  let sqlScript = `update productos set ${queryHelper.update(query)} where id='${estado['id']}'`;
  db.executeSql(sqlScript, function(data, err) {
    if (err)
      httpMessages.show500(req, resp, err);
    else
      httpMessages.show200(req, resp);
  });
};

exports.destroy = function(req, resp) {
  let estado = validation.entero(req.body.id);
  try {
    if (producto > 0) {
      let sqlScript = `delete from estados where id=${estado}`;
      db.executeSql(sqlScript, function(data, err) {
        if (err)
          httpMessages.show500(req, resp, err);
        else
          httpMessages.show200(req, resp);
      });
    } else
      throw invalid;
  } catch (ex) {
    httpMessages.show400(req, resp, ex);
  }
};
