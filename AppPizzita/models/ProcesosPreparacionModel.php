<?php
class ProcesosPreparacionModel
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
            $vSQL = "SELECT * FROM procesos_preparacion";
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
            $vSql = "SELECT * FROM procesos_preparacion
                    where id_procesos=$id;";

            //Ejecutar la consulta sql
            $vResultado = $this->enlace->executeSQL($vSql);

            //Retornar la respuesta
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
