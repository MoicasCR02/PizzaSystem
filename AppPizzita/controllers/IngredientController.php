<?php
class ingredientes
{
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $ingredientes = new IngredientModel();
            $result = $ingredientes->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function get($param)
    {
        try {
            $response = new Response();
            $ingredientes = new IngredientModel();
            $result = $ingredientes->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function getIngredientProduct($id)
    {
        try {
            $response = new Response();
            $ingredientes = new IngredientModel();
            $result = $ingredientes->getIngredientProduct($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
