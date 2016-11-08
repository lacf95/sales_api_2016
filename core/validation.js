"use strict";
exports.entero = function(n) {
  let nx = parseInt(n);
  if (!isNaN(nx) && nx > 0)
    return nx;
  else
    return 0;
};

exports.flotante = function(n) {
  let nx = parseFloat(n);
  if (!isNaN(nx) && nx > 0)
    return nx;
  else
    return 0;
};

exports.bit = function(n) {
  let nx = parseInt(n);
  if (!isNaN(nx) && nx < 2 && nx >= 0)
    return nx;
  else
    return 0;
};
