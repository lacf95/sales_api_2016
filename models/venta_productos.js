let db = require('../core/database');
let httpMessages = require('../core/httpMessages');
let validation = require('../core/validation');
let queryHelper = require('../core/query_helper');

let invalid = new Error("Parámetros de entrada inválidos");

exports.getVentaProducto = function(req, resp) {
  let query = [];
  let sqlScript = 'select * from venta_productos ';
  if (validation.entero(req.query.id) > 0)
    query.push(`id=${validation.entero(req.query.id)}`);
  if (validation.entero(req.query.producto) > 0)
    query.push(`producto=${validation.entero(req.query.producto)}`);
  if (validation.entero(req.query.venta) > 0)
    query.push(`venta=${validation.entero(req.query.venta)}`);
  if (validation.entero(req.query.estado) > 0)
    query.push(`estado=${validation.entero(req.query.estado)}`);
  sqlScript += queryHelper.createQuery(query);
  db.executeSql(sqlScript, function(data, err) {
    if (err)
      httpMessages.show500(req, resp, err);
    else
      httpMessages.sendJson(req, resp, data);
  });
};

exports.setVentaProducto = function(req, resp) {
  let ventaProducto = {
    'cantidad': validation.entero(req.body.cantidad),
    'producto': validation.entero(req.body.producto),
    'venta': validation.entero(req.body.venta),
    'estado': validation.entero(req.body.estado)
  };
  let sqlScript = 'insert into venta_productos (cantidad, producto, venta, estado) values ';
  sqlScript += `(${ventaProducto['cantidad']}, ${ventaProducto['producto']}, ${ventaProducto['venta']}, ${ventaProducto['estado']});`;
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

exports.updateVentaProducto = function(req, resp) {
  let ventaProducto = {
    'id': validation.entero(req.body.id),
    'cantidad': validation.entero(req.body.cantidad),
    'producto': validation.entero(req.body.producto),
    'venta': validation.entero(req.body.venta),
    'estado': validation.entero(req.body.estado)
  };
  let sqlScript = `update venta_productos set cantidad=${ventaProducto['cantidad']}, producto=${ventaProducto['producto']}, venta=${ventaProducto['venta']}, estado=${ventaProducto['estado']} where id=${ventaProducto['id']}`;
  db.executeSql(sqlScript, function(data, err) {
    if (err)
      httpMessages.show500(req, resp, err);
    else
      httpMessages.show200(req, resp);
  });
};

exports.deleteVentaProducto = function(req, resp) {
  let ventaProducto = validation.entero(req.body.id);
  try {
    if (ventaProducto > 0) {
      let sqlScript = `delete from venta_productos where id=${ventaProducto}`;
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
