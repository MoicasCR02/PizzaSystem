<?php 
//Cargar todos los paquetes
require_once "vendor/autoload.php";
use Firebase\JWT\JWT;

class rol{

    //Listar en el API
    public function index(){
        $response = new Response();
        //Obtener el listado del Modelo
        $rol=new RolModel();
        $result=$rol->all();
        //Dar respuesta
        $response->toJSON($result);
    }
    public function get($param){
        $response = new Response();
        $rol=new RolModel();
        $result=$rol->get($param);
       //Dar respuesta
       $response->toJSON($result);
    }
   
}