import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { useCart } from "../../hook/useCart";
import { getImpuestos, getSubTotal } from "../../reducers/cart";
CartItem.propTypes = {
  item: PropTypes.object,
  removeItem: PropTypes.func,
};
//Estilo de Tabla
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  [`&.${tableCellClasses.footer}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 16,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function CartItem({ item, removeItem }) {
  // Registra la información del producto en la consola
  return (
    <StyledTableRow key={item.id_producto}>
      <StyledTableCell component="th" scope="row">
        {item.tipo === "producto" ? item.nombre_producto : item.descripcion}
      </StyledTableCell>
      <StyledTableCell>&cent;{item.precio}</StyledTableCell>{" "}
      {/* Muestra el precio */}
      <StyledTableCell>{item.cantidad}</StyledTableCell>{" "}
      {/* Muestra la cantidad */}
      <StyledTableCell>&cent;{item.subtotal}</StyledTableCell>{" "}
      {/* Muestra el total con impuesto */}
      <StyledTableCell>&cent;{item.impuesto}</StyledTableCell>{" "}
      {/* Muestra el subtotal */}
      <StyledTableCell>&cent;{item.totalconImpuestoP}</StyledTableCell>{" "}
      {/* Muestra el subtotal */}
      <StyledTableCell align="right">
        <Tooltip title={"Borrar " + item.nombre_producto}>
          <IconButton
            color="warning"
            onClick={() => removeItem(item)}
            aria-label={"Borrar " + item.nombre_producto}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </StyledTableCell>
    </StyledTableRow>
  );
}

//Detalle Compra
export function Cart() {
  const { cart, removeItem, cleanCart, getTotal} = useCart(); // Extrae las funciones del carrito
  // Registra la información del producto en la consola
  console.log("Información del Carrito:", cart);
  return (
    <>
      <Tooltip title="Eliminar Alquiler">
        <IconButton
          color="error"
          onClick={cleanCart} // Elimina todo el carrito
          aria-label="Eliminar"
        >
          <RemoveShoppingCartIcon />
        </IconButton>
      </Tooltip>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Producto</StyledTableCell>{" "}
              {/* Nombre del producto */}
              <StyledTableCell>Precio</StyledTableCell> {/* Precio */}
              <StyledTableCell>Cantidad</StyledTableCell> {/* Cantidad */}
              <StyledTableCell>Subtotal</StyledTableCell> {/* Subtotal */}
              <StyledTableCell>Impuesto</StyledTableCell> {/* Impuesto */}
              <StyledTableCell>Total</StyledTableCell>{" "}
              {/* Total con impuesto */}
              <StyledTableCell align="right">Acciones</StyledTableCell>{" "}
              {/* Acciones */}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(cart) && cart.length > 0 ? (
              cart.map((row) => (
                <CartItem
                  key={row.id}
                  item={row}
                  removeItem={() => {
                    // Aquí detectamos si es un producto o un combo
                    const itemId = row.id_producto
                      ? row.id_producto
                      : row.id_combo; // ID correspondiente
                    const itemType = row.id_producto ? "producto" : "combo"; // Tipo correspondiente

                    // Llamamos a la función removeItem pasando el id y tipo correspondientes
                    removeItem({ id: itemId, tipo: itemType });
                  }} // Función para eliminar el item
                />
              ))
            ) : (
              <p>No hay productos en el carrito.</p>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <StyledTableCell colSpan={2} align="right">
                <Typography variant="subtitle1" gutterBottom>
                  Subtotal
                </Typography>
              </StyledTableCell>
              <StyledTableCell colSpan={1}>
                <Typography variant="subtitle1" gutterBottom>
                  &cent;{getSubTotal(cart)} {/* Muestra el total del carrito */}
                </Typography>
              </StyledTableCell>
              <StyledTableCell colSpan={1} align="right">
                <Typography variant="subtitle1" gutterBottom>
                  Impuestos
                </Typography>
              </StyledTableCell>
              <StyledTableCell colSpan={1}>
                <Typography variant="subtitle1" gutterBottom>
                  &cent;{getImpuestos(cart)}{" "}
                  {/* Muestra el total del carrito */}
                </Typography>
              </StyledTableCell>
              <StyledTableCell colSpan={1} align="right">
                <Typography variant="subtitle1" gutterBottom>
                  Total
                </Typography>
              </StyledTableCell>
              <StyledTableCell colSpan={1}>
                <Typography variant="subtitle1" gutterBottom>
                  &cent;{getTotal(cart)} {/* Muestra el total del carrito */}
                </Typography>
              </StyledTableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}
