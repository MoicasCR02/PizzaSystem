<?php
class CategoryModel{
    public $enlace;
    public function __construct() {
        
        $this->enlace=new MySqlConnect();
       
    }
    public function all(){
        try {
            //Consulta sql
			//Consulta sql
			$vSql = "SELECT * FROM categorias;";
			
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
				
			// Retornar el objeto
			return $vResultado;
		} catch ( Exception $e ) {
			die ( $e->getMessage () );
		}
    }

    public function get($id){
        try {
            //Consulta sql
			$vSql = "SELECT * FROM categorias where id_categoria=$id";
			
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
			return $vResultado[0];
		} catch ( Exception $e ) {
			die ( $e->getMessage () );
		}
    }
    public function getCategoryProduct($idProduct){
        try {
            //Consulta sql
			$vSql = "SELECT c.id_categoria, c.nombre_categoria ". 
            "FROM productos p ".
            "JOIN categorias c ON p.id_categoria = c.id_categoria ".
            "WHERE p.id_producto = $idProduct; ";
			
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
			return $vResultado;
		} catch ( Exception $e ) {
			die ( $e->getMessage () );
		}
    }

	//funcion para traer el nombre de la categoria de un producto para menu
	public function getCategoryProductMenu($idProduct){
        try {
            //Consulta sql
			$vSql = "SELECT c.nombre_categoria ". 
            "FROM productos p ".
            "JOIN categorias c ON p.id_categoria = c.id_categoria ".
            "WHERE p.id_producto = $idProduct; ";
			
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			// Retornar el objeto
			return $vResultado;
		} catch ( Exception $e ) {
			die ( $e->getMessage () );
		}
    }

    //Sin uso
	public function getProductsByCategory($param){
        try {
			$vResultado =null;
			if(!empty($param )){
				$vSql="SELECT m.id, m.lang, m.time, m.title, m.year
				FROM movie_genre mg, movie m
				where mg.movie_id=m.id and mg.genre_id=$param";
				$vResultado = $this->enlace->ExecuteSQL ( $vSql);
			}
			// Retornar el objeto
			return $vResultado;
		} catch ( Exception $e ) {
			die ( $e->getMessage () );
		}
    }
	public function create($objeto) {
        try {
            //Consulta sql
            //Identificador autoincrementable
            
			$vSql = "Insert into genre (title) Values ('$objeto->title')";
			
            //Ejecutar la consulta
			$vResultado = $this->enlace->executeSQL_DML_last( $vSql);
			// Retornar el objeto creado
            return $this->get($vResultado);
		} catch (Exception $e) {
            handleException($e);
        }
    }
    public function update($objeto) {
        try {
            //Consulta sql
			$vSql = "Update genre SET title ='$objeto->title' Where id=$objeto->id";
			
            //Ejecutar la consulta
			$vResultado = $this->enlace->executeSQL_DML( $vSql);
			// Retornar el objeto actualizado
            return $this->get($objeto->id);
		} catch (Exception $e) {
            handleException($e);
        }
    }
}