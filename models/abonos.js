"use strict";
let db = require('../core/database');
let httpMessages = require('../core/httpMessages');
let validation = require('../core/validation');
let queryHelper = require('../core/query_helper');

let invalid = new Error("Parámetros de entrada inválidos");

exports.select = function(req, resp) {
  let query = [];
  let sqlScript = 'select a.*, c.nombre, c.direccion, c.telefono, v.total from abonos a left join ventas v on a.venta = v.id left join clientes c on v.cliente = c.id';
  // ID DE ABONO
  if (validation.entero(req.query.id) > 0)
    query.push(`a.id=${validation.entero(req.query.id)}`);
  // VENTA
  if (validation.entero(req.query.venta) > 0)
    query.push(`a.venta=${validation.entero(req.query.venta)}`);
  // VENDEDOR
  if (validation.entero(req.query.vendedor) > 0)
    query.push(`c.vendedor=${validation.entero(req.query.vendedor)}`);
  // FECHA DE PAGO
  if (req.query.fecha)
    query.push(`a.fecha between '${req.query.fecha}' and '${req.query.fecha}'`);
  // SI YA SE HA PAGADO
  if (validation.entero(req.query.estado) >= 1 && validation.entero(req.query.estado) <= 2)
    query.push(`a.estado=${validation.entero(req.query.estado) - 1}`);
  sqlScript += queryHelper.select(query) + " order by fecha asc";
  db.executeSql(sqlScript, function(data, err) {
    if (err)
      httpMessages.show500(req, resp, err);
    else
      httpMessages.sendJson(req, resp, data);
  });
}

exports.update = function(req, resp) {
  let abono = {
    'id': validation.entero(req.body.id),
    'abono': validation.flotante(req.body.abono)
  };
  let query = [];
  if (abono['abono'] > 0) {
    query.push(`abono=${abono['abono']}`);
    query.push(`estado=1`);
  }
  let sqlScript = `update abonos set ${queryHelper.update(query)} where id=${abono['id']}`;
  db.executeSql(sqlScript, function(data, err) {
    if (err)
      httpMessages.show500(req, resp, err);
    else
      httpMessages.show200(req, resp);
  });
};