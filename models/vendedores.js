let db = require('../core/database');
let httpMessages = require('../core/httpMessages');
let validation = require('../core/validation');
let queryHelper = require('../core/query_helper');
let invalid = new Error("Parámetros de entrada inválidos");

exports.login = function(req, resp) {
  if (req.body.correo && req.body.clave) {
    let sqlScript = `select id, correo, nombre, apellido, telefono from vendedores where correo='${req.body.correo}' and clave='${req.body.clave}'`;
    db.executeSql(sqlScript, function(data, err) {
      if (err)
        httpMessages.show500(req, resp, err);
      else
        httpMessages.sendJson(req, resp, data[0]);
    })
  } else
    httpMessages.show400(req, resp, invalid);
}

exports.select = function(req, resp) {
  let query = [];
  let sqlScript = 'select * from vendedores ';
  if (validation.entero(req.query.id) > 0)
    query.push(`id=${validation.entero(req.query.id)}`);
  if (req.query.correo)
    query.push(`correo like '%${req.query.correo}%'`);
  if (req.query.nombre)
    query.push(`nombre like '%${req.query.nombre}%'`);
  if (req.query.apellido)
    query.push(`apellido like '%${req.query.apellido}%'`);
  if (req.query.telefono)
    query.push(`telefono='${req.query.apellido}'`);
  sqlScript += queryHelper.select(query);
  db.executeSql(sqlScript, function(data, err) {
    if (err)
      httpMessages.show500(req, resp, err);
    else
      httpMessages.sendJson(req, resp, data);
  });
};

exports.set = function(req, resp) {
  let vendedor = {
    'correo': req.body.correo,
    'clave': req.body.clave,
    'nombre': req.body.nombre,
    'apellido': req.body.apellido,
    'telefono': req.body.telefono
  };
  let sqlScript = 'insert into vendedores (correo, clave, nombre, apellido, telefono) values ';
  sqlScript += `('${vendedor['correo']}', '${vendedor['clave']}', '${vendedor['nombre']}', '${vendedor['apellido']}', '${vendedor['telefono']}');`;
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
  let vendedor = {
    'id': validation.entero(req.body.id),
    'correo': req.body.correo,
    'clave': req.body.clave,
    'nombre': req.body.nombre,
    'apellido': req.body.apellido,
    'telefono': req.body.telefono
  };
  let query = [];
  if (vendedor['correo'])
    query.push(`correo='${vendedor['correo']}'`);
  if (vendedor['clave'])
    query.push(`clave='${vendedor['clave']}'`);
  if (vendedor['nombre'])
    query.push(`nombre='${vendedor['nombre']}'`);
  if (vendedor['apellido'])
    query.push(`apellido='${vendedor['apellido']}'`);
  if (vendedor['telefono'])
    query.push(`telefono='${vendedor['telefono']}'`);
  let sqlScript = `update vendedores set ${queryHelper.update(query)} where id='${vendedor['id']}'`;
  db.executeSql(sqlScript, function(data, err) {
    if (err)
      httpMessages.show500(req, resp, err);
    else
      httpMessages.show200(req, resp);
  });
};

exports.destroy = function(req, resp) {
  let vendedor = validation.entero(req.body.id);
  try {
    if (vendedor > 0) {
      let sqlScript = `delete from vendedores where id=${vendedor}`;
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
