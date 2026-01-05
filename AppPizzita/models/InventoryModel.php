<?php
class InventoryModel
{
    public $enlace;
    public function __construct()
    {

        $this->enlace = new MySqlConnect();
    }
    public function all()
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM inventory;";

            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);

            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }

    public function get($idMovie,$idShopRental)
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM inventory where movie_id=$idMovie and shop_id=$idShopRental";

            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado[0];
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }
    public function getInventoryMovie($idMovie)
    {
        try {
            $vResultado = null;
            if (!empty($idRentalShop)) {
                //Consulta sql
                $vSql = "SELECT i.shop_id, s.name,i.price
                    FROM inventory i,movie m, shop_rental s
                    where i.shop_id=s.id 
                and i.movie_id=$idMovie";

                //Ejecutar la consulta
                $vResultado = $this->enlace->ExecuteSQL($vSql);
            }
            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }
    public function getInvetoryShop($idRentalShop)
    {
        try {
            $vResultado = null;
            if (!empty($idRentalShop)) {
                $vSql = "SELECT i.movie_id, m.title,i.price
                        FROM inventory i,movie m, shop_rental s
                        where i.movie_id=m.id 
                        and i.shop_id=$idRentalShop";
                $vResultado = $this->enlace->ExecuteSQL($vSql);
            }
            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }
}
