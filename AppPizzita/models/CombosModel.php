<?php
class CombosModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /* Listar todos los combos */
    public function all()
    {
        try {
            // Consulta SQL
            $vSql = "SELECT * FROM combos;";

            // Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);

            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /* Obtener un combo por su ID */
    public function get($id)
    {
        try {
            $productosM = new ProductModel();
            $imagenM = new ImagenModel();

            // Consulta SQL para obtener el combo
            $vSql = "SELECT * FROM combos WHERE id_combo = $id;";

            // Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);

            // Si se obtiene un resultado
            if (!empty($vResultado)) {
                // Asignar el primer resultado (el combo)
                $vResultado = (object) $vResultado[0]; // Convertir en objeto si no lo es

                // Obtener los productos del combo
                $listaProductos = $productosM->getProductosCombos($id);

                // Asignar los productos al combo
                $vResultado->productos = $listaProductos;

                //Imagen
                //$vResultado->imagen = $imagenM->getImagenCombo($vResultado->id_combo);
            }

            // Retornar el combo con los productos
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getCombosMenu($idMenu)
    {
        try {
            //Consulta SQL
            $productosM = new ProductModel();
            $vSQL = "SELECT 
                        m.nombre_menu, 
                        c.descripcion, 
                        c.precio,
                        c.imagen,
                        c.id_combo
                    FROM menus m
                    JOIN menu_combos mc ON m.id_menu = mc.id_menu
                    JOIN combos c ON mc.id_combo = c.id_combo
                    WHERE m.id_menu = $idMenu";
            //Establecer conexión

            // Ejecutar la consulta
            $vResultado = (array) $this->enlace->executeSQL($vSQL);

            // Verificar si la consulta no está vacía
            if (!empty($vResultado)) {
                // Recorrer todos los menús en el resultado
                foreach ($vResultado as &$menu) {  // Usamos &$menu para pasar por referencia y modificar cada menú
                    // Obtener los combos del menú (por cada $menu se hace la consulta para obtener sus productos)
                    $listaProductos = $productosM->getProductosCombos($idMenu);  // Suponiendo que cada menú tiene un idMenu

                    // Asignar los productos (combos) al menú
                    $menu->productos = $listaProductos;
                }
            }

            // Retornar el resultado
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create($objeto)
    {
        // Verificar que el objeto y sus propiedades necesarias existen
        if (!$objeto || !isset($objeto->descripcion, $objeto->precio, $objeto->productos)) {
            throw new Exception("El objeto proporcionado es nulo o tiene propiedades faltantes.");
        }

        try {
            // Insertar en combos (sin id_combo ya que se autoincrementa)
            $sql = "INSERT INTO combos (descripcion, precio, imagen) " .
                "VALUES ('$objeto->descripcion', $objeto->precio, '$objeto->imagen')";

            // Ejecutar la consulta y obtener el último ID insertado en combos
            $idCombo = $this->enlace->executeSQL_DML_last($sql);

            // --- Insertar productos en combo_productos ---
            foreach ($objeto->productos as $item) {
                // Validar que $item tiene id_producto y cantidad
                if (!isset($item->id_producto, $item->cantidad)) {
                    throw new Exception("Un producto en la lista de productos tiene propiedades faltantes.");
                }

                // Insertar producto con cantidad en combo_productos
                $sql = "INSERT INTO combo_productos(id_combo, id_producto, cantidad) " .
                    "VALUES ($idCombo, $item->id_producto, $item->cantidad)";
                $this->enlace->executeSQL_DML($sql);
            }

            // Retornar el combo insertado
            return $this->get($idCombo);
        } catch (Exception $e) {
            // Manejo de la excepción
            throw $e;
        }
    }

    public function update($objeto)
    {
        // Verificar que el objeto y sus propiedades necesarias existen
        if (!$objeto || !isset($objeto->id_combo, $objeto->descripcion, $objeto->precio, $objeto->productos)) {
            throw new Exception("El objeto proporcionado es nulo o tiene propiedades faltantes.");
        }

        try {
            // Actualizar el registro en la tabla combos
            $sql = "UPDATE combos SET descripcion = '$objeto->descripcion', precio = $objeto->precio " .
                "WHERE id_combo = $objeto->id_combo";

            $this->enlace->executeSQL_DML($sql);

            // Eliminar productos asociados con el combo en combo_productos
            $sql = "DELETE FROM combo_productos WHERE id_combo = $objeto->id_combo";
            $this->enlace->executeSQL_DML($sql);

            // Insertar productos nuevamente en combo_productos
            foreach ($objeto->productos as $item) {
                // Validar que $item tiene id_producto y cantidad
                if (!isset($item->id_producto, $item->cantidad)) {
                    throw new Exception("Un producto en la lista de productos tiene propiedades faltantes.");
                }

                // Insertar producto con cantidad en combo_productos
                $sql = "INSERT INTO combo_productos(id_combo, id_producto, cantidad) " .
                    "VALUES ($objeto->id_combo, $item->id_producto, $item->cantidad)";
                $this->enlace->executeSQL_DML($sql);
            }

            // Retornar el combo actualizado
            return $this->get($objeto->id_combo);
        } catch (Exception $e) {
            // Manejo de la excepción
            throw $e;
        }
    }
}
