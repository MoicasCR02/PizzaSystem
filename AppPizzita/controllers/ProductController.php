<?php
//localhost:81/apimovie/productos
class productos
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $productM = new ProductModel;
            //Método del modelo
            $result = $productM->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //Obtener Productos sin procesos
    public function allProcess()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $productM = new ProductModel;
            //Método del modelo
            $result = $productM->allProcess();
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
            $productM = new ProductModel();
            //Acción del modelo a ejecutar
            $result = $productM->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    //POST Crear
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $product = new ProductModel();
            //Acción del modelo a ejecutar
            $result = $product->create($inputJSON);
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
            $product = new ProductModel();
            //Acción del modelo a ejecutar
            $result = $product->update($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}