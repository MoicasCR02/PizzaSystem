<?php
//localhost:81/apimovie/producto_proceso_preparacion 
class proceso_preparacion 
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $processtM = new ProcesosPreparacionModel();
            //Método del modelo
            $result = $processtM->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //GET Obtener 
    public function get($id)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $processtM = new ProcesosPreparacionModel();
            //Acción del modelo a ejecutar
            $result = $processtM->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}