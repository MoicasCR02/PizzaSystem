<?php 
//Cargar todos los paquetes
require_once "vendor/autoload.php";
use Firebase\JWT\JWT;

class usuarios{

    //Listar en el API
    public function index(){
        $response = new Response();
        //Obtener el listado del Modelo
        $usuario=new UserModel();
        $result=$usuario->all();
        //Dar respuesta
        $response->toJSON($result);
    }
    public function get($param){
        $response = new Response();
        $usuario=new UserModel();
        $result=$usuario->get($param);
       //Dar respuesta
       $response->toJSON($result);
    }
    public function getAllClientes(){
        $response = new Response();
        //Obtener el listado del Modelo
        $usuario=new UserModel();
        $result=$usuario->getAllClientes();
        //Dar respuesta
        $response->toJSON($result);
    }
    public function customerbyShopRental($idShopRental){
        $response = new Response();
        //Obtener el listado del Modelo
        $usuario=new UserModel();
        $result=$usuario->customerbyShopRental($idShopRental);
        //Dar respuesta
        $response->toJSON($result);
    }
    public function login(){ 
        $response = new Response();  
        $request = new Request();
        //Obtener json enviado
        $inputJSON = $request->getJSON(); 
        $usuario=new UserModel();
        $result=$usuario->login($inputJSON);
        if(isset($result) && !empty($result) && $result!=false){
            $response->toJSON($result);
        }else{
            $response->toJSON($response,"Usuario no valido");
        }
    }
    public function create( ){
        $response = new Response();
        $request = new Request();
        //Obtener json enviado
        $inputJSON = $request->getJSON();  
        $usuario=new UserModel();
        $result=$usuario->create($inputJSON);
       //Dar respuesta
       $response->toJSON($result);
    }
   
}