"use strict";
let db = require('../core/database');
let httpMessages = require('../core/httpMessages');
let validation = require('../core/validation');
let queryHelper = require('../core/query_helper');
let invalid = new Error("Parámetros de entrada inválidos");

exports.select = function(req, resp) {
  let query = [];
  let sqlScript = 'select * from productos ';
  if (validation.entero(req.query.id) > 0)
    query.push(`id=${validation.entero(req.query.id)}`);
  if (validation.entero(req.query.vendedor) > 0)
    query.push(`vendedor=${validation.entero(req.query.vendedor)}`);
  if (req.query.descripcion)
    query.push(`descripcion='${req.query.descripcion}'`);
  if (validation.flotante(req.query.precio_inicio) > 0)
    if (validation.flotante(req.query.precio_fin) > 0)
      query.push(`precio between ${validation.flotante(req.query.precio_inicio)} and ${validation.flotante(req.query.precio_fin)}`);
    else
      query.push(`precio between ${validation.flotante(req.query.precio_inicio)} and ${validation.flotante(req.query.precio_inicio)}`);
  sqlScript += queryHelper.select(query);
  db.executeSql(sqlScript, function(data, err) {
    if (err)
      httpMessages.show500(req, resp, err);
    else
      httpMessages.sendJson(req, resp, data);
  });
};

exports.set = function(req, resp) {
  let producto = {
    'descripcion': req.body.descripcion,
    'precio': req.body.precio,
    'fotografia': req.body.fotografia,
    'vendedor': validation.entero(req.body.vendedor)
  };
  let sqlScript = 'insert into productos (descripcion, precio, fotografia, vendedor) values ';
  sqlScript += `('${producto['descripcion']}', ${producto['precio']}, '${producto['fotografia']}', ${producto['vendedor']});`;
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
  let producto = {
    'id': validation.entero(req.body.id),
    'vendedor': validation.entero(req.body.vendedor),
    'descripcion': req.body.descripcion,
    'precio': validation.flotante(req.body.precio),
    'fotografia': req.body.fotografia
  };
  let query = [];
  if (producto['descripcion'])
    query.push(`descripcion='${producto['descripcion']}'`);
  if (producto['precio'])
    query.push(`precio=${producto['precio']}`);
  if (producto['fotografia'])
    query.push(`fotografia='${producto['fotografia']}'`);
  let sqlScript = `update productos set ${queryHelper.update(query)} where id='${producto['id']}'`;
  db.executeSql(sqlScript, function(data, err) {
    if (err)
      httpMessages.show500(req, resp, err);
    else
      httpMessages.show200(req, resp);
  });
};

exports.destroy = function(req, resp) {
  let producto = validation.entero(req.body.id);
  try {
    if (producto > 0) {
      let sqlScript = `delete from productos where id=${producto}`;
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
