<?php
//localhost:81/apimovie/producto_proceso_preparacion 
class producto_proceso_preparacion 
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $processtM = new ProcessModel();
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
            $processtM = new ProcessModel();
            //Acción del modelo a ejecutar
            $result = $processtM->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //Sin uso 

    //POST Crear
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $process = new ProcessModel();
            //Acción del modelo a ejecutar
            $result = $process->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //PUT actualizar
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $proceso = new ProcessModel();
            //Acción del modelo a ejecutar
            $result = $proceso->update($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}