<?php
class ImagenModel
{
    private $upload_path = 'uploads/';
    private $valid_extensions = array('jpeg', 'jpg', 'png', 'gif');

    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    //Subir imagen de una pelicula registrada
    public function uploadFile($object)
    {
        try {
            $file = $object['file'];
            $movie_id = $object['movie_id'];
            //Obtener la información del archivo
            $fileName = $file['name'];
            $tempPath = $file['tmp_name'];
            $fileSize = $file['size'];
            $fileError = $file['error'];

            if (!empty($fileName)) {
                //Crear un nombre único para el archivo
                $fileExt = explode('.', $fileName);
                $fileActExt = strtolower(end($fileExt));
                $fileName = "pizzita-" . uniqid() . "." . $fileActExt;
                //Validar el tipo de archivo
                if (in_array($fileActExt, $this->valid_extensions)) {
                    //Validar que no exista
                    if (!file_exists($this->upload_path . $fileName)) {
                        //Validar que no sobrepase el tamaño
                        if ($fileSize < 2000000 && $fileError == 0) {
                            //Moverlo a la carpeta del servidor del API
                            if (move_uploaded_file($tempPath, $this->upload_path . $fileName)) {
                                //Guardarlo en la BD
                                $sql = "INSERT INTO productos (movie_id,image) VALUES ($movie_id, '$fileName')";
                                $vResultado = $this->enlace->executeSQL_DML($sql);
                                if ($vResultado > 0) {
                                    return 'Imagen creada';
                                }
                                return false;
                            }
                        }
                    }
                }
            }
        } catch (Exception $e) {
            handleException($e);
        }
    }


    //Obtener una imagen de un producto
    public function getImagenProduct($idProduct)
    {
        try {
            
            //Consulta sql
            $vSql = "SELECT imagen FROM productos where id_Producto=$idProduct";

            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            if (!empty($vResultado)) {
                // Retornar el objeto
                return $vResultado[0];
                
            }
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Obtener una imagen de un combo
    public function getImagenCombo($idCombo)
    {
        try {
            
            //Consulta sql
            $vSql = "SELECT imagen FROM combos where id_combo=$idCombo";

            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            if (!empty($vResultado)) {
                // Retornar el objeto
                return $vResultado[0];
                
            }
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    
}
