import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import PedidoService from "../../services/PedidoService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Row,
} from "react-bootstrap";
import { Box, Typography } from "@mui/material";

export default function GestionCocina() {
  const [pedidos, setPedidos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Inicializar Pusher
    const pusher = new Pusher("8f55f30a832a6c715fc7", {
      cluster: "us2",
      encrypted: true,
    });

    const channel = pusher.subscribe("pedidos");

    channel.bind("pedido-creado", (data) => {
      setPedidos((prev) => [data, ...prev]);
      toast.success(`Nuevo pedido de ${data.nombre_usuario} recibido.`);
    });

    // Cargar pedidos iniciales
    PedidoService.getPedidos()
      .then((response) => {
        setPedidos(response.data);
        setLoaded(true);
        setError("");
      })
      .catch((err) => {
        setError(err.message || "Error desconocido");
        setLoaded(false);
      });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const handleDetailClick = (idProducto) => {
    navigate(`/pedidos/gestion/${idProducto}`);
  };

  if (!loaded) return <p>Cargando... no hay datos</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" component="div" sx={{ mb: 2 }}>
        Gestión de la cocina
      </Typography>
      {/* Cards de los pedidos */}
      <Row>
        {pedidos.map((pedido, index) => (
          <Col key={index} sm="12" md="6" lg="4" xl="3" className="mb-4">
            <Card>
              <CardBody>
                <CardTitle tag="h5">Cliente: {pedido.nombre_usuario}</CardTitle>
                <CardText>
                  <strong>Método de Entrega:</strong> {pedido.metodo_entrega}
                </CardText>
                <CardText>
                  <strong>Fecha Pedido:</strong> {pedido.fecha_pedido}
                </CardText>
                <CardText sx={{ backgroundColor: "secondary.main" }}>
                  <Typography sx={{ backgroundColor: "secondary.main" }}>
                    <strong>Estado:</strong> {pedido.descripcion_estado}
                  </Typography>
                </CardText>
                <CardText>
                  <strong>Subtotal:</strong> {pedido.subtotal}
                </CardText>
                <CardText>
                  <strong>Impuesto:</strong> {pedido.impuesto}
                </CardText>
                <CardText>
                  <strong>Total:</strong> {pedido.total_con_impuesto}
                </CardText>
                <Button
                  color="primary"
                  onClick={() => handleDetailClick(pedido.id_pedido)}
                >
                  Preparar Orden
                </Button>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Box>
  );
}
