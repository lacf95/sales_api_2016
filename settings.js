//INFORMACIÓN NECESARIA PARA LA CONEXIÓN A LA BASE DE DATOS SQL SERVER
exports.dbConfig = {
	user: 'lchavez1',
	password: '@drian95',
	server: 'lacf95.database.windows.net',
  options: {
    encrypt: true,
  	database: 'pi_2016',
  }
};

//PUERTO PREDETERMINADO PARA EL SERVIDOR
exports.webPort = 8080;
