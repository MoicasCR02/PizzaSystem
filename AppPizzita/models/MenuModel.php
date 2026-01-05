<?php
class MenuModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /* Listar */
    public function all()
    {
        try {
            // Consulta SQL
            $vSql = "SELECT * FROM menus order by fecha_inicio desc;";
            // Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /* Obtener */
    public function get($id)
    {
        try {
            $combosM = new CombosModel();
            $productosM = new ProductModel();

            // Consulta SQL para obtener el menú
            $vSql = "SELECT * FROM menus WHERE id_menu = $id;";

            // Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);

            // Si se obtiene un resultado
            if (!empty($vResultado)) {
                // Asignar el primer resultado (el menú)
                $vResultado = (object) $vResultado[0];
                //Productos del menu
                $listaProductos = $productosM->getProductosMenu($id);
                $vResultado->productos = $listaProductos;
                // Obtener los combos del menú
                
                $listaCombos = $combosM->getCombosMenu($id);
                // Asignar los combos al menú
                $vResultado->combos = $listaCombos;
            }

            // Retornar el menú con los combos
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /* Obtener Menu disponible */
    public function getMenuDisponible()
    {
        try {
            $combosM = new CombosModel();
            $productosM = new ProductModel();

            // Consulta SQL para obtener el menú
            $vSql = "SELECT *
            FROM menus
            WHERE (fecha_final > CURDATE()) OR (fecha_final = CURDATE() AND hora_fin > CURTIME())
            ORDER BY (fecha_final - CURDATE()) * 86400 + (hora_fin - CURTIME())  -- Convierte las diferencias de fechas y horas a segundos
            LIMIT 1;";

            // Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);

            // Si se obtiene un resultado
            if (!empty($vResultado)) {
                // Asignar el primer resultado (el menú)
                $vResultado = (object) $vResultado[0];
                //Productos del menu
                $listaProductos = $productosM->getProductosMenu($vResultado->id_menu);
                $vResultado->productos = $listaProductos;
                // Obtener los combos del menú
                $listaCombos = $combosM->getCombosMenu($vResultado->id_menu);
                // Asignar los combos al menú
                $vResultado->combos = $listaCombos;
            }

            // Retornar el menú con los combos
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create($objeto)
    {
        if (!$objeto || !isset($objeto->nombre_menu, $objeto->fecha_inicio, $objeto->hora_inicio, $objeto->hora_fin, $objeto->productos)) {
            throw new Exception("El objeto proporcionado es nulo o tiene propiedades faltantes.");
        }

        try {
            // Consulta SQL para insertar en `menus` (sin `id_menu` ya que es autoincremental)
            $sql = "INSERT INTO menus (nombre_menu, fecha_inicio, hora_inicio, hora_fin) " .
                "VALUES ('$objeto->nombre_menu', '$objeto->fecha_inicio', '$objeto->hora_inicio', '$objeto->hora_fin')";

            $idMenu = $this->enlace->executeSQL_DML_last($sql);

            // --- Insertar productos en `menu_productos` ---
            foreach ($objeto->productos as $item) {
                // Validar que `$item` sea el ID de producto antes de usarlo
                $sql = "INSERT INTO menu_productos(id_menu, id_producto) VALUES ($idMenu, $item)";
                $this->enlace->executeSQL_DML($sql);
            }

            // Retornar el menú insertado
            return $this->get($idMenu);
        } catch (Exception $e) {
            // Manejo de la excepción
            throw $e;
        }
    }

    public function update($objeto)
    {
        // Verificar que el objeto y sus propiedades necesarias existen
        if (!$objeto || !isset($objeto->id_menu, $objeto->nombre_menu, $objeto->fecha_inicio, $objeto->hora_inicio, $objeto->hora_fin, $objeto->productos)) {
            throw new Exception("El objeto proporcionado es nulo o tiene propiedades faltantes.");
        }

        try {
            // Actualizar el registro en la tabla `menus`
            $sql = "UPDATE menus SET nombre_menu = '$objeto->nombre_menu', " .
                "fecha_inicio = '$objeto->fecha_inicio', hora_inicio = '$objeto->hora_inicio', hora_fin = '$objeto->hora_fin' " .
                "WHERE id_menu = $objeto->id_menu";

            // Ejecutar la consulta de actualización
            $this->enlace->executeSQL_DML($sql);

            // Eliminar productos asociados con el menú en `menu_productos`
            $sql = "DELETE FROM menu_productos WHERE id_menu = $objeto->id_menu";
            $this->enlace->executeSQL_DML($sql);

            // Insertar productos nuevamente en `menu_productos`
            foreach ($objeto->productos as $item) {
                // Validar que `$item` sea el ID de producto antes de usarlo
                if (!isset($item->id_producto)) {
                    throw new Exception("Un producto en la lista de productos tiene propiedades faltantes.");
                }

                // Insertar producto en `menu_productos`
                $sql = "INSERT INTO menu_productos(id_menu, id_producto) VALUES ($objeto->id_menu, $item->id_producto)";
                $this->enlace->executeSQL_DML($sql);
            }

            // Retornar el menú actualizado
            return $this->get($objeto->id_menu);
        } catch (Exception $e) {
            // Manejo de la excepción
            throw $e;
        }
    }
}
