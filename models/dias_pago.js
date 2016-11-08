let db = require('../core/database');
let httpMessages = require('../core/httpMessages');
let validation = require('../core/validation');
let queryHelper = require('../core/query_helper');
let invalid = new Error("Parámetros de entrada inválidos");

exports.select = function(req, resp) {
  let query = [];
  let sqlScript = 'select * from dias_pago ';
  if (validation.entero(req.query.id) > 0)
    query.push(`id=${validation.entero(req.query.id)}`);
  if (req.query.dia)
    query.push(`dia='${req.query.dia}'`);
  sqlScript += queryHelper.select(query);
  db.executeSql(sqlScript, function(data, err) {
    if (err)
      httpMessages.show500(req, resp, err);
    else
      httpMessages.sendJson(req, resp, data);
  });
};

exports.set = function(req, resp) {
  let diaPago = {
    'dia': req.body.dia
  };
  let sqlScript = 'insert into diass_pago (dia) values ';
  sqlScript += `('${diaPago['dia']}');`;
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
  let diaPago = {
    'id': validation.entero(req.body.id),
    'dia': req.body.dia
  };
  let query = [];
  if (diaPago['dia'])
    query.push(`descripcion='${diaPago['dia']}'`);
  let sqlScript = `update tipos_pago set ${queryHelper.update(query)} where id='${diaPago['id']}'`;
  db.executeSql(sqlScript, function(data, err) {
    if (err)
      httpMessages.show500(req, resp, err);
    else
      httpMessages.show200(req, resp);
  });
};

exports.destroy = function(req, resp) {
  let diaPago = validation.entero(req.body.id);
  try {
    if (producto > 0) {
      let sqlScript = `delete from dias_pago where id=${diaPago}`;
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
