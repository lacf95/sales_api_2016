create table vendedores (
  id int identity(1, 1) primary key,
  correo varchar(30),
  clave varchar(30),
  nombre varchar(30),
  apellido varchar(30),
  telefono varchar(10)
);

create table clientes (
  id int identity(1, 1) primary key,
  nombre varchar(60),
  telefono varchar(10),
  correo varchar(30),
  direccion varchar (120),
  vendedor int references vendedores(id)
);

create table productos (
  id int identity(1, 1) primary key,
  descripcion varchar(100),
  precio decimal(18, 2),
  fotografia varchar(100),
  vendedor int references vendedores(id)
);

create table estados (
  id int identity(1, 1) primary key,
  descripcion varchar(30)
);

create table tipos_pago (
  id int identity(1, 1) primary key,
  descripcion varchar(20),
  intervalo int
);

create table dias_pago (
  id int identity(1, 1) primary key,
  dia varchar(10),
);

create table ventas (
  id int identity(1, 1) primary key,
  total decimal(18, 2),
  abonado decimal(18, 2),
  abono decimal(18, 2),
  proximo_pago date,
  horario_pago time,
  no_pagos int,
  dia_pago int references dias_pago(id),
  tipo_pago int references tipos_pago(id),
  cliente int references clientes(id)
);

create table abonos (
  id int identity(1, 1) primary key,
  abono decimal(18, 2),
  fecha date,
  venta int references ventas(id)
);

create table venta_productos (
  id int identity(1, 1) primary key,
  cantidad int,
  producto int references productos(id),
  venta int references ventas(id),
  estado int references estados(id)
);

user: lchavez1
pass: @drian95
