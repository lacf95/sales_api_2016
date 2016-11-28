"use strict";
let db = require('../core/database');
let httpMessages = require('../core/httpMessages');
let validation = require('../core/validation');
let queryHelper = require('../core/query_helper');

let invalid = new Error("Parámetros de entrada inválidos");

exports.select = function(req, resp) {
  let query = [];
  let sqlScript = 'select * from ventas ';
  //sqlScript += 'left join dias_pago d on v.dia_pago = d.id left join tipos_pago t on v.tipo_pago = t.id left join clientes c on v.cliente = c.id';
  // ID DE VENTA
  if (validation.entero(req.query.id) > 0)
    query.push(`id=${validation.entero(req.query.id)}`);
  // CLIENTE
  if (validation.entero(req.query.cliente) > 0)
    query.push(`cliente=${validation.entero(req.query.cliente)}`);
  // VENDEDOR
  if (validation.entero(req.query.vendedor) > 0)
    query.push(`vendedor=${validation.entero(req.query.vendedor)}`);
  // PROXIMO PAGO
  if (req.query.proximo_pago_inicio)
    if (req.query.proximo_pago_fin)
      query.push(`proximo_pago between '${req.query.proximo_pago_inicio}' and '${req.query.proximo_pago_fin}'`);
    else
      query.push(`proximo_pago between '${req.query.proximo_pago_inicio}' and '${req.query.proximo_pago_inicio}'`);
  // ULTIMO PAGO
  if (req.query.ultimo_pago_inicio)
    if (req.query.ultimo_pago_fin)
      query.push(`ultimo_pago between '${req.query.ultimo_pago_inicio}' and '${req.query.ultimo_pago_fin}'`);
    else
      query.push(`ultimo_pago between '${req.query.ultimo_pago_inicio}' and '${req.query.ultimo_pago_inicio}'`);
  // SI YA SE HA PAGADO
  if (validation.entero(req.query.abonado) == 1)
    query.push(`abonado >= total`);
  else if (validation.entero(req.query.abonado) == 2)
    query.push(`abonado < total`);
  sqlScript += queryHelper.select(query);
  db.executeSql(sqlScript, function(data, err) {
    if (err)
      httpMessages.show500(req, resp, err);
    else
      httpMessages.sendJson(req, resp, data);
  });
};

exports.set = function(req, resp) {
  let total = (validation.flotante(req.body.total)).toFixed(2);
  let abonado = (validation.flotante(req.body.abonado)).toFixed(2);
  let no_pagos = validation.entero(req.body.no_pagos);
  abonado = (abonado > total) ? total: abonado;
  no_pagos = (no_pagos < 1) ? 1: no_pagos;
  let abono = ((total - abonado) / no_pagos).toFixed(2);
  let venta = {
    'total': total,
    'abonado': abonado,
    'abono': abono,
    'proximo_pago': req.body.proximo_pago,
    'no_pagos': no_pagos,
    'tipo_pago': validation.entero(req.body.tipo_pago),
    'cliente': validation.entero(req.body.cliente)
  };
  let sqlScript = `insert into ventas (total, abonado, abono, proximo_pago, no_pagos, tipo_pago, cliente) values (${venta['total']}, ${venta['abonado']}, ${venta['abono']}, '${venta['proximo_pago']}', ${venta['no_pagos']}, ${venta['tipo_pago']}, ${venta['cliente']});`;
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

exports.updateVenta = function(req, resp) {
  let venta = {
    'id': validation.entero(req.body.id),
    'total': req.body.total,
    'abonado': req.body.abonado,
    'abono': req.body.abono,
    'proximo_pago': req.body.proximo_pago,
    'ultimo_pago': req.body.ultimo_pago,
    'horario_pago': req.body.horario_pago,
    'no_pagos': validation.entero(req.body.no_pagos),
    'dia_pago': validation.entero(req.body.dia_pago),
    'tipo_pago': validation.entero(req.body.tipo_pago),
    'cliente': validation.entero(req.body.cliente)
  };
  let sqlScript = `update ventas set total=${venta['total']}, abonado=${venta['abonado']}, abono=${venta['abono']}, proximo_pago='${venta['proximo_pago']}', ultimo_pago='${venta['ultimo_pago']}', horario_pago='${venta['horario_pago']}', no_pagos=${venta['no_pagos']}, dia_pago=${venta['dia_pago']}, tipo_pago=${venta['tipo_pago']}, cliente=${venta['cliente']} where id=${venta['id']}`;
  db.executeSql(sqlScript, function(data, err) {
    if (err)
      httpMessages.show500(req, resp, err);
    else
      httpMessages.show200(req, resp);
  });
};

exports.deleteVenta = function(req, resp) {
  let venta = validation.entero(req.body.id);
  try {
    if (venta > 0) {
      let sqlScript = `delete from ventas where id=${venta}`;
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
