import React, { useContext, useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import Button from "@mui/material/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Cart } from "./Cart";
import { format, parse } from "date-fns";
import { useCart } from "../../hook/useCart";
import UserService from "../../services/UserService";
import PropTypes from "prop-types";
import PedidoService from "../../services/PedidoService";
import { UserContext } from "../../contexts/UserContext";
import { FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";

// Definición de los tipos de props
CreatePedido.propTypes = {
  item: PropTypes.object,
  removeItem: PropTypes.func,
};

export function CreatePedido() {
  const navigate = useNavigate();
  const { cart, cleanCart, getTotal, getSubTotal, getImpuestos } = useCart();
  const { user, decodeToken } = useContext(UserContext);
  const [userData, setUserData] = useState(decodeToken());
  useEffect(() => {
    setUserData(decodeToken());
  }, [user]);
  // Obtener fecha actual en formato dd/MM/yyyy
  const currentDate = format(new Date(), "dd/MM/yyyy");

  // Esquema de validación
  const PedidosSchema = yup.object({
    customer_id: yup
      .number()
      .typeError("Seleccione un cliente")
      .required("El cliente es requerido"),
    fecha: yup
      .string()
      .required("Especifique una fecha")
      .matches(
        /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})$/,
        "Formato día/mes/año dd/mm/yyyy"
      )
      .test(
        "is-future-date",
        "La fecha no puede ser menor a la actual",
        (value) => {
          const inputDate = parse(value, "dd/MM/yyyy", new Date());
          const today = parse(currentDate, "dd/MM/yyyy", new Date());
          return inputDate >= today;
        }
      ),
  });

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      shop_id: "",
      shop_name: "",
      customer_id: "",
      fecha: currentDate,
      movies: cart,
      total: 0,
    },
    resolver: yupResolver(PedidosSchema),
  });

  const [error, setError] = useState("");
  const onError = (errors, e) => console.log(errors, e);

  const onSubmit = (data) => {
    console.log(data);
  };

  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    UserService.getUserById(userData.id_usuario)
      .then((response) => {
        setData(response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          setError(error);
          setLoaded(false);
        }
      });
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [metodo_pago, setMetodoPago] = useState("tarjeta");
  const [metodo_entrega, setMetodoEntrega] = useState("Domicilio");
  const [direccion, setDireccion] = useState("");
  const [montoPago, setMontoPago] = useState("");
  const [total, setTotal] = useState(0);
  const [mensajeVuelto, setMensajeVuelto] = useState("");

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleMetodoEntregaChange = (e) => {
    setMetodoEntrega(e.target.value);
    setMensajeVuelto("");
    setMontoPago(0);
    const envio = e.target.value === "Domicilio" ? 2500 : 0;
    setTotal(getTotal(cart) + envio);
  };

  const handleMontoPagoChange = (e) => {
    const monto = parseFloat(e.target.value);
    setMontoPago(monto);

    if (monto >= total) {
      setMensajeVuelto(`Su vuelto es: ${(monto - total).toFixed(2)} colones.`);
    } else {
      setMensajeVuelto("Hace falta dinero.");
    }
  };

  const handleConfirmar = () => {
    if (metodo_entrega === "Domicilio" && !direccion) {
      alert("Por favor, ingrese una dirección válida.");
      return;
    }
    try {
      if (PedidosSchema.isValid()) {
        // Obtener la fecha del formulario y formatearla
        const fecha = getValues("fecha"); // Obtener la fecha ingresada desde el formulario
        const [day, month, year] = fecha.split("/");
        const dateFormatDB = `${year}-${month}-${day}`; // Formato adecuado para la base de datos
        // Crear el objeto con la estructura de pagos
        const pagosData = {
          metodo_pago: metodo_pago,
          vuelto:
            metodo_pago === "efectivo" && montoPago >= total
              ? Math.floor(montoPago - total)
              : 0, // Redondear el vuelto a un entero
          costo_envio: metodo_entrega === "Domicilio" ? 2500 : 0,
          direccion_entrega: metodo_entrega === "Domicilio" ? direccion : "",
          fecha_pago: dateFormatDB,
        };

        const pedidoData = {
          metodo_entrega: metodo_entrega,
          // Si es encargado, se asigna el cliente del select, si no, se asigna el cliente como id_usuario
          id_cliente: userData.rol.nombre === "Encargado" ? getValues("customer_id") : data.id_usuario,
          // Si es encargado, se asigna su propio id_usuario como id_encargado, si no, se asigna null
          id_encargado: userData.rol.nombre === "Encargado" ? data.id_usuario : null,
          fecha_pedido: dateFormatDB,
          id_estado: 1, // Por defecto está en preparación
        };

        const detallePedidoData = {
          subtotal: getSubTotal(cart),
          impuesto: getImpuestos(cart),
          total_con_impuesto: total,
        };

        // Crear el detalle de productos
        const detallePedidoProductoData = cart
          .filter((item) => item.tipo === "producto") // Filtrar solo productos
          .map((item) => ({
            id_producto: item.id_producto,
            cantidad: item.cantidad,
          }));

        // Crear el detalle de combos
        const detallePedidoComboData = cart
          .filter((item) => item.tipo === "combo") // Filtrar solo combos
          .map((item) => ({
            id_combo: item.id_combo,
            cantidad: item.cantidad,
          }));

        //Todos los datos
        // Crear el objeto JSON unificado
        const datosCompletos = {
          pagos: pagosData,
          pedido: pedidoData,
          detalle_pedido: detallePedidoData,
          detalle_pedido_productos: detallePedidoProductoData,
          detalle_pedido_combos: detallePedidoComboData,
        };
        // Imprimir los datos
        console.log(datosCompletos);
        PedidoService.createPedido(datosCompletos)
          .then((response) => {
            setError(response.error);
            //Respuesta al usuario de creación
            if (response.data != null) {
              //{id, shop_id, customer_id, rental_date, total, movies}
              toast.success(`Pedido realizado`, {
                duration: 4000,
                position: "top-center",
              });
              cleanCart();
              localStorage.clear();
              // Redireccion a la tabla
              toggleModal();
              return navigate("/productos");
            }
          })
          .catch((error) => {
            if (error instanceof SyntaxError) {
              console.log(error);
              setError(error);
              throw new Error("Respuesta no válida del servidor");
            }
          });
      }
    } catch (e) {
      //Error
      console.error(e);
    }
  };

  useEffect(() => {
    const envio = metodo_entrega === "Domicilio" ? 2500 : 0;
    setTotal(getTotal(cart) + envio);
  }, [cart, metodo_entrega, getTotal]);

  // Asegúrate de que este estado se maneje correctamente
  const [clientes, setClientes] = useState([]);
  useEffect(() => {
    // Si el usuario es encargado, obtenemos los clientes

    UserService.getAllClientes() // Este servicio debe obtener los clientes
      .then((response) => setClientes(response.data))
      .catch((error) => console.error("Error al cargar clientes", error));
  }, [userData]);

  if (!loaded) return <p>Cargando..</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={1}>
          <Grid size={12} sm={12}>
            <Typography variant="h5" gutterBottom>
              Carrito
            </Typography>
          </Grid>
          <Grid size={12} sm={6}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="fecha"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Fecha"
                    error={Boolean(errors.fecha)}
                    helperText={errors.fecha ? errors.fecha.message : " "}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12} sm={6}>
            <div className="col-12 mb-4">
              <div className="col-12 text-center mb-4">
                <p className="h4">
                  Bienvenido a tu carrito,{" "}
                  <strong>{data.nombre_usuario}</strong>
                </p>
              </div>
            </div>
          </Grid>
          <Grid fullWidth>
          {userData.rol.nombre === "Encargado" && (
          <Grid item xs={12} sm={6} fullWidth>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel id="customer_id">Cliente</InputLabel>
              <Controller
                name="customer_id"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="customer_id"
                    label="Cliente"
                    fullWidth
                    error={Boolean(errors.customer_id)}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  >
                    {clientes.map((cliente) => (
                      <MenuItem key={cliente.id_usuario} value={cliente.id_usuario}>
                        {cliente.nombre_usuario}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>{errors.customer_id?.message}</FormHelperText>
            </FormControl>
          </Grid>
        )}
          </Grid>
          
          <Grid size={12} sm={8}>
            <Typography variant="h5" gutterBottom>
              Productos
            </Typography>
            <Cart />
          </Grid>
          <Grid size={12} sm={12}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ m: 0 }}
              onClick={toggleModal}
            >
              Pagar
            </Button>
          </Grid>
          <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
            <ModalHeader
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
              }}
              toggle={toggleModal}
            >
              <p color="black">Resumen del Pedido</p>
            </ModalHeader>
            <ModalBody>
              <FormGroup style={{ color: "rgba(0, 0, 0)" }}>
                <Cart />
              </FormGroup>
              <FormGroup style={{ color: "rgba(0, 0, 0)" }}>
                <Label for="metodoPago">Método de Pago</Label>
                <Input
                  type="select"
                  id="metodoPago"
                  value={metodo_pago}
                  onChange={(e) => {
                    setMetodoPago(e.target.value);
                    setMontoPago("");
                    setMensajeVuelto("");
                  }}
                >
                  <option value="tarjeta">Tarjeta</option>
                  <option value="efectivo">Efectivo</option>
                </Input>
              </FormGroup>
              {metodo_pago === "efectivo" && (
                <>
                  <FormGroup style={{ color: "rgba(0, 0, 0)" }}>
                    <Label for="pagoEfectivo">¿Con cuánto va a pagar?</Label>
                    <Input
                      type="number"
                      id="pagoEfectivo"
                      placeholder="Ingrese el monto"
                      value={montoPago}
                      onChange={handleMontoPagoChange}
                    />
                  </FormGroup>
                </>
              )}
              <FormGroup style={{ color: "rgba(0, 0, 0)" }}>
                <Label for="metodoEntrega">Método de Entrega</Label>
                <Input
                  type="select"
                  id="metodoEntrega"
                  value={metodo_entrega}
                  onChange={handleMetodoEntregaChange}
                >
                  <option value="Domicilio">Domicilio</option>
                  <option value="Recoger">Recojo en tienda</option>
                </Input>
              </FormGroup>
              {metodo_entrega === "Domicilio" && (
                <FormGroup style={{ color: "rgba(0, 0, 0)" }}>
                  <Label for="direccion">Dirección de entrega</Label>
                  <Input
                    type="text"
                    id="direccion"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Ingrese su dirección"
                  />
                </FormGroup>
              )}
              <p style={{ color: "rgba(0, 0, 0)" }}>
                <strong>Total: </strong>
                {total} colones{" "}
                {metodo_entrega === "Domicilio" && <span>+ Envío (2500)</span>}
              </p>
              <p style={{ color: "rgba(0, 0, 0)" }}>{mensajeVuelto}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggleModal}>
                Cerrar
              </Button>
              <Button color="primary" onClick={handleConfirmar}>
                Confirmar
              </Button>
            </ModalFooter>
          </Modal>
        </Grid>
      </form>
    </>
  );
}
