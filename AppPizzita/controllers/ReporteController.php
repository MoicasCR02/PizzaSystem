<?php
class reportes
{
    //Productos
    public function VistaProductosMasComprados()
    {
        try {
            $response = new Response();
            $reporte = new ReporteModel();
            $result = $reporte->VistaProductosMasComprados();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function VistaProductosMenosComprados()
    {
        try {
            $response = new Response();
            $reporte = new ReporteModel();
            $result = $reporte->VistaProductosMenosComprados();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }


    //Combos
    public function VistaCombosMasComprados()
    {
        try {
            $response = new Response();
            $reporte = new ReporteModel();
            $result = $reporte->VistaCombosMasComprados();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function VistaCombosMenosComprados()
    {
        try {
            $response = new Response();
            $reporte = new ReporteModel();
            $result = $reporte->VistaCombosMenosComprados();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //Pedidos 
    public function VistaCantidadPedidosPorEstado()
    {
        try {
            $response = new Response();
            $reporte = new ReporteModel();
            $result = $reporte->VistaCantidadPedidosPorEstado();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

}