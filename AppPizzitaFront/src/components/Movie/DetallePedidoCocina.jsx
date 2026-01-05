import React, { useEffect, useState } from "react";
import PedidoService from "../../services/PedidoService";
import { useParams } from "react-router-dom";
import { Box, Paper, Typography } from "@mui/material";
import { Card, CardBody, CardText, CardTitle, Col, Row } from "react-bootstrap";

export default function DetallePedidoCocina() {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [productos, setProductos] = useState([]);
  const [combos, setCombos] = useState([]);
  const routeParams = useParams();
  const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";
  console.log("Este es el id" + routeParams.id);

  useEffect(() => {
    PedidoService.getDetallePedidoIDCocina(routeParams.id)
      .then((response) => {
        if (response.data) {
          setData(response.data);
          setProductos(response.data.productos || []); // Asignar un array vacío si no existen productos
          setCombos(response.data.combos || []); // Asignar un array vacío si no existen combos
          setLoaded(true);
        } else {
          setError("No se encontraron datos para este pedido.");
        }
      })
      .catch((error) => {
        console.error("Error al cargar pedidos:", error);
        setError("Error al cargar los pedidos.");
      });
  }, [routeParams.id]);

  const { nombre_usuario, descripcion_estado } = data;

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box sx={{ padding: 2 }}>
      {/* Encabezado de la factura */}
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Desglose de los productos del pedido
        </Typography>
        <Typography variant="subtitle1">Cliente: {nombre_usuario}</Typography>
        <Typography variant="body2">Estado: {descripcion_estado}</Typography>
      </Paper>

      {/* Sección de Productos */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Productos
      </Typography>
      <Row>
        {productos.length > 0 ? (
          productos
            .filter((producto) => producto.id_producto !== null) // Filtramos los productos con id_producto != null
            .map((producto) => (
              <Col
                key={producto.id_producto}
                sm="12"
                md="6"
                lg="4"
                xl="3"
                className="mb-4"
              >
                <Card>
                  <CardBody>
                    <CardTitle>{producto.nombre_producto}</CardTitle>
                    <Card.Img
                      variant="top"
                      src={`${BASE_URL}/${producto.imagen}`}
                      alt={producto.nombre_producto}
                      style={{ objectFit: "cover", height: "200px" }}
                    />
                    <CardText>
                      <strong>Cantidad:</strong> {producto.cantidad_producto}
                    </CardText>
                  </CardBody>
                </Card>
              </Col>
            ))
        ) : (
          <Typography>No se encontraron productos para este pedido.</Typography>
        )}
      </Row>

      {/* Sección de Combos */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Combos
      </Typography>
      <Row>
        {combos.length > 0 ? (
          combos
            .filter((combo) => combo.id_combo !== null) // Filtramos los combos con id_combo != null
            .map((combo) => (
              <Col
                key={combo.id_combo}
                sm="12"
                md="6"
                lg="4"
                xl="3"
                className="mb-4"
              >
                <Card>
                  <CardBody>
                    <CardTitle>{combo.descripcion}</CardTitle>
                    <Card.Img
                      variant="top"
                      src={`${BASE_URL}/${combo.imagen}`}
                      alt={combo.descripcion}
                      style={{ objectFit: "cover", height: "200px" }}
                    />
                    <CardText>
                      <strong>Cantidad:</strong> {combo.cantidad_combo}
                    </CardText>

                    {/* Recorrido de productos dentro de cada combo */}
                    {combo.productos && combo.productos.length > 0 ? (
                      <div>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ mt: 2 }}
                        >
                          Productos en este combo:
                        </Typography>
                        {combo.productos.map((producto) => (
                          <CardText key={producto.id_producto}>
                            <strong>{producto.nombre_producto}</strong> -{" "}
                            {producto.cantidad} unidades
                            <Card.Img
                              variant="top"
                              src={`${BASE_URL}/${producto.imagen}`}
                              alt={producto.nombre_producto}
                              style={{ objectFit: "cover", height: "200px" }}
                            />
                          </CardText>
                        ))}
                      </div>
                    ) : (
                      <CardText>No hay productos en este combo.</CardText>
                    )}
                  </CardBody>
                </Card>
              </Col>
            ))
        ) : (
          <Typography>No se encontraron combos para este pedido.</Typography>
        )}
      </Row>
    </Box>
  );
}
