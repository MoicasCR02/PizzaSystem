<?php
class categorias
{
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $category = new CategoryModel();
            $result = $category->all();
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
            $category = new CategoryModel();
            $result = $category->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function getCategoryProduct($id)
    {
        try {
            $response = new Response();
            $category = new CategoryModel();
            $result = $category->getCategoryProduct($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //sin uso
    public function getMoviesbyGenre($param)
    {
        try {
            $response = new Response();
            $genero = new GenreModel();
            $result = $genero->getMoviesbyGenre($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
