<?php
//localhost:81/apimovie/productos
class ProductModel
{
    //Conectarse a la BD
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
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
            $vSQL = "SELECT * FROM productos order by nombre_producto desc;";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            //Retornar la respuesta
            $imagenM = new ImagenModel();
            if (!empty($vResultado) && is_array($vResultado)) {
                for ($i = 0; $i < count($vResultado); $i++) {
                    $vResultado[$i]->imagen = $imagenM->getImagenProduct($vResultado[$i]->id_producto);
                }
            }
            //Editar código para traer imagen de la misma tabla
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

     /**
     * Listar productos sin procesos de preparacion
     * @param 
     * @return $vResultado - Lista de objetos
     */
    public function allProcess()
    {
        try {
            //Consulta SQL
            $vSQL = "SELECT p.id_producto, p.nombre_producto
                FROM productos p
                LEFT JOIN producto_proceso_preparacion ppp ON p.id_producto = ppp.id_producto
                WHERE ppp.id_proceso IS NULL;";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            //Retornar la respuesta
            $imagenM = new ImagenModel();
            if (!empty($vResultado) && is_array($vResultado)) {
                for ($i = 0; $i < count($vResultado); $i++) {
                    $vResultado[$i]->imagen = $imagenM->getImagenProduct($vResultado[$i]->id_producto);
                }
            }
            //Editar código para traer imagen de la misma tabla
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
            $IngredientM = new IngredientModel();
            $CategoryM = new CategoryModel();
            $imagenM = new ImagenModel();
            $vSql = "SELECT * FROM productos
                    where id_producto=$id;";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);
            if (!empty($vResultado)) {
                $vResultado = $vResultado[0];
                //Ingredeintes --ingredientes
                $listaIngredientes = $IngredientM->getIngredientProduct($id);
                $vResultado->ingredientes = $listaIngredientes;
                //Categorias -- categorias
                $listaCategorias = $CategoryM->getCategoryProduct($id);
                $vResultado->categoria = $listaCategorias;
                //Imagen
                //$vResultado->imagen = $imagenM->getImagenProduct($vResultado->id_producto);
            }


            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getProductosCombos($idCombo)
    {
        try {

            //Consulta SQL
            $vSQL = "SELECT p.id_producto, p.nombre_producto, cp.cantidad
            FROM combo_productos cp
            JOIN productos p ON cp.id_producto = p.id_producto
            WHERE cp.id_combo = $idCombo;";
            //Establecer conexión

            //Ejecutar la consulta
            $vResultado = $this->enlace->executeSQL($vSQL);
            //Retornar el resultado
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getProductosMenu2($idMenu)
    {
        try {
            $CategoryM = new CategoryModel();
            //Consulta SQL
            $vSQL = "SELECT 
                        c.descripcion, 
                        c.precio,
                        c.id_producto,
                        c.nombre_producto,
                        c.id_categoria
                    FROM menus m
                    JOIN menu_productos mc ON m.id_menu = mc.id_menu
                    JOIN productos c ON mc.id_producto = c.id_producto
                    WHERE m.id_menu = $idMenu";

            //Ejecutar la consulta
            $vResultado = $this->enlace->executeSQL($vSQL);
            //Retornar el resultado
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getProductosMenu($idMenu)
{
    try {
        // Instanciar el modelo de Categoría
        $CategoryM = new CategoryModel();

        // Consulta SQL para obtener los productos relacionados con el menú
        $vSQL = "SELECT c.id_producto,
         c.nombre_producto, 
        cat.nombre_categoria,
        c.precio,
        c.imagen,
        c.descripcion
         -- Añadimos el nombre de la categoría
        FROM menus m
        JOIN menu_productos mc ON m.id_menu = mc.id_menu
        JOIN productos c ON mc.id_producto = c.id_producto
        JOIN categorias cat ON c.id_categoria = cat.id_categoria -- Unimos la tabla de categorías para obtener el nombre
        WHERE m.id_menu = $idMenu";

        // Ejecutar la consulta
        $vResultado = $this->enlace->executeSQL($vSQL);

        // Convertir a objeto si es un array
        if (is_array($vResultado)) {
            $vResultado = json_decode(json_encode($vResultado));  // Convierte el array en un objeto
        }

        // Recorre los productos y agrega el nombre de la categoría al objeto


        // Retornar el resultado como un objeto
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
            //Identificador autoincrementable
            $sql = "Insert into productos (nombre_producto, descripcion, precio, imagen, id_categoria)" .
                " Values ('$objeto->nombre_producto','$objeto->descripcion','$objeto->precio','$objeto->imagen',$objeto->id_categoria)";

            //Ejecutar la consulta
            //Obtener ultimo insert
            $id_producto = $this->enlace->executeSQL_DML_last($sql);
            //--- Ingredientes ---
            //Crear elementos a insertar en ingredientes
            foreach ($objeto->ingredientes as $item) {
                $sql = "Insert into producto_ingrediente(id_producto, id_ingrediente)" .
                    "Values($id_producto,$item)";
                $vResultado = $this->enlace->executeSQL_DML($sql);
            }
            //Retornar producto
            return $this->get($id_producto);
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
