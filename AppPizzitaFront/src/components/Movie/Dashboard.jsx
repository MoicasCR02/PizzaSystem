import React, { useEffect, useState } from "react";
import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
} from "recharts";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";
import ReporteService from "../../services/ReporteService";

const Dashboard = () => {
  const [productosData, setProductosData] = useState([]);
  const [combosData, setCombosData] = useState([]);
  const [enviosData, setEnviosData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosResponse, combosResponse, enviosResponse] =
          await Promise.all([
            ReporteService.VistaProductosMasComprados(),
            ReporteService.VistaCombosMasComprados(),
            ReporteService.VistaCantidadPedidosPorEstado(),
          ]);

        // Verificamos si los datos de productos no están vacíos antes de asignar
        if (productosResponse.data && productosResponse.data.length > 0) {
          setProductosData(
            productosResponse.data.map((item) => ({
              nombreProducto: item.Nombre,
              cantidad: parseInt(item.TotalCantidadVendida, 10),
            }))
          );
        }

        // Verificamos si los datos de combos no están vacíos antes de asignar
        if (combosResponse.data && combosResponse.data.length > 0) {
          setCombosData(
            combosResponse.data.map((item) => ({
              nombreCombo: item.Nombre,
              cantidad: parseInt(item.TotalCantidadVendida, 10),
            }))
          );
        }

        // Verificamos si los datos de envíos no están vacíos antes de asignar
        if (enviosResponse.data && enviosResponse.data.length > 0) {
          setEnviosData(
            enviosResponse.data.map((item) => ({
              nombreEnvio: item.Estado, // Estado del envío
              cantidad: parseInt(item.CantidadPedidos, 10),
            }))
          );
        }
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando datos...
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Reportes de Ventas
      </Typography>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" gutterBottom>
          Productos con mayor cantidad de pedidos
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productosData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombreProducto" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#FF0000" name="Cantidad Vendida" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" gutterBottom>
          Combos con mayor cantidad de pedidos
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={combosData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombreCombo" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#FFA500" name="Cantidad Vendida" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" gutterBottom>
          Pedidos por Estado
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={enviosData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombreEnvio" /> {/* Usamos el estado del pedido */}
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#800080" name="Cantidad de Pedidos" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Container>
  );
};

export default Dashboard;
