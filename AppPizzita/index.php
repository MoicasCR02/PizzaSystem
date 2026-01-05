<?php
// Composer autoloader
require_once 'vendor/autoload.php';
/*Encabezada de las solicitudes*/
/*CORS*/
header("Access-Control-Allow-Origin: * ");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header('Content-Type: application/json');

/*--- Requerimientos Clases o librerías*/
require_once "controllers/core/Config.php";
require_once "controllers/core/HandleException.php";
require_once "controllers/core/Logger.php";
require_once "controllers/core/MySqlConnect.php";
require_once "controllers/core/Request.php";
require_once "controllers/core/Response.php";

/***--- Agregar todos los modelos*/

//Pizzita required
require_once "models/ProductModel.php";
require_once "models/IngredientModel.php";
require_once "models/CategoryModel.php";
require_once "models/ProcessModel.php";
require_once "models/CombosModel.php";
require_once "models/MenuModel.php";
require_once "models/ImagenModel.php";
require_once "models/ProcesosPreparacionModel.php";
require_once "models/PedidosModel.php";
require_once "models/UserModel.php";
require_once "models/RolModel.php";
require_once "models/ReporteModel.php";

//Middleware
require_once "middleware/AuthMiddleware.php";


//Pizzita required controlers
require_once "controllers/ProductController.php";
require_once "controllers/IngredientController.php";
require_once "controllers/CategoryController.php";
require_once "controllers/ProcessController.php";
require_once "controllers/CombosController.php";
require_once "controllers/MenuController.php";
require_once "controllers/ProcesosPreparacionController.php";
require_once "controllers/PedidosController.php";
require_once "controllers/UserController.php";
require_once "controllers/RolController.php";
require_once "controllers/ReporteController.php";
//Requiere de Pusher

//Enrutador
require_once "routes/RoutesController.php";
$index = new RoutesController();
$index->index();


