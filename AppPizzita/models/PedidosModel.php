<?php
require 'vendor/autoload.php';
class PedidosModel
{
    //Conectarse a la BD
    public $enlace;
    private $pusher;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
        $options = array(
            'cluster' => 'us2',
            'useTLS' => true
        );
        $this->pusher = new Pusher\Pusher(
            "06dabb1b02b492196f2e", // APP Key
            "e1c2954888aacbcb6627", // Secret Key
            "1902325", // APP ID
            array('cluster' => 'us2', 'useTLS' => true)
        );
    }
    /**
     * Listar productos
     * @param 
     * @return $vResultado - Lista de objetos
     */
    public function all()
    {
        try {
            //Consulta SQL
            $vSQL = "SELECT p.id_pedido, u.nombre_usuario, p.metodo_entrega, p.fecha_pedido, e.descripcion_estado, dp.subtotal, dp.impuesto, dp.total_con_impuesto
            FROM pedido p
            JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
            JOIN usuarios u ON p.id_cliente = u.id_usuario
            JOIN estado_pedido e ON p.id_estado = e.id_estado";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /**
     * Obtener un Producto
     * @param $id del Producto
     * @return $vresultado - Objeto Producto
     */

    public function get($id)
    {
        try {
            //Consulta sql
            $vSql = "SELECT p.id_pedido, u.nombre_usuario, p.metodo_entrega, p.fecha_pedido, e.descripcion_estado, dp.subtotal, dp.impuesto, dp.total_con_impuesto
            FROM pedido p
            JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
            JOIN usuarios u ON p.id_cliente = u.id_usuario
            JOIN estado_pedido e ON p.id_estado = e.id_estado 
            WHERE p.id_pedido = $id;";

            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado[0];
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }

    public function getDetallePedido($id)
    {
        try {
            // Consulta SQL principal
            $vSql = "SELECT  pe.id_pedido, cliente.nombre_usuario as nombre_usuario, encargado.nombre_usuario as encargado, pa.metodo_pago, pa.vuelto, pa.costo_envio, pa.fecha_pago, pe.id_pedido, pe.metodo_entrega, pe.fecha_pedido, pe.id_cliente, pe.id_encargado, pe.id_estado, ep.descripcion_estado, dep.subtotal, dep.impuesto, dep.total_con_impuesto
            FROM  pagos pa
            INNER JOIN pedido pe ON pa.id_pago = pe.id_pago
            LEFT JOIN usuarios cliente ON pe.id_cliente = cliente.id_usuario
            LEFT JOIN usuarios encargado ON pe.id_encargado = encargado.id_usuario
            LEFT JOIN estado_pedido ep ON pe.id_estado = ep.id_estado
            LEFT JOIN detalle_pedido dep ON pe.id_pedido = dep.id_pedido
            WHERE pe.id_pedido = $id;";

            // Ejecutar la consulta principal
            $vResultado = $this->enlace->ExecuteSQL($vSql);

            if (empty($vResultado)) {
                return null; // Si no se encuentra el pedido, retorna null
            }

            // Convertir el resultado principal en un objeto
            $pedido = $vResultado[0];

            // Consulta para obtener los productos del pedido
            $vSqlP = "SELECT 
                dpp.id_producto, 
                pr.nombre_producto,
                dpp.cantidad AS cantidad_producto, 
                pr.precio as precio_unitario,
                (pr.precio * dpp.cantidad ) AS precio_producto,
                ((pr.precio * dpp.cantidad) * 0.13) AS impuestos,
                ((pr.precio * dpp.cantidad) + ((pr.precio * dpp.cantidad) * 0.13)) AS total_con_impuestos,
                pr.imagen
            FROM pedido pe
            JOIN detalle_pedido dep ON pe.id_pedido = dep.id_pedido
            LEFT JOIN detalle_pedido_productos dpp ON dep.id_detalle = dpp.id_detalle_pedido
            LEFT JOIN productos pr ON dpp.id_producto = pr.id_producto
            WHERE pe.id_pedido = $id;";

            // Ejecutar consulta de productos
            $vResultadoP = $this->enlace->ExecuteSQL($vSqlP);

            // Añadir los productos al pedido
            $pedido->productos = !empty($vResultadoP) ? $vResultadoP : [];

            // Consulta para obtener los combos del pedido
            $vSqlC = "SELECT 
                dpc.id_combo, 
                co.descripcion,
                co.imagen,
                dpc.cantidad AS cantidad_combo, 
                co.precio as precio_unitario,
                (co.precio * dpc.cantidad)AS precio_combo,
                ((co.precio * dpc.cantidad) * 0.13) AS impuestos,
                ((co.precio * dpc.cantidad) + ((co.precio * dpc.cantidad) * 0.13)) AS total_con_impuestos
            FROM pedido pe
            JOIN detalle_pedido dep ON pe.id_pedido = dep.id_pedido
            LEFT JOIN detalle_pedido_combos dpc ON dep.id_detalle = dpc.id_detalle_pedido
            LEFT JOIN combos co ON dpc.id_combo = co.id_combo
            WHERE pe.id_pedido = $id;";

            // Ejecutar consulta de combos
            $vResultadoC = $this->enlace->ExecuteSQL($vSqlC);

            // Añadir los combos al pedido
            $pedido->combos = !empty($vResultadoC) ? $vResultadoC : [];

            // Retornar el objeto
            return $pedido;
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }

    public function getDetallePedidoCocina($id)
    {
        try {
            // Consulta SQL principal
            $vSql = "SELECT  pe.id_pedido, cliente.nombre_usuario as nombre_usuario, encargado.nombre_usuario as encargado, pa.metodo_pago, pa.vuelto, pa.costo_envio, pa.fecha_pago, pe.id_pedido, pe.metodo_entrega, pe.fecha_pedido, pe.id_cliente, pe.id_encargado, pe.id_estado, ep.descripcion_estado, dep.subtotal, dep.impuesto, dep.total_con_impuesto
            FROM  pagos pa
            INNER JOIN pedido pe ON pa.id_pago = pe.id_pago
            LEFT JOIN usuarios cliente ON pe.id_cliente = cliente.id_usuario
            LEFT JOIN usuarios encargado ON pe.id_encargado = encargado.id_usuario
            LEFT JOIN estado_pedido ep ON pe.id_estado = ep.id_estado
            LEFT JOIN detalle_pedido dep ON pe.id_pedido = dep.id_pedido
            WHERE pe.id_pedido = $id;";

            // Ejecutar la consulta principal
            $vResultado = $this->enlace->ExecuteSQL($vSql);

            if (empty($vResultado)) {
                return null; // Si no se encuentra el pedido, retorna null
            }

            // Convertir el resultado principal en un objeto
            $pedido = $vResultado[0];

            // Consulta para obtener los productos del pedido
            $vSqlP = "SELECT 
                dpp.id_producto, 
                pr.nombre_producto,
                dpp.cantidad AS cantidad_producto, 
                pr.precio as precio_unitario,
                (pr.precio * dpp.cantidad ) AS precio_producto,
                ((pr.precio * dpp.cantidad) * 0.13) AS impuestos,
                ((pr.precio * dpp.cantidad) + ((pr.precio * dpp.cantidad) * 0.13)) AS total_con_impuestos,
                pr.imagen
            FROM pedido pe
            JOIN detalle_pedido dep ON pe.id_pedido = dep.id_pedido
            LEFT JOIN detalle_pedido_productos dpp ON dep.id_detalle = dpp.id_detalle_pedido
            LEFT JOIN productos pr ON dpp.id_producto = pr.id_producto
            WHERE pe.id_pedido = $id;";

            // Ejecutar consulta de productos
            $vResultadoP = $this->enlace->ExecuteSQL($vSqlP);

            // Añadir los productos al pedido
            $pedido->productos = !empty($vResultadoP) ? $vResultadoP : [];

            // Consulta para obtener los combos del pedido
            $vSqlC = "SELECT 
                dpc.id_combo, 
                co.descripcion,
                co.imagen,
                dpc.cantidad AS cantidad_combo, 
                co.precio as precio_unitario,
                (co.precio * dpc.cantidad)AS precio_combo,
                ((co.precio * dpc.cantidad) * 0.13) AS impuestos,
                ((co.precio * dpc.cantidad) + ((co.precio * dpc.cantidad) * 0.13)) AS total_con_impuestos
            FROM pedido pe
            JOIN detalle_pedido dep ON pe.id_pedido = dep.id_pedido
            LEFT JOIN detalle_pedido_combos dpc ON dep.id_detalle = dpc.id_detalle_pedido
            LEFT JOIN combos co ON dpc.id_combo = co.id_combo
            WHERE pe.id_pedido = $id;";

            // Ejecutar consulta de combos
            $vResultadoC = (array)$this->enlace->ExecuteSQL($vSqlC);
            // Iterar por los combos y agregar los productos a cada combo
            if (!empty($vResultadoC)) {
                foreach ($vResultadoC as &$combo) {
                    if ($combo->id_combo !== null) {
                        // Consulta de productos para cada combo
                        $vSqlProductosCombo = "SELECT 
                                            p.id_producto, 
                                            p.nombre_producto, 
                                            p.imagen,
                                            cp.cantidad
                                        FROM combo_productos cp
                                        JOIN productos p ON cp.id_producto = p.id_producto
                                        WHERE cp.id_combo = " . $combo->id_combo;

                        // Ejecutar consulta de productos en combo
                        $vResultadoProductosCombo = $this->enlace->ExecuteSQL($vSqlProductosCombo);

                        // Añadir los productos al combo
                        $combo->productos = !empty($vResultadoProductosCombo) ? $vResultadoProductosCombo : [];
                    }
                }
            }

            // Añadir los combos al pedido
            if($combo->id_combo !== null){
                $pedido->combos = !empty($vResultadoC) ? $vResultadoC : [];
            }

            // Retornar el objeto
            return $pedido;
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }



    public function getCliente($id)
    {
        try {
            $vSql = "SELECT p.id_pedido, u.nombre_usuario, p.metodo_entrega, p.fecha_pedido, e.descripcion_estado, dp.subtotal, dp.impuesto, dp.total_con_impuesto
            FROM pedido p
            JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
            JOIN usuarios u ON p.id_cliente = u.id_usuario
            JOIN estado_pedido e ON p.id_estado = e.id_estado 
            WHERE p.id_cliente = $id;";
            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);
            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }


    /**
     * Crear producto
     * @param $objeto producto a insertar
     * @return $this->get($id_producto) - Objeto producto
     */
    //
    public function create($objeto)
    {
        try {
            //Consulta sql
            // --- Insertar en pedido ---
            // --- Insertar en pagos ---
            $pagos = $objeto->pagos;
            $detallePedidoP = $objeto->detalle_pedido;
            $sqlPago = "INSERT INTO pagos (metodo_pago, monto_pago, vuelto, costo_envio, direccion_entrega, fecha_pago) 
          VALUES ('$pagos->metodo_pago', '$detallePedidoP->total_con_impuesto', '$pagos->vuelto', 
                  '$pagos->costo_envio', '$pagos->direccion_entrega', NOW())";
            //Ejecutar la consulta
            //Obtener ultimo insert
            $id_pago = $this->enlace->executeSQL_DML_last($sqlPago);

            $pedido = $objeto->pedido;
            //--- Pedido ---
            //Crear elementos a insertar en pedido
            $sqlPedido = "INSERT INTO pedido (id_cliente, id_encargado, metodo_entrega, fecha_pedido, id_pago, id_estado) 
                      VALUES ('$pedido->id_cliente', '$pedido->id_encargado', '$pedido->metodo_entrega', NOW(), '$id_pago', '$pedido->id_estado')";
            // Ejecutar consulta de pedido
            //Obtener ultimo insert
            $id_pedido = $this->enlace->executeSQL_DML_last($sqlPedido);

            //Detalle pedido
            // --- Insertar en detalle_pedido ---
            $detallePedido = $objeto->detalle_pedido;
            $sqlDetallePedido = "INSERT INTO detalle_pedido (id_pedido, subtotal, impuesto, total_con_impuesto) 
            VALUES ('$id_pedido', '$detallePedido->subtotal', '$detallePedido->impuesto', '$detallePedido->total_con_impuesto')";

            // Ejecutar consulta de detalle_pedido
            $id_detalle_pedido = $this->enlace->executeSQL_DML_last($sqlDetallePedido);

            //Insertar detalle de prodcutos
            // --- Insertar en detalle_pedido_productos ---
            foreach ($objeto->detalle_pedido_productos as $producto) {
                $sqlDetalleProducto = "INSERT INTO detalle_pedido_productos (id_detalle_pedido, id_producto, cantidad) 
                                   VALUES ('$id_detalle_pedido', '$producto->id_producto', '$producto->cantidad')";
                // Ejecutar consulta de detalle_pedido_productos
                $this->enlace->executeSQL_DML($sqlDetalleProducto);
            }

            //Insert del detalle combos
            // --- Insertar en detalle_pedido_combos ---
            foreach ($objeto->detalle_pedido_combos as $combo) {
                $sqlDetalleCombo = "INSERT INTO detalle_pedido_combos (id_detalle_pedido, id_combo, cantidad) 
                                VALUES ('$id_detalle_pedido', '$combo->id_combo', '$combo->cantidad')";
                // Ejecutar consulta de detalle_pedido_combos
                $this->enlace->executeSQL_DML($sqlDetalleCombo);
            }

            $vResultado = $this->get($id_pedido);

            // Verificar que $vResultado tenga los valores necesarios
            if (is_object($vResultado)) {
                // Emitir un evento a través de Pusher
                $this->pusher->trigger('pedidos', 'pedido-creado', [
                    'nombre_usuario' => $vResultado->nombre_usuario,             // Nombre del usuario
                    'metodo_entrega' => $vResultado->metodo_entrega,             // Método de entrega
                    'fecha_pedido' => $vResultado->fecha_pedido,                       // Fecha actual del pedido
                    'descripcion_estado' => $vResultado->descripcion_estado,     // Descripción del estado del pedido
                    'subtotal' => $vResultado->subtotal,                         // Subtotal del pedido
                    'impuesto' => $vResultado->impuesto,                         // Impuesto del pedido
                    'total_con_impuesto' => $vResultado->total_con_impuesto,     // Total con impuesto
                ]);
            } else {
                // En caso de que $vResultado no sea un objeto válido
                error_log("Error: No se obtuvo un objeto válido para el pedido");
            }
            //Retornar producto
            return $this->get($id_pedido);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /**
     * Actualizar producto
     * @param $objeto producto a actualizar
     * @return $this->get($id_producto) - Objeto pelicula
     */
    //
    public function update($objeto)
    {
        try {
            //Consulta sql
            $sql = "Update productos SET nombre_producto ='$objeto->nombre_producto'," .
                "descripcion ='$objeto->descripcion',precio ='$objeto->precio',imagen ='$objeto->imagen'," .
                "id_categoria=$objeto->id_categoria" .
                " Where id_producto=$objeto->id_producto";

            //Ejecutar la consulta
            $cResults = $this->enlace->executeSQL_DML($sql);
            //Generos
            //Eliminar Generos
            $sql = "Delete from producto_ingrediente where id_producto=$objeto->id_producto";
            $cResults = $this->enlace->executeSQL_DML($sql);
            //Crear elemento a insertar en generos
            foreach ($objeto->ingredientes as $item) {
                $sql = "Insert into producto_ingrediente(id_producto, id_ingrediente)" .
                    "Values($objeto->id_producto,$item)";
                $vResultado = $this->enlace->executeSQL_DML($sql);
            }
            //Retornar pelicula
            return $this->get($objeto->id_producto);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
