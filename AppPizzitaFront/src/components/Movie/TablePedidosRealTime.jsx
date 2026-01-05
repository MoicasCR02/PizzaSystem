/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
  Checkbox,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import Pusher from "pusher-js";
import PedidoService from "../../services/PedidoService";
import { useNavigate } from "react-router-dom";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedArray = array.map((el, index) => [el, index]);
  stabilizedArray.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedArray.map((el) => el[0]);
}

const headCells = [
  { id: "nombre_usuario", numeric: false, disablePadding: true, label: "Cliente" },
  { id: "metodo_entrega", numeric: false, disablePadding: false, label: "Método Entrega" },
  { id: "fecha_pedido", numeric: false, disablePadding: false, label: "Fecha Pedido" },
  { id: "descripcion_estado", numeric: false, disablePadding: false, label: "Estado" },
  { id: "subtotal", numeric: true, disablePadding: false, label: "Subtotal" },
  { id: "impuesto", numeric: true, disablePadding: false, label: "Impuesto" },
  { id: "total_con_impuesto", numeric: true, disablePadding: false, label: "Total" },
  { id: "acciones", numeric: false, disablePadding: false, label: "Acciones" },
];

function TableProductsHead({ order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id && (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              )}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

TableProductsHead.propTypes = {
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

export default function TablePedidosRealTime() {
  const [pedidos, setPedidos] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("nombre_usuario");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Aquí usas el hook useNavigate
  
  useEffect(() => {
    const pusher = new Pusher("06dabb1b02b492196f2e", {
      cluster: "us2",
      encrypted: true,
    });

    const channel = pusher.subscribe("pedidos");
    channel.bind("pedido-creado", (data) => {
      // Solo agregar el pedido nuevo al estado sin llamar a la API
      setPedidos((prevPedidos) => [data, ...prevPedidos]); // Agregar el nuevo pedido al inicio de la lista
    });

    PedidoService.getPedidos()
      .then((response) => {
        const pedidosFiltrados = response.data.filter(
          (pedido) => pedido.descripcion_estado !== "En Preparacion"
        );
        setPedidos(pedidosFiltrados);
        setLoaded(true);
        setError("");
      })
      .catch((err) => {
        setError(err.message || "Error desconocido");
        setLoaded(false);
      });

    return () => {
      pusher.unsubscribe("pedidos");
    };
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredPedidos = pedidos.filter((pedido) => {
    const pedidoDate = dayjs(pedido.fecha_pedido);
    const isAfterStartDate = startDate
      ? pedidoDate.isAfter(dayjs(startDate).startOf("day"))
      : true;
    const isBeforeEndDate = endDate
      ? pedidoDate.isBefore(dayjs(endDate).endOf("day"))
      : true;
    return isAfterStartDate && isBeforeEndDate;
  });
  const handleDetailClick = (idProducto) => {
    navigate(`/pedidos/detailpedido/${idProducto}`);
  };


  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" component="div" sx={{ mb: 2 }}>
        Pedidos en preparación
      </Typography>
      <Paper sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", gap: 2, p: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha inicio"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="Fecha fin"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>
        <TableContainer>
          <Table aria-labelledby="tableTitle" size="medium">
            <TableProductsHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(filteredPedidos, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.nombre_usuario}</TableCell>
                    <TableCell>{row.metodo_entrega}</TableCell>
                    <TableCell>{row.fecha_pedido}</TableCell>
                    <TableCell>{row.descripcion_estado}</TableCell>
                    <TableCell align="right">{row.subtotal}</TableCell>
                    <TableCell align="right">{row.impuesto}</TableCell>
                    <TableCell align="right">{row.total_con_impuesto}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleDetailClick(row.id_pedido)}
                      >
                        Detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPedidos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
