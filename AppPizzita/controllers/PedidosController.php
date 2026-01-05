<?php
//localhost:81/apimovie/pedidos
class pedidos
{
    //GET listar
    public function index()
    {
        try {
            $response = new Response();
            //Instancia modelo
            $pedido = new PedidosModel();
            //Método del modelo
            $result = $pedido->all();
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
            $pedido = new PedidosModel();
            //Acción del modelo a ejecutar
            $result = $pedido->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
     //GET Obtener Detalle pedido
     public function getDetallePedido($id)
     {
         try {
             $response = new Response();
             //Instancia del modelo
             $pedido = new PedidosModel();
             //Acción del modelo a ejecutar
             $result = $pedido->getDetallePedido($id);
             //Dar respuesta
             $response->toJSON($result);
         } catch (Exception $e) {
             handleException($e);
         }
     }

     public function getDetallePedidoCocina($id)
     {
         try {
             $response = new Response();
             //Instancia del modelo
             $pedido = new PedidosModel();
             //Acción del modelo a ejecutar
             $result = $pedido->getDetallePedidoCocina($id);
             //Dar respuesta
             $response->toJSON($result);
         } catch (Exception $e) {
             handleException($e);
         }
     }

     //GET Obtener 
     public function getCliente($id)
     {
         try {
             $response = new Response();
             //Instancia del modelo
             $pedido = new PedidosModel();
             //Acción del modelo a ejecutar
             $result = $pedido->getCliente($id);
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
            $pedido = new PedidosModel();
            //Acción del modelo a ejecutar
            $result = $pedido->create($inputJSON);
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