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
  fecha datetime default dateadd(hour, -6, getdate()),
  total decimal(18, 2),
  abonado decimal(18, 2),
  abono decimal(18, 2),
  proximo_pago datetime,
  no_pagos int,
  dia_pago int references dias_pago(id),
  tipo_pago int references tipos_pago(id),
  cliente int references clientes(id)
);

create table abonos (
  id int identity(1, 1) primary key,
  abono decimal(18, 2),
  fecha datetime,
  estado bit default 0,
  venta int references ventas(id)
);

create table venta_productos (
  id int identity(1, 1) primary key,
  cantidad int,
  producto int references productos(id),
  venta int references ventas(id)
);

create trigger trigger_insert_ventas on ventas
after insert
as
begin
  declare @estado bit;
  declare @total decimal(18, 2);
  declare @abonado decimal(18, 2);
  set @total = (select total from inserted);
  set @abonado = (select abonado from inserted);
  set @estado = 0;
  if @abonado >= @total
  begin
    set @estado = 1;
  end
  insert into abonos (abono, fecha, venta, estado) select abono, proximo_pago, id, @estado from inserted;
end;

create trigger trigger_update_abonos on abonos
after update
as
begin
  declare @no_pagos int;
  declare @pagados int;
  set @no_pagos = (select ventas.no_pagos from ventas, inserted where ventas.id = inserted.venta);
  set @pagados = (select count(*) from abonos, inserted where abonos.venta = inserted.venta);
  if @pagados >= @no_pagos
  begin
    set @pagados = 1;
  end
  update ventas set ventas.abonado = (ventas.abonado + inserted.abono), ventas.abono = (ventas.total - (ventas.abonado + inserted.abono)) / @pagados from ventas inner join inserted on ventas.id = inserted.venta;
  declare @total decimal(18, 2);
  set @total = (select total from ventas, inserted where ventas.id = inserted.venta);
  declare @abonado decimal(18, 2);
  set @abonado = (select abonado from ventas, inserted where ventas.id = inserted.venta);
  if @abonado >= @total
  begin
    return
  end
  insert into abonos (abono, fecha, venta) select (select ventas.abono from ventas where ventas.id = inserted.venta), dateadd(day, (select intervalo from tipos_pago t left join ventas v on t.id = v.tipo_pago where v.id = venta), fecha), venta from inserted;
end;

create trigger trigger_insert_abonoso on abonos
after insert
as
begin
  update ventas set ventas.proximo_pago = inserted.fecha from ventas inner join inserted on ventas.id = inserted.venta;
end;

user: lchavez1
pass: @drian95