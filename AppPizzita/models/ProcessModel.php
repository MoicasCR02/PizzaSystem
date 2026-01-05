<?php
class ProcessModel
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

            $ProductM = new ProcessModel();
            //Consulta SQL
            $vSQL = "SELECT pr.nombre_producto, pr.imagen, pr.id_producto, COUNT(ppp.id_proceso) AS cantidad_procesos " .
                "FROM producto_proceso_preparacion ppp " .
                "JOIN productos pr ON ppp.id_producto = pr.id_producto " .
                "JOIN procesos_preparacion pp ON ppp.id_proceso = pp.id_proceso " .
                "GROUP BY pr.nombre_producto " .
                "ORDER BY pr.nombre_producto ASC; ";
            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            //Retornar la respuesta
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
    //
    public function get($id)
    {
        try {
            $ProductM = new ProductModel();

            $vSql = "SELECT pp.nombre_proceso, pp.id_proceso, pr.nombre_producto, ppp.orden_estacion, pr.id_producto, pp.imagen " .
                "FROM producto_proceso_preparacion ppp " .
                "JOIN productos pr ON ppp.id_producto = pr.id_producto " .
                "JOIN procesos_preparacion pp ON ppp.id_proceso = pp.id_proceso " .
                "where ppp.id_producto = $id " .
                "ORDER BY pr.id_producto ASC, ppp.orden_estacion DESC;";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);

            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //sin uso

    /**
     * Crear proceso
     * @param $objeto pelicula a insertar
     * @return $this->get($idMovie) - Objeto pelicula
     */
    //
    public function create($objeto)
    {
        try {
            //--- Procesos de Preparacion ---
            //Crear elementos a insertar en procesos
            for ($i = 0; $i < count($objeto->id_proceso); $i++) {
                $id_proceso = $objeto->id_proceso[$i];
                $orden_estacion = $objeto->orden_estacion[$i];
                $sql = "INSERT INTO producto_proceso_preparacion (id_producto, id_proceso, orden_estacion) " .
                    "VALUES ('$objeto->id_producto', '$id_proceso', '$orden_estacion')";

                $this->enlace->executeSQL_DML($sql);
            }
            //Retornar pelicula
            return $this->get($objeto->id_producto);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /**
     * Actualizar pelicula
     * @param $objeto pelicula a actualizar
     * @return $this->get($idMovie) - Objeto pelicula
     */
    //
    public function update($objeto)
    {
        //Consulta sql
        try {
            //Eliminamos los procesos que teniamos antes
            $vsqlDelete = "Delete from  producto_proceso_preparacion where id_producto = $objeto->id_producto;";
            $this->enlace->executeSQL_DML($vsqlDelete);
            //--- Procesos de Preparacion ---
            //Crear elementos a insertar en procesos
            for ($i = 0; $i < count($objeto->id_proceso); $i++) {
                $id_proceso = $objeto->id_proceso[$i];
                $orden_estacion = $objeto->orden_estacion[$i];
                $sql = $sql = "INSERT INTO producto_proceso_preparacion (id_producto, id_proceso, orden_estacion) " .
                "VALUES ('$objeto->id_producto', '$id_proceso', '$orden_estacion')";
                $this->enlace->executeSQL_DML($sql);
            }
            //Retornar 
            return $this->get($objeto->id_producto);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
