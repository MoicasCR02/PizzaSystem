import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PedidoService from "../../services/PedidoService";
import { useParams } from "react-router-dom";

export default function DetallePedido() {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [productos, setProductos] = useState([]);
  const [combos, setCombos] = useState([]);
  const routeParams = useParams();
  console.log("Este es el id" + routeParams.id);

  useEffect(() => {
    PedidoService.getDetallePedidoID(routeParams.id)
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

  const {
    nombre_usuario,
    descripcion_estado,
    encargado,
    metodo_pago,
    vuelto,
    costo_envio,
    fecha_pago,
    subtotal,
    impuesto,
    total_con_impuesto,
  } = data;

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box sx={{ padding: 2 }}>
      {/* Encabezado de la factura */}
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Factura
        </Typography>
        <Typography variant="subtitle1">Cliente: {nombre_usuario}</Typography>
        <Typography variant="subtitle1">Encargado: {encargado}</Typography>
        <Typography variant="body2">Método de Pago: {metodo_pago}</Typography>
        <Typography variant="body2">
          Vuelto: ₡{parseFloat(vuelto).toFixed(2)}
        </Typography>
        <Typography variant="body2">
          Costo de Envío: ₡{parseFloat(costo_envio).toFixed(2)}
        </Typography>
        <Typography variant="body2">Fecha de Pago: {fecha_pago}</Typography>
        <Typography variant="body2">Estado: {descripcion_estado}</Typography>
      </Paper>

      {/* Tabla de productos y combos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead fullWidth>
            <TableRow>
              <TableCell
                align="left"
                colSpan={6}
                sx={{ fontWeight: "bold", backgroundColor: "secondary.main" }}
              >
                Detalles del Pedido
              </TableCell>
            </TableRow>
            <TableRow style={{ backgroundColor: "black" }} fullWidth>
              <TableCell>Descripción</TableCell>
              <TableCell align="right">Cantidad</TableCell>
              <TableCell align="right">Precio Unitario</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="right">Impuestos</TableCell>
              <TableCell align="right">Total con Impuestos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Encabezado para Productos */}
            {productos.length > 0 && (
              <>
                <TableRow sx={{ fontWeight: "bold", backgroundColor: "primary.main" }}>
                  <TableCell
                    colSpan={6}
                    align="left"
                    style={{ fontWeight: "bold" }}
                  >
                    Productos
                  </TableCell>
                </TableRow>
                {productos
                  .filter((producto) => producto.id_producto !== null)
                  .map((producto) => (
                    <TableRow key={producto.id_producto}>
                      <TableCell>{producto.nombre_producto}</TableCell>
                      <TableCell align="right">
                        {producto.cantidad_producto}
                      </TableCell>
                      <TableCell align="right">
                        ₡{producto.precio_unitario}
                      </TableCell>
                      <TableCell align="right">
                        ₡{parseFloat(producto.precio_producto).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        ₡{parseFloat(producto.impuestos).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        ₡{parseFloat(producto.total_con_impuestos).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            )}

            {/* Encabezado para Combos */}
            {combos.length > 0 && (
              <>
                <TableRow sx={{ fontWeight: "bold", backgroundColor: "primary.main"}}>
                  <TableCell
                    colSpan={6}
                    align="left"
                    style={{ fontWeight: "bold" }}
                  >
                    Combos
                  </TableCell>
                </TableRow>
                {combos
                  .filter((combo) => combo.id_combo !== null)
                  .map((combo) => (
                    <TableRow key={combo.id_combo}>
                      <TableCell>{combo.descripcion}</TableCell>
                      <TableCell align="right">
                        {combo.cantidad_combo}
                      </TableCell>
                      <TableCell align="right">
                        ₡{combo.precio_unitario}
                      </TableCell>
                      <TableCell align="right">
                        ₡{parseFloat(combo.precio_combo).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        ₡{parseFloat(combo.impuestos).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        ₡{parseFloat(combo.total_con_impuestos).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            )}
          </TableBody>
          <TableHead>
            <TableRow>
              <TableCell colSpan={5} align="right" sx={{ fontWeight: "bold" }}>
                Subtotal
              </TableCell>
              <TableCell align="right" sx={{ backgroundColor: "primary.main" }}>
                ₡{parseFloat(subtotal).toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={5} align="right" sx={{ fontWeight: "bold" }}>
                Impuestos
              </TableCell>
              <TableCell align="right" sx={{ backgroundColor: "primary.main" }}>
                ₡{parseFloat(impuesto).toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={5} align="right" sx={{ fontWeight: "bold" }}>
                Total + Envio
              </TableCell>
              <TableCell align="right" sx={{ backgroundColor: "primary.main" }}>
                ₡{parseFloat(total_con_impuesto).toFixed(2)}
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    </Box>
  );
}
