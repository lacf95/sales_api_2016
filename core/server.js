"use strict";
let settings = require('../settings');
let httpMessages = require('./httpMessages');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');

let vendedores = require('../models/vendedores');
let clientes = require('../models/clientes');
let productos = require('../models/productos');
let estados = require('../models/estados');
let tiposPago = require('../models/tipos_pago');
let diasPago = require('../models/dias_pago');
let ventas = require('../models/ventas');
let ventaProductos = require('../models/venta_productos');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let router = express.Router();
router.get('/', function(req, resp) {
  httpMessages.showHome(req, resp);
});
// VENDEDORES
router.route("/vendedores").get(function (req, resp) {
  vendedores.select(req, resp);
})
router.route("/vendedores").post(function (req, resp) {
  vendedores.set(req, resp);
});
router.route("/vendedores").put(function (req, resp) {
  vendedores.update(req, resp);
});
router.route("/vendedores").delete(function (req, resp) {
  vendedores.destroy(req, resp);
});
router.route("/vendedores/login").post(function (req, resp) {
  vendedores.login(req, resp);
})
// CLIENTES
router.route("/clientes").get(function (req, resp) {
  clientes.select(req, resp);
});
router.route("/clientes").post(function (req, resp) {
  clientes.set(req, resp);
});
router.route("/clientes").put(function (req, resp) {
  clientes.update(req, resp);
});
router.route("/clientes").delete(function (req, resp) {
  clientes.destroy(req, resp);
});
// PRODUCTOS
router.route("/productos").get(function (req, resp) {
  productos.select(req, resp);
});
router.route("/productos").post(function (req, resp) {
  productos.set(req, resp);
});
router.route("/productos").put(function (req, resp) {
  productos.update(req, resp);
});
router.route("/productos").delete(function (req, resp) {
  productos.destroy(req, resp);
});
// ESTADOS
router.route("/estados").get(function (req, resp) {
  estados.select(req, resp);
});
router.route("/estados").post(function (req, resp) {
  estados.set(req, resp);
});
router.route("/estados").put(function (req, resp) {
  estados.update(req, resp);
});
router.route("/estados").delete(function (req, resp) {
  estados.destroy(req, resp);
});
// TIPOS DE PAGO
router.route("/tipos_pago").get(function (req, resp) {
  tiposPago.select(req, resp);
});
router.route("/tipos_pago").post(function (req, resp) {
  tiposPago.set(req, resp);
});
router.route("/tipos_pago").put(function (req, resp) {
  tiposPago.update(req, resp);
});
router.route("/tipos_pago").delete(function (req, resp) {
  tiposPago.destroy(req, resp);
});
// DIAS DE PAGO
router.route("/dias_pago").get(function (req, resp) {
  diasPago.select(req, resp);
});
router.route("/dias_pago").post(function (req, resp) {
  diasPago.set(req, resp);
});
router.route("/dias_pago").put(function (req, resp) {
  diasPago.update(req, resp);
});
router.route("/dias_pago").delete(function (req, resp) {
  diasPago.destroy(req, resp);
});

//Assing all the routes
app.use("/api", router);
//Start listening in the server
app.listen(settings.port, settings.host);
console.log("Server running at "+settings.host+":"+settings.port);
