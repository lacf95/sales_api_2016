"use strict";
exports.showHome = function(req, resp) {
  resp.writeHead(200, {'Content-Type': 'application/json'});
  resp.write(JSON.stringify({data: 'Bienvenido'}));
  resp.end();
};

exports.sendJson = function(req, resp, data) {
  resp.writeHead(200, {'Content-Type': 'application/json'});
  if (data) {
    resp.write(JSON.stringify(data));
  }
  resp.end();
};

exports.show200 = function(req, resp) {
  resp.writeHead(200, {'Content-Type': 'application/json'});
  resp.write(JSON.stringify({data: 'OK'}));
  resp.end();
};

exports.show400 = function(req, resp, err) {
  resp.writeHead(400, {'Content-Type': 'application/json'});
  resp.write(JSON.stringify({data: 'Parámetros inválidos'}));
  resp.end();
}

exports.show403 = function(req, resp, err) {
  resp.writeHead(403, 'Acceso denegado', {'Content-Type': 'application/json'});
  resp.write(JSON.stringify({data: 'No tienes los permisos necesarios'}));
  resp.end();
};

exports.show404 = function(req, resp, err) {
  resp.writeHead(404, 'Recurso no encontrado', {'Content-Type': 'application/json'});
  resp.write(JSON.stringify({data: 'Recurso no encontrado'}));
  resp.end();
};

exports.show405 = function(req, resp, err) {
  resp.writeHead(405, 'Método no soportado', {'Content-Type': 'application/json'});
  resp.write(JSON.stringify({data: 'Método no soportado'}));
  resp.end();
};

exports.show413 = function(req, resp, err) {
  resp.writeHead(413, 'Entidad de solicitud demasiado larga', {'Content-Type': 'application/json'});
  resp.write(JSON.stringify({data: 'Entidad de solicitud demasiado larga'}));
  resp.end();
};

exports.show500 = function(req, resp, err) {
  resp.writeHead(500, 'Error interno del servidor', {'Content-Type': 'application/json'});
  resp.write(JSON.stringify({data: 'Hubo un problema en el servidor: ' + err}));
  resp.end();
};
