"use strict";
let db = require('../core/database');
let httpMessages = require('../core/httpMessages');
let validation = require('../core/validation');
let queryHelper = require('../core/query_helper');
let invalid = new Error("Parámetros de entrada inválidos");

exports.select = function(req, resp) {
  let query = [];
  let sqlScript = "select * from clientes ";
  if (validation.entero(req.query.id) > 0)
    query.push(`id=${validation.entero(req.query.id)}`);
  if (validation.entero(req.query.vendedor) > 0)
    query.push(`vendedor=${validation.entero(req.query.vendedor)}`);
  if (req.query.nombre)
    query.push(`nombre like '%${req.query.nombre}%'`);
  sqlScript += queryHelper.select(query);
  db.executeSql(sqlScript, function(data, err) {
    if (err)
      httpMessages.show500(req, resp, err);
    else
      httpMessages.sendJson(req, resp, data);
  });
};

exports.set = function(req, resp) {
  let cliente = {
    'nombre': req.body.nombre,
    'telefono': req.body.telefono,
    'correo': req.body.correo,
    'direccion': req.body.direccion,
    'vendedor': validation.entero(req.body.vendedor),
  };
  let sqlScript = 'insert into clientes (nombre, telefono, correo, direccion, vendedor) values ';
  sqlScript += `('${cliente['nombre']}', '${cliente['telefono']}', '${cliente['correo']}', '${cliente['direccion']}', ${cliente['vendedor']});`;
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
  let cliente = {
    'id': validation.entero(req.body.id),
    'nombre': req.body.nombre,
    'telefono': req.body.telefono,
    'correo': req.body.correo,
    'direccion': req.body.direccion,
    'vendedor': validation.entero(req.body.vendedor)
  };
  let query = [];
  if (cliente['nombre'])
    query.push(`nombre='${cliente['nombre']}'`);
  if (cliente['telefono'])
    query.push(`telefono='${cliente['telefono']}'`);
  if (cliente['correo'])
    query.push(`correo='${cliente['correo']}'`);
  if (cliente['direccion'])
    query.push(`direccion='${cliente['direccion']}'`);
  let sqlScript = `update clientes set ${queryHelper.update(query)} where id=${cliente['id']}`;
  db.executeSql(sqlScript, function(data, err) {
    if (err)
      httpMessages.show500(req, resp, err);
    else
      httpMessages.show200(req, resp);
  });
};

exports.destroy = function(req, resp) {
  let cliente = validation.entero(req.params.id);
  try {
    if (cliente > 0) {
      let sqlScript = `delete from clientes where id=${cliente}`;
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
}
