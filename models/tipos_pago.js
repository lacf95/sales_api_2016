let db = require('../core/database');
let httpMessages = require('../core/httpMessages');
let validation = require('../core/validation');
let queryHelper = require('../core/query_helper');
let invalid = new Error("Parámetros de entrada inválidos");

exports.select = function(req, resp) {
  let query = [];
  let sqlScript = 'select * from tipos_pago ';
  if (validation.entero(req.query.id) > 0)
    query.push(`id=${validation.entero(req.query.id)}`);
  if (req.query.descripcion)
    query.push(`descripcion='${req.query.descripcion}'`);
  if (validation.entero(req.query.intervalo) > 0)
    query.push(`id=${validation.entero(req.query.id)}`);
  sqlScript += queryHelper.select(query);
  db.executeSql(sqlScript, function(data, err) {
    if (err)
      httpMessages.show500(req, resp, err);
    else
      httpMessages.sendJson(req, resp, data);
  });
};

exports.set = function(req, resp) {
  let tipoPago = {
    'descripcion': req.body.descripcion,
    'intervalo': validation.entero(req.body.intervalo)
  };
  let sqlScript = 'insert into tipos_pago (descripcion, intervalo) values ';
  sqlScript += `('${tipoPago['descripcion']}', '${tipoPago['intervalo']}');`;
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
  let tipoPago = {
    'id': validation.entero(req.body.id),
    'descripcion': req.body.descripcion,
    'intervalo': validation.entero(req.body.intervalo)
  };
  let query = [];
  if (tipoPago['descripcion'])
    query.push(`descripcion='${tipoPago['descripcion']}'`);
  if (tipoPago['intervalo'] > 0)
    query.push(`intervalo=${tipoPago['intervalo']}`);
  let sqlScript = `update tipos_pago set ${queryHelper.update(query)} where id='${tipoPago['id']}'`;
  db.executeSql(sqlScript, function(data, err) {
    if (err)
      httpMessages.show500(req, resp, err);
    else
      httpMessages.show200(req, resp);
  });
};

exports.destroy = function(req, resp) {
  let tipoPago = validation.entero(req.body.id);
  try {
    if (producto > 0) {
      let sqlScript = `delete from tipos_pago where id=${tipoPago}`;
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
