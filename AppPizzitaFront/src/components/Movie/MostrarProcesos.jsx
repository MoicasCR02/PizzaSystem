import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card"; // Importar Card de Bootstrap
import { Link } from "react-router-dom";
import { Info } from "@mui/icons-material";
import "../../themes/estilos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductService from "../../services/ProductService";

export function ListCardProcesoCreate() {
  // Url para acceder a las imágenes guardadas en el API
  const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";
  //Resultado de consumo del API, respuesta
  const [data, setData] = useState(null);
  //Error del API
  const [error, setError] = useState("");
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    ProductService.getProductsProcesos()
      .then((response) => {
        const data = response.data;
        if (data === "" || (Array.isArray(data) && data.length === 0)) {
          setData([]);
          setError("No hay productos disponibles.");
        } else {
          setData(data);
        }
        setLoaded(true);
      })
      .catch((error) => {
        console.error("Error al obtener productos:", error);
        setError("Error al cargar productos.");
        setLoaded(false);
      });
  }, []);

  if (error) {
    return (
      <div className="container">
        <p className="text-center text-danger">
          Todos los productos ya tienen procesos de preparacion...
        </p>
      </div>
    );
  } else {
    if (!loaded) return <p>Cargando..</p>;
    if (error) return <p>Error: {error.message}</p>;
  }

  return (
    <div className="container">
      <div className="row">
        {data &&
          data.map((item) => (
            <div
              className="col-lg-3 col-md-4 col-sm-6 mb-4"
              key={item.id_producto}
            >
              <Card className="hover-float" style={{ height: "100%" }}>
                {" "}
                {/* Establecer altura fija */}
                <Card.Img
                  variant="top"
                  src={`${BASE_URL}/${item.imagen.imagen}`}
                  alt={item.nombre_producto}
                  style={{ objectFit: "cover", height: "200px" }} // Ajusta la altura de la imagen
                />
                <Card.Body className="d-flex flex-column">
                  {" "}
                  {/* Flex para asegurar el contenido se ajuste */}
                  <Card.Title className="text-center flex-grow-1">
                    {item.nombre_producto}
                  </Card.Title>
                  <Card.Text className="text-center">
                    {item.descripcion}
                  </Card.Text>
                  <Card.Footer className="align-items-center">
                    <Link
                      to={`/producto_proceso_preparacion/${item.id_producto}`}
                      className="btn"
                    >
                      <Info /> Crear Procesos
                    </Link>
                  </Card.Footer>
                </Card.Body>
              </Card>
            </div>
          ))}
      </div>
    </div>
  );
}
