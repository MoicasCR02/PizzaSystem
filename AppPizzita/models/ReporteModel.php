<?php
class ReporteModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    //Productos mas comprados
    public function VistaProductosMasComprados(){
        try {
            
            $vSql = "SELECT * FROM vistaproductomascomprado";
			$vResultado = $this->enlace->ExecuteSQL($vSql);	
			return $vResultado;
		} catch (Exception $e) {
            handleException($e);
        }
    }

    //Producto menos comprados
    public function VistaProductosMenosComprados(){
        try {
            
            $vSql = "SELECT * FROM vistaproductosmenoscomprados";
			$vResultado = $this->enlace->ExecuteSQL($vSql);	
			return $vResultado;
		} catch (Exception $e) {
            handleException($e);
        }
    }

    //Combos mas comprados
    public function VistaCombosMasComprados(){
        try {
            
            $vSql = "SELECT * FROM vistacombomascomprado";
			$vResultado = $this->enlace->ExecuteSQL($vSql);	
			return $vResultado;
		} catch (Exception $e) {
            handleException($e);
        }
    }

    //Combos menos comprados
    public function VistaCombosMenosComprados(){
        try {
            
            $vSql = "SELECT * FROM vistacombosmenoscomprados";
			$vResultado = $this->enlace->ExecuteSQL($vSql);	
			return $vResultado;
		} catch (Exception $e) {
            handleException($e);
        }
    }

    //Pedidos
    public function VistaCantidadPedidosPorEstado(){
        try {
            
            $vSql = "SELECT * FROM vistacantidadpedidosporestado";
			$vResultado = $this->enlace->ExecuteSQL($vSql);	
			return $vResultado;
		} catch (Exception $e) {
            handleException($e);
        }
    }

    

}