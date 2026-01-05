<?php
class menu
{
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $menus = new MenuModel();
            $result = $menus->all();
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
            $menus = new MenuModel();
            $result = $menus->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getMenuDisponible()
    {
        try {
            $response = new Response();
            $menus = new MenuModel();
            $result = $menus->getMenuDisponible();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $menus = new MenuModel();
            //Acción del modelo a ejecutar
            $result = $menus->create($inputJSON);
            //Respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $menus = new MenuModel();
            //Acción del modelo a ejecutar
            $result = $menus->update($inputJSON);
            //Respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
