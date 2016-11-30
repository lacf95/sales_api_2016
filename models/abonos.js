"use strict";
let db = require('../core/database');
let httpMessages = require('../core/httpMessages');
let validation = require('../core/validation');
let queryHelper = require('../core/query_helper');

let invalid = new Error("Parámetros de entrada inválidos");

exports.select = function(req, resp) {
  let query = [];
  let sqlScript = 'select * from abonos ';
  // ID DE ABONO
  if (validation.entero(req.query.id) > 0)
    query.push(`id=${validation.entero(req.query.id)}`);
  // VENTA
  if (validation.entero(req.query.venta) > 0)
    query.push(`venta=${validation.entero(req.query.venta)}`);
  // VENDEDOR
  if (validation.entero(req.query.vendedor) > 0)
    query.push(`vendedor=${validation.entero(req.query.vendedor)}`);
  // FECHA DE PAGO
  if (req.query.fecha)
    query.push(`fecha between '${req.query.fecha}' and '${req.query.fecha}'`);
  // SI YA SE HA PAGADO
  if (validation.entero(req.query.estado) >= 0 && validation.entero(req.query.estado) <= 1)
    query.push(`estado=${validation.entero(req.query.estado)}`);
  sqlScript += queryHelper.select(query);
  db.executeSql(sqlScript, function(data, err) {
    if (err)
      httpMessages.show500(req, resp, err);
    else
      httpMessages.sendJson(req, resp, data);
  });
}