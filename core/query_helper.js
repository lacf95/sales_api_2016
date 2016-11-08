exports.select = function(params) {
  let query = '';
  for (i = 0; i < params.length; i++) {
    if (i > 0)
      query += ' and ';
    else
      query = ' where ';
    query += params[i];
  }
  return query;
};

exports.update = function(params) {
  let query = '';
  for (i = 0; i < params.length; i++) {
    if (i > 0)
      query += ', ';
    query += params[i];
  }
  return query;
}
