import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import ProductService from "../../services/ProductService";
import toast from "react-hot-toast";
import ComboService from "../../services/ComboService";
import { Controller, useForm } from "react-hook-form";
import { FormHelperText } from "@mui/material";

export function CreateCombo() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [comboProducts, setComboProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileURL, setFileURL] = useState(null);

  // Esquema de validación
  const combotSchema = yup.object({
    descripcion: yup.string().required("La descripción es requerida"),
    precio: yup.string().required("El precio es requerido"),
    productos: yup.array().of(
      yup.object().shape({
        id_producto: yup.number().required("El producto es requerido"),
        cantidad: yup
          .number()
          .typeError("La cantidad debe ser un número")
          .required("La cantidad es requerida")
          .min(1, "La cantidad debe ser al menos 1"),
      })
    ),
    imagen: yup
      .mixed()
      .required("La imagen es requerida")
      .test(
        "fileSelected",
        "Debes seleccionar una imagen",
        (value) => value && value.length > 0
      ),
  });

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      descripcion: "",
      precio: "",
      imagen: "",
    },
    resolver: yupResolver(combotSchema),
  });

  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileURL(URL.createObjectURL(file));
    }
  };

  const onSubmit = (DataForm) => {
    // Verificar si comboProducts contiene datos
    if (comboProducts.length === 0) {
      setError("productos", {
        type: "manual",
        message: "Debe agregar al menos un producto al combo",
      });
      return; // Detener la ejecución del envío
    }

    const formData = {
      ...DataForm,
      imagen: fileName,
      productos: comboProducts.map((product) => ({
        id_producto: product.id_producto,
        cantidad: product.cantidad,
      })),
    };

    // Enviar datos al backend
    ComboService.createCombo(formData)
      .then((response) => {
        toast.success(
          `Combo ingresado #${response.data.id_combo} - ${response.data.descripcion}`,
          { duration: 4000, position: "top-center" }
        );
        navigate("/mantaincombos");
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    ProductService.getProducts()
      .then((response) => setProductos(response.data || []))
      .catch((error) => console.error("Error al cargar productos:", error));
  }, []);

  const handleAddProduct = () => {
    if (selectedProduct && cantidad) {
      const product = productos.find(
        (prod) => prod.id_producto.toString() === selectedProduct
      );
      if (product) {
        // Agregar el producto al combo
        setComboProducts([
          ...comboProducts,
          {
            id_producto: product.id_producto,
            nombre_producto: product.nombre_producto,
            cantidad: Number(cantidad),
          },
        ]);

        // Limpiar el error si se agrega un producto
        clearErrors("productos");

        // Actualizar la lista de productos disponibles
        setProductos(
          productos.filter((prod) => prod.id_producto !== product.id_producto)
        );
        setSelectedProduct("");
        setCantidad("");
      }
    }
  };

  const handleRemoveProduct = (id_producto) => {
    const removedProduct = comboProducts.find(
      (product) => product.id_producto === id_producto
    );
    if (removedProduct) {
      setComboProducts(
        comboProducts.filter((product) => product.id_producto !== id_producto)
      );
      setProductos([...productos, removedProduct]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={1}>
        <Grid size={12} sm={12}>
          <Typography variant="h5" gutterBottom>
            Crear Combo
          </Typography>
        </Grid>

        {/* Descripción */}
        <Grid size={12} sm={4}>
          <Controller
            name="descripcion"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                sx={{ m: 1 }}
                {...field}
                label="Descripción"
                error={Boolean(errors.descripcion)}
                helperText={errors.descripcion?.message || " "}
              />
            )}
          />
        </Grid>

        {/* Precio */}
        <Grid size={12} sm={4}>
          <Controller
            name="precio"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                sx={{ m: 1 }}
                {...field}
                label="Precio"
                error={Boolean(errors.precio)}
                helperText={errors.precio?.message || " "}
              />
            )}
          />
        </Grid>

        {/* Productos */}
        <Grid size={12} sm={6}>
          <Typography variant="h5">Productos</Typography>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              style={{flex: 1, borderColor: errors.productos ? "red" : "inherit"}}
            >
              <option value="">Selecciona un producto</option>
              {productos.map((producto) => (
                <option key={producto.id_producto} value={producto.id_producto}>
                  {producto.nombre_producto}
                </option>
              ))}
            </select>
            <TextField
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              label="Cantidad"
            />
            <Button
              variant="contained"
              onClick={handleAddProduct}
              disabled={!selectedProduct || !cantidad}
            >
              Agregar
            </Button>
          </div>
          <ul>
            {comboProducts.map((product) => (
              <li key={product.id_producto}>
                {`${product.nombre_producto} --- Cantidad: ${product.cantidad}`}
                <Button
                  variant="outlined"
                  onClick={() => handleRemoveProduct(product.id_producto)}
                >
                  Eliminar
                </Button>
              </li>
            ))}
          </ul>
          {/* Mostrar error de productos */}
          {errors.productos && (
            <Typography color="error">{errors.productos.message}</Typography>
          )}
        </Grid>

        {/* Imagen */}
        <Grid size={12} sm={12}>
          <Controller
            name="imagen"
            control={control}
            render={({ field }) => (
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ m: 1 }}
              >
                Cargar Imagen
                <input
                  type="file"
                  {...field}
                  hidden
                  onChange={(e) => {
                    field.onChange(e);
                    handleChange(e);
                  }}
                />
              </Button>
            )}
          />
          <FormHelperText sx={{ color: "#d32f2f" }}>
            {errors.imagen ? errors.imagen.message : " "}
          </FormHelperText>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{ minHeight: "300px" }}
          >
            {fileURL && <img src={fileURL} alt="Preview" width="300" />}
          </Grid>
          
        </Grid>

        <Grid size={12} sm={12}>
          <Button type="submit" variant="contained" color="secondary">
            Guardar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
