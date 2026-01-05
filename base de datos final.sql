Create database Proyecto;
use Proyecto;
drop database Proyecto;


Create table rol(
id_rol INT(11) AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL
);

-- Tabla de usuarios
CREATE TABLE usuarios (
    id_usuario INT(11) AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro DATETIME NOT NULL,
    telefono varchar(10),
    id_rol INT(11),
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
);
SELECT r.id_rol, r.nombre
            FROM rol r, usuarios u 
            where r.id_rol = u.id_rol and u.id_usuario =1;
select * from usuarios; 


-- Tabla de categorías
CREATE TABLE categorias (
    id_categoria INT(11) AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL
);

-- Tabla de productos
CREATE TABLE productos (
    id_producto INT(11) AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    imagen VARCHAR(255),
    estado_disponible TINYINT(1) DEFAULT 1,
    id_categoria INT(11),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

-- Tabla de ingredientes
CREATE TABLE ingredientes (
    id_ingrediente INT(11) AUTO_INCREMENT PRIMARY KEY,
    nombre_ingrediente VARCHAR(100) NOT NULL
);

-- Tabla intermedia de productos e ingredientes
CREATE TABLE producto_ingrediente (
    id_producto INT(11),
    id_ingrediente INT(11),
    PRIMARY KEY (id_producto, id_ingrediente),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
    FOREIGN KEY (id_ingrediente) REFERENCES ingredientes(id_ingrediente)
);

-- Tabla de combos
CREATE TABLE combos (
    id_combo INT(11) AUTO_INCREMENT PRIMARY KEY NULL,
    descripcion TEXT,
    imagen VARCHAR(255),
    precio DECIMAL(10, 2) NOT NULL
);


-- Tabla intermedia de combos y productos
CREATE TABLE combo_productos (
    id_combo INT(11),
    id_producto INT(11),
    cantidad INT(11),
    PRIMARY KEY (id_combo, id_producto),
    FOREIGN KEY (id_combo) REFERENCES combos(id_combo),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- Tabla de menús
CREATE TABLE menus (
    id_menu INT(11) AUTO_INCREMENT PRIMARY KEY,
    nombre_menu VARCHAR(100) NOT NULL,
    fecha_inicio DATE,
    hora_inicio TIME,
    hora_fin TIME,
    fecha_final DATE
);



-- Tabla intermedia para asociar menús con productos 
CREATE TABLE menu_productos (
    id_menu INT(11),
    id_producto INT(11),
    PRIMARY KEY (id_menu, id_producto),
    FOREIGN KEY (id_menu) REFERENCES menus(id_menu),
	FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- Tabla intermedia para asociar menús con combos 
CREATE TABLE menu_combos (
    id_menu INT(11),
    id_combo INT(11),
    PRIMARY KEY (id_menu, id_combo),
    FOREIGN KEY (id_menu) REFERENCES menus(id_menu),
	FOREIGN KEY (id_combo) REFERENCES combos(id_combo)
);

-- Tabla de pagos
CREATE TABLE pagos (
    id_pago INT(11) AUTO_INCREMENT PRIMARY KEY,
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia') NOT NULL,
    monto_pago DECIMAL(10, 2) NOT NULL,
    vuelto DECIMAL(10, 2),
    costo_envio DECIMAL(10, 2),
    direccion_entrega VARCHAR(255),
    fecha_pago DATETIME
);
-- Tabla de estado de pedidos
CREATE TABLE estado_pedido (
    id_estado INT(11) AUTO_INCREMENT PRIMARY KEY,
    descripcion_estado VARCHAR(100) NOT NULL
);

-- Tabla de pedidos
CREATE TABLE pedido (
    id_pedido INT(11) AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT(11),
    id_encargado INT(11),
    metodo_entrega ENUM('Domicilio', 'Recoger'),
    fecha_pedido DATETIME NOT NULL,
    id_pago INT(11),
    id_estado INT(11) NOT NULL,
    FOREIGN KEY (id_pago) REFERENCES pagos(id_pago),
    FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_estado) REFERENCES estado_pedido(id_estado)
);

Create table detalle_pedido(
	id_pedido INT(11) NOT NULL,
	id_detalle INT AUTO_INCREMENT PRIMARY KEY,
	subtotal DECIMAL(10, 2) NOT NULL, 
	impuesto DECIMAL(10, 2) NOT NULL,
	total_con_impuesto  DECIMAL(10, 2) NOT NULL,
	FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido)
);

-- Tabla de detalles de productos
CREATE TABLE detalle_pedido_productos (
    id_detalle_pedido INT(11),
    id_producto INT(11),
    cantidad INT(11) NOT NULL,
    PRIMARY KEY (id_detalle_pedido, id_producto),
    FOREIGN KEY (id_detalle_pedido) REFERENCES detalle_pedido(id_detalle),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- Tabla de detalles de combos
CREATE TABLE detalle_pedido_combos (
    id_detalle_pedido INT(11),
    id_combo INT(11),
    cantidad INT(11) NOT NULL,
    PRIMARY KEY (id_detalle_pedido, id_combo),
    FOREIGN KEY (id_detalle_pedido) REFERENCES detalle_pedido(id_detalle),
    FOREIGN KEY (id_combo) REFERENCES combos(id_combo)
);
-- Tabla de procesos de preparación (sin orden_estacion)
CREATE TABLE procesos_preparacion (
    id_proceso INT(11) AUTO_INCREMENT PRIMARY KEY,
    nombre_proceso VARCHAR(100) NOT NULL,
    imagen VARCHAR(255)
);

-- Tabla intermedia entre productos y procesos de preparación (con orden_estacion)
CREATE TABLE producto_proceso_preparacion (
    id_producto INT(11),
    id_proceso INT(11),
    orden_estacion INT(11) NOT NULL,
    PRIMARY KEY (id_producto, id_proceso),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
    FOREIGN KEY (id_proceso) REFERENCES procesos_preparacion(id_proceso)
);

CREATE TABLE cocina (
    id_cocina INT(11) AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT(11) NOT NULL,
    cantidad INT(11) NOT NULL,
    estado_preparacion ENUM('en preparación', 'finalizado') DEFAULT 'en preparación',
    fecha_inicio DATETIME,
    fecha_fin DATETIME,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
    FOREIGN KEY (id_proceso) REFERENCES procesos_preparacion(id_proceso)
);

INSERT INTO rol (nombre) VALUES ("Administrador");
INSERT INTO rol (nombre) VALUES ("Cliente");
INSERT INTO rol (nombre) VALUES ("Encargado");
INSERT INTO rol (nombre) VALUES ("Cocina");

INSERT INTO categorias (nombre_categoria) VALUES 
('Pizzas'),
('Pastas'),
('Bebidas');

INSERT INTO productos (nombre_producto, descripcion, precio, imagen, estado_disponible, id_categoria) VALUES 
('Pizza Margherita', 'Pizza clásica con salsa de tomate, mozzarella y albahaca',8500, 'pizza-margarita-3684-1.jpg', 1, 1),
('Lasagna Bolognese', 'Lasagna con carne de res y salsa bechamel', 6250, 'lasagnaBolonese.png', 1, 2),
('Tiramisú', 'Postre tradicional italiano con café y cacao', 2000, 'Tiramisu.jpg', 1, 2),
('Vino Tinto', 'Vino tinto de la casa', 5000, 'cecchi-chianti-750-ml-vino-tinto.jpg', 1, 3),
('Pizza Diavola', 'Pizza con salami picante, mozzarella y albahaca', 9500, 'pizzaDiavola-11.jpg', 1, 1),
('Spaghetti Carbonara', 'Spaghetti con salsa de huevo, panceta y queso pecorino', 3500, 'spaguettiCarbonara.jpg', 1, 2);

INSERT INTO productos (nombre_producto, descripcion, precio, imagen, estado_disponible, id_categoria) VALUES
('Refresco', 'refresco a su gusto', 1400, 'refresco-12.jpg', 1, 3);

INSERT INTO ingredientes (nombre_ingrediente) VALUES 
('Salsa de tomate'),
('Mozzarella'),
('Albahaca'),
('Harina'),
('Levadura'),
('Carne de res'),
('Salami picante'),
('Bechamel'),
('Queso Parmesano'),
('Queso Pecorino'),
('Huevo'),
('Panceta'),
('Café'),
('Cacao'),
('Vino');

-- Pizza Margherita (Salsa de tomate, Mozzarella, Albahaca, Harina, Levadura)
INSERT INTO producto_ingrediente (id_producto, id_ingrediente) VALUES 
(1, 1), -- Salsa de tomate
(1, 2), -- Mozzarella
(1, 3), -- Albahaca
(1, 4), -- Harina
(1, 5); -- Levadura

-- Lasagna Bolognese (Carne de res, Bechamel, Harina, Queso Parmesano)
INSERT INTO producto_ingrediente (id_producto, id_ingrediente) VALUES 
(2, 6), -- Carne de res
(2, 8), -- Bechamel
(2, 4), -- Harina
(2, 9); -- Queso Parmesano

-- Pizza Diavola (Salsa de tomate, Mozzarella, Salami picante, Harina, Levadura)
INSERT INTO producto_ingrediente (id_producto, id_ingrediente) VALUES 
(5, 1), -- Salsa de tomate
(5, 2), -- Mozzarella
(5, 7), -- Salami picante
(5, 4), -- Harina
(5, 5); -- Levadura

-- Spaghetti Carbonara (Panceta, Queso Pecorino, Huevo, Harina)
INSERT INTO producto_ingrediente (id_producto, id_ingrediente) VALUES 
(6, 11), -- Huevo
(6, 10), -- Queso Pecorino
(6, 12), -- Panceta
(6, 4); -- Harina

-- Tiramisú (Café, Cacao, Huevo, Harina)
INSERT INTO producto_ingrediente (id_producto, id_ingrediente) VALUES 
(3, 13), -- Café
(3, 14), -- Cacao
(3, 11), -- Huevo
(3, 4); -- Harina

-- Vino Tinto (Vino)
INSERT INTO producto_ingrediente (id_producto, id_ingrediente) VALUES 
(4, 15); -- Vino

INSERT INTO procesos_preparacion (nombre_proceso, imagen) VALUES 
('Preparar masa',"preparar-masa.jpg"),
('Hornear',"hornear.jpg"),
('Cortar',"cortar-pizza.jpeg"),
('Preparar pasta',"preparar-pasta.jpg"),
('Preparar salsa',"preparar-salsa.jpg"),
('Poner Hielo',"poner-hielo.jpg"),
('Escoger Bebida',"escoger-bebida.jpg"),
('Servir',"servir.jpg");

INSERT INTO producto_proceso_preparacion (id_producto, id_proceso, orden_estacion) VALUES 
(1, 1, 1), -- Pizza Margherita preparar masa
(1, 2, 2), -- Pizza Margarita Hornear
(1, 3, 3), -- Pizza Margarita Cortar
(1, 8, 4), -- Pizza Margarita Servir
(2, 4, 1), -- Lasagna preparar pasta
(2, 5, 2), -- Lasagna preparar salsa
(2, 2, 3), -- Lasagna Hornear
(2, 8, 4), -- Lasagna servir
(4, 8, 1); -- Vino servir directamente
 
INSERT INTO combos (descripcion, precio,imagen) VALUES 
('Combo Pizza y Bebida', 9500,"combo1.png"),
('Combo Familiar', 15550,"combo2.png"),
('Combo Italiano Clásico', 7000,"combo3.png");

-- Combo 1: Combo Pizza y Bebida (Pizza Margherita + Vino Tinto)
INSERT INTO combo_productos (id_combo, id_producto, cantidad) VALUES 
(1, 1, 1), -- Pizza Margherita
(1, 4, 1); -- Vino Tinto

-- Combo 2: Combo Familiar (2x Pizza Diavola + Lasagna Bolognese + Refresco)
INSERT INTO combo_productos (id_combo, id_producto, cantidad) VALUES 
(2, 5, 2), -- 2x Pizza Diavola
(2, 2, 1), -- Lasagna Bolognese
(2, 7, 2); -- 2x Refresco

-- Combo 3: Combo Italiano Clásico (Pizza Margherita + Spaghetti Carbonara + Tiramisú)
INSERT INTO combo_productos (id_combo, id_producto, cantidad) VALUES 
(3, 1, 1), -- Pizza Margherita
(3, 6, 1), -- Spaghetti Carbonara
(3, 3, 1); -- Tiramisú

INSERT INTO menus (nombre_menu, fecha_inicio, fecha_final,hora_inicio, hora_fin) 
VALUES 
('Menú Clásico Italiano 2', '2024-10-12','2024-12-20', '10:00:00', '12:00:00'),
('Menú Especial de la Casa 2', '2024-12-12','2024-12-19', '12:00:00', '16:00:00'),
('Menú Ligero', '2024-10-12 2', '2024-12-18', '10:00:00', '22:00:00');


-- Menú Clásico Italiano (Pizza Margherita + Vino Tinto + Tiramisú)
INSERT INTO menu_productos (id_menu,id_producto) VALUES 
(1, 1), -- Pizza Margherita
(1, 4), -- Vino Tinto
(1, 3); -- Tiramisú

-- Menú Especial de la Casa (Pizza Diavola + Lasagna Bolognese + Vino Tinto)
INSERT INTO menu_productos (id_menu, id_producto) VALUES 
(2, 5), -- Pizza Diavola
(2, 2), -- Lasagna Bolognese
(2, 4); -- Vino Tinto

-- Menú Ligero (Spaghetti Carbonara + Refresco)
INSERT INTO menu_productos (id_menu, id_producto) VALUES 
(3, 6), -- Spaghetti Carbonara
(3, 7); -- Refresco


INSERT INTO menu_combos (id_menu,id_combo) VALUES 
(1, 1); -- Combo 1: Combo Pizza y Bebida (Pizza Margherita + Vino Tinto)
INSERT INTO menu_combos (id_menu,id_combo) VALUES 
(1, 2);

SELECT 
                        m.nombre_menu, 
                        c.descripcion, 
                        c.precio,
                        c.imagen,
                        c.id_combo
                    FROM menus m
                    JOIN menu_combos mc ON m.id_menu = mc.id_menu
                    JOIN combos c ON mc.id_combo = c.id_combo
                    WHERE m.id_menu = 1;

INSERT INTO menu_combos (id_menu,id_combo) VALUES 
(2, 2); -- Combo 2: Combo Familiar (2x Pizza Diavola + Lasagna Bolognese + Refresco)

INSERT INTO menu_combos (id_menu,id_combo) VALUES 
(3, 3); -- Combo 3: Combo Italiano Clásico (Pizza Margherita + Spaghetti Carbonara + Tiramisú)

-- Gestion de pedidos
INSERT INTO estado_pedido (descripcion_estado)
VALUES 
('En preparación'), 
('En camino'), 
('Entregado');




INSERT INTO pagos (metodo_pago, monto_pago, vuelto, costo_envio, direccion_entrega, fecha_pago)
VALUES 
('tarjeta', 40.50, 0.00, 5.00, 'Avenida Central, Ciudad', NOW());

INSERT INTO pedido (id_cliente, id_encargado, metodo_entrega,fecha_pedido, id_pago, id_estado)
VALUES 
(1, NULL, 'Domicilio', NOW(), 1, 1);

INSERT INTO detalle_pedido (id_pedido, subtotal, impuesto, total_con_impuesto)
VALUES 
(1, 35.50, 5.00, 40.50);

INSERT INTO detalle_pedido_productos (id_detalle_pedido, id_producto, cantidad)
VALUES 
(1, 1, 2),  -- 2 Pizzas Pepperoni
(1, 3, 1);  -- 1 Brownie

INSERT INTO detalle_pedido_combos (id_detalle_pedido, id_combo, cantidad)
VALUES 
(1, 1, 1);  -- 1 Combo 1



INSERT INTO cocina (id_pedido, id_producto, cantidad, id_proceso, estado_preparacion, fecha_inicio) VALUES 
(1, 1, 2, 1, 'en preparación', NOW()), -- Pizza Margherita en proceso de hornear
(1, 2, 1, 2, 'en preparación', NOW()), -- Lasagna en proceso de preparar salsa
(2, 4, 2, 3, 'completado', NOW()); -- Vino Tinto servido
 

-- Consultas para realizar mostrar los datos
-- Coonsulta para traer los ingredientes de un Producto en especifico
SELECT pi.id_ingrediente, pi.nombre_ingrediente
FROM producto_ingrediente p
JOIN ingredientes pi ON pi.id_ingrediente = p.id_ingrediente
WHERE p.id_producto = 1; -- 1: Poner parametro en API

-- Consulta para trear la categoría del Producto
SELECT c.id_categoria, c.nombre_categoria
FROM productos p
JOIN categorias c ON p.id_categoria = c.id_categoria
WHERE p.id_producto = 6; -- 6: Poner parametro en el API

-- Consulta para obtener los precesos de preparacion
SELECT pp.nombre_proceso, pr.nombre_producto, ppp.orden_estacion
FROM producto_proceso_preparacion ppp
JOIN productos pr ON ppp.id_producto = pr.id_producto
JOIN procesos_preparacion pp ON ppp.id_proceso = pp.id_proceso
where ppp.id_producto = 1
ORDER BY pr.id_producto ASC, ppp.orden_estacion ASC;

-- Consulta para mostrar procesos con nombre de producto
SELECT pp.nombre_proceso, pr.nombre_producto, ppp.orden_estacion
FROM producto_proceso_preparacion ppp
JOIN productos pr ON ppp.id_producto = pr.id_producto
JOIN procesos_preparacion pp ON ppp.id_proceso = pp.id_proceso
ORDER BY pr.nombre_producto ASC, ppp.orden_estacion ASC;

-- Para poder obtener la cantidad de procesos de preparación
SELECT pr.nombre_producto, COUNT(ppp.id_proceso) AS cantidad_procesos
FROM producto_proceso_preparacion ppp
JOIN productos pr ON ppp.id_producto = pr.id_producto
JOIN procesos_preparacion pp ON ppp.id_proceso = pp.id_proceso
GROUP BY pr.nombre_producto
ORDER BY pr.nombre_producto ASC;

-- Consulta para obtener los menus disponibles
SELECT * FROM menus
order by fecha_inicio desc;

-- Consulta para obtener menu y el nombre de la categoria del menu
SELECT 
m.nombre_menu, c.descripcion, c.precio, c.id_producto, c.nombre_producto, c.id_categoria, cat.nombre_categoria -- Añadimos el nombre de la categoría
FROM menus m
JOIN menu_productos mc ON m.id_menu = mc.id_menu
JOIN productos c ON mc.id_producto = c.id_producto
JOIN categorias cat ON c.id_categoria = cat.id_categoria -- Unimos la tabla de categorías para obtener el nombre
WHERE m.id_menu =1;

-- Consulta para obtener los productos que no tienes procesos de preparacion
SELECT p.id_producto, p.nombre_producto
FROM productos p
LEFT JOIN producto_proceso_preparacion ppp ON p.id_producto = ppp.id_producto
WHERE ppp.id_proceso IS NULL;

-- Select para obtener todo de un pedido
-- Tabla pedido
SELECT  id_pedido, id_cliente, id_encargado, metodo_entrega, fecha_pedido, id_pago, id_estado
FROM  pedido;
-- Tabla detalle pedido
SELECT  id_pedido, id_detalle, subtotal, impuesto, total_con_impuesto
FROM  detalle_pedido;

-- Tabla detaplle_pedido_producto
SELECT   dpp.id_detalle_pedido,   dpp.id_producto, dpp.cantidad, p.nombre_producto, p.descripcion, p.precio,  
    p.imagen, p.estado_disponible, p.id_categoria
	FROM  detalle_pedido_productos dpp
	LEFT JOIN productos p ON dpp.id_producto = p.id_producto;
    
-- Tabla detalle_pedido_combo
SELECT   dpc.id_detalle_pedido,   dpc.id_combo, c.descripcion, c.precio AS precio_combo, dpc.cantidad, p.id_producto, 
    p.nombre_producto, p.precio AS precio_producto, p.id_categoria 
	FROM  detalle_pedido_combos dpc
	LEFT JOIN combos c ON dpc.id_combo = c.id_combo
	LEFT JOIN combo_productos cp ON dpc.id_combo = cp.id_combo 
	LEFT JOIN productos p ON cp.id_producto = p.id_producto;

-- Select completo con toda la informacion del pedido del cliente 

SELECT p.id_pedido, p.id_cliente, u.nombre_usuario, p.id_encargado, p.metodo_entrega, p.fecha_pedido, p.id_pago, e.descripcion_estado, dp.subtotal, dp.impuesto, dp.total_con_impuesto
FROM pedido p
JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
JOIN usuarios u ON p.id_cliente = u.id_usuario
JOIN estado_pedido e ON p.id_estado = e.id_estado 
WHERE p.id_cliente = 1;


-- Consulta para trear el menu disponible 
SELECT *
FROM menus
WHERE (fecha_final > CURDATE()) OR (fecha_final = CURDATE() AND hora_fin > CURTIME())
ORDER BY (fecha_final - CURDATE()) * 86400 + (hora_fin - CURTIME())  -- Convierte las diferencias de fechas y horas a segundos
LIMIT 1;

-- con id cliente sacar de usuarios el nombre del usuario, con id_encargado traer el nombre de encargado de usuarios, sacar de pe.id_pago el pago de la tabla pagos, con pe.id_estado sacar el nombre del estado de la tabla estado_pedido

SELECT  pa.id_pago, pa.metodo_pago, pa.vuelto, pa.costo_envio, pa.fecha_pago, pe.id_pedido, pe.metodo_entrega, pe.fecha_pedido, pe.id_cliente, cliente.nombre_usuario AS nombre_cliente, pe.id_encargado, encargado.nombre_usuario AS nombre_encargado,
pe.id_estado, ep.descripcion_estado AS estado_pedido, dep.subtotal, dep.impuesto, dep.total_con_impuesto, dpp.id_producto, dpp.cantidad, pr.nombre_producto, pr.precio
FROM  pagos pa
INNER JOIN pedido pe ON pa.id_pago = pe.id_pago
LEFT JOIN usuarios cliente ON pe.id_cliente = cliente.id_usuario
LEFT JOIN usuarios encargado ON pe.id_encargado = encargado.id_usuario
LEFT JOIN estado_pedido ep ON pe.id_estado = ep.id_estado
LEFT JOIN detalle_pedido dep ON pe.id_pedido = dep.id_pedido
LEFT JOIN detalle_pedido_productos dpp on dep.id_detalle_pedido = dpp.id_detalle_pedido
LEFT JOIN productos pr on dpp.id_producto = pr.id_producto where pe.id_pedido= 1 ;



-- consulta para obtener detalle 
SELECT dpp.id_producto, dpp.cantidad, dpc.id_combo, dpc.cantidad
FROM  detalle_pedido_productos
LEFT JOIN productos pr ON dpp.id_producto = pr.id_producto 
LEFT JOIN detalle_pedido_combos dpc ON dep.id_detalle = dpc.id_detalle_pedido
LEFT JOIN combos co ON dep.id_detalle = dpc.id_detalle_pedido
    where pe.id_pedido = 1;
    
    
    -- consulta de prodcutos del pedido
SELECT 
            dpp.id_producto, 
            pr.nombre_producto,
            dpp.cantidad AS cantidad_producto, 
            pr.precio AS precio_producto,
            (pr.precio * 0.13) AS impuestos,
            (pr.precio + (pr.precio * 0.13)) AS total_con_impuestos
            FROM pedido pe
            JOIN detalle_pedido dep ON pe.id_pedido = dep.id_pedido
            LEFT JOIN detalle_pedido_productos dpp ON dep.id_detalle = dpp.id_detalle_pedido
            LEFT JOIN productos pr ON dpp.id_producto = pr.id_producto
            WHERE pe.id_pedido =1;
 
    
    Select * from pedido where id_pedido= 5;
    
    SELECT p.id_pedido, u.nombre_usuario, p.metodo_entrega, p.fecha_pedido, e.descripcion_estado, dp.subtotal, dp.impuesto, dp.total_con_impuesto
            FROM pedido p
            JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
            JOIN usuarios u ON p.id_cliente = u.id_usuario
            JOIN estado_pedido e ON p.id_estado = e.id_estado 
            WHERE p.id_pedido = 1;

-- obtener prodcutos del pedido
SELECT 
    dpp.id_producto, 
    p.nombre_producto, 
    dpp.cantidad, 
    p.precio
FROM 
    detalle_pedido_productos dpp
JOIN 
    detalle_pedido dp ON dpp.id_detalle_pedido = dp.id_detalle
JOIN 
    productos p ON dpp.id_producto = p.id_producto
WHERE 
    dp.id_pedido = 4; 


-- Consulta para el detalle del pedido
Select * from pagos;
Select * from pedido;
Select * from detalle_pedido;
Select * from detalle_pedido_productos;
Select * from detalle_pedido_combos;


-- Reportes
-- Lista de pedidos por estado
DROP VIEW IF EXISTS vistacantidadpedidosporestado;

CREATE VIEW vistacantidadpedidosporestado AS
SELECT 
    ep.id_estado AS IdEstado,
    ep.descripcion_estado AS Estado,
    COUNT(p.id_pedido) AS CantidadPedidos
FROM 
    estado_pedido ep
LEFT JOIN 
    pedido p ON ep.id_estado = p.id_estado
GROUP BY 
    ep.id_estado, ep.descripcion_estado
ORDER BY 
    ep.id_estado;
    
-- Lista de prodcutos mas comprados
DROP VIEW IF EXISTS vistaproductomascomprado;

CREATE VIEW vistaproductomascomprado AS
SELECT 
    p.id_producto AS IdProducto,
    p.nombre_producto AS Nombre,
    SUM(dpp.cantidad) AS TotalCantidadVendida
FROM 
    detalle_pedido_productos dpp
JOIN 
    productos p ON dpp.id_producto = p.id_producto
GROUP BY 
    p.id_producto, p.nombre_producto
ORDER BY 
    TotalCantidadVendida DESC
LIMIT 5;

    
-- Lista de productos menos comprados
DROP VIEW IF EXISTS vistaproductosmenoscomprados;

CREATE VIEW vistaproductosmenoscomprados AS
SELECT 
    p.id_producto AS IdProducto,
    p.nombre_producto AS Nombre,
    SUM(dpp.cantidad) AS TotalCantidadVendida
FROM 
    detalle_pedido_productos dpp
JOIN 
    productos p ON dpp.id_producto = p.id_producto
GROUP BY 
    p.id_producto, p.nombre_producto
ORDER BY 
    TotalCantidadVendida ASC
LIMIT 1;


-- Lista de combos mas comprados
DROP VIEW IF EXISTS vistacombomascomprado;

CREATE VIEW vistacombomascomprado AS
SELECT 
    c.id_combo AS IdCombo,
    c.descripcion AS Nombre,
    SUM(dpc.cantidad) AS TotalCantidadVendida
FROM 
    detalle_pedido_combos dpc
JOIN 
    combos c ON dpc.id_combo = c.id_combo
GROUP BY 
    c.id_combo, c.descripcion
ORDER BY 
    TotalCantidadVendida DESC LIMIT 5;

-- Lista de combos menos comprados
DROP VIEW IF EXISTS vistacombosmenoscomprados;

CREATE VIEW vistacombosmenoscomprados AS
SELECT 
    c.id_combo AS IdCombo,
    c.descripcion AS Nombre,
    SUM(dpc.cantidad) AS TotalCantidadVendida
FROM 
    detalle_pedido_combos dpc
JOIN 
    combos c ON dpc.id_combo = c.id_combo
GROUP BY 
    c.id_combo, c.descripcion
ORDER BY 
    TotalCantidadVendida ASC;

Select * from vistacantidadpedidosporestado;
Select * from vistaproductomascomprado;
Select * from vistaproductosmenoscomprados;
Select * from vistacombomascomprado;
Select * from vistacombosmenoscomprados;

Select * from pedido;
Update pedido set id_estado = 2 where id_pedido = 2;

