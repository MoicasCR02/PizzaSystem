import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Typography,
  TextField,
  Button,
  FormControl,
  FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate, useParams } from "react-router-dom";
import ComboService from "../../services/ComboService";
import toast from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ProductService from "../../services/ProductService";

export function UpdateCombo() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const [Error, setError] = useState("");
  const [productos, setProductos] = useState([]); // Lista de productos disponibles
  const [comboProducts, setComboProducts] = useState([]); // Productos ya seleccionados
  const [selectedProduct, setSelectedProduct] = useState(""); // Producto seleccionado
  const [cantidad, setCantidad] = useState(""); // Cantidad del producto

  // Id del combo a editar
  const id_combo = routeParams.id || null;

  // Datos del combo
  const [values, setValores] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [originalFileName, setOriginalFileName] = useState(""); // Estado para el nombre de archivo original
  // URL base del servidor de imágenes
  const BASE_IMAGE_URL = import.meta.env.VITE_BASE_URL + "uploads";
  // Obtener combo desde la API
  useEffect(() => {
    //Llamar al API y obtener un producto
    if (id_combo != undefined && !isNaN(Number(id_combo))) {
      ComboService.getComboById(id_combo)
        .then((response) => {
          console.log(response.data);
          setValores(response.data);
          setComboProducts(response.data.productos);

          if (response.data.imagen) {
            setOriginalFileName(response.data.imagen);
            setPreviewImage(`${BASE_IMAGE_URL}/${response.data.imagen}`);
          }
          setValores(response.data);
        })
        .catch((error) => {
          console.log(error);
          setError(error);
          throw new Error("Respuesta no válida del servidor");
        });
    }
  }, [id_combo]);

  useEffect(() => {
    ProductService.getProducts()
      .then((response) => setProductos(response.data || []))
      .catch((error) => console.error("Error al cargar productos:", error));
  }, []);

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

  // Configuración de react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre_producto: "",
      descripcion: "",
      precio: "",
      id_categoria: "",
      ingredientes: [],
      imagen: "",
    },
    //Precargar
    values,

    resolver: yupResolver(combotSchema),
  });

  // Handle agregar un producto al combo
  const handleAddProduct = () => {
    if (selectedProduct && cantidad) {
      const product = productos.find(
        (prod) => prod.id_producto.toString() === selectedProduct
      );
      if (product) {
        // Agregar el producto al combo
        setComboProducts((prevComboProducts) => [
          ...prevComboProducts,
          { ...product, cantidad: Number(cantidad) },
        ]);

        // Filtrar el producto agregado para eliminarlo de los productos disponibles
        setProductos((prevProductos) =>
          prevProductos.filter(
            (prod) => prod.id_producto !== product.id_producto
          )
        );

        // Limpiar la selección y cantidad
        setSelectedProduct("");
        setCantidad("");
      }
    }
  };

  // Eliminar producto del combo
  const handleRemoveProduct = (id_producto) => {
    const removedProduct = comboProducts.find(
      (prod) => prod.id_producto === id_producto
    );
    if (removedProduct) {
      // Eliminar producto de comboProducts
      setComboProducts((prevComboProducts) =>
        prevComboProducts.filter((prod) => prod.id_producto !== id_producto)
      );

      // Agregar el producto de vuelta a productosDisponibles sin duplicados
      setProductos((prevProductos) => {
        // Verificar si el producto ya existe antes de agregarlo
        if (
          !prevProductos.some(
            (prod) => prod.id_producto === removedProduct.id_producto
          )
        ) {
          return [...prevProductos, removedProduct];
        }
        return prevProductos;
      });
    }
  };

  // Filtrar productos disponibles (productos que no están en comboProducts)
  const productosDisponibles = productos.filter(
    (product) =>
      !comboProducts.some(
        (comboProduct) => comboProduct.id_producto === product.id_producto
      )
  );

  const [fileName, setFileName] = useState(""); // Estado para el nombre de la imagen
  const handleChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : "");

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit del formulario
  const onSubmit = (data) => {
    const formData = {
      ...data,
      imagen: fileName || originalFileName, // Usar el nuevo archivo el el antes precargado
      productos: comboProducts.map((product) => ({
        id_producto: product.id_producto,
        cantidad: product.cantidad,
      })),
    };
    ComboService.updateCombo(formData)
      .then((response) => {
        toast.success(`Combo actualizado: ${response.data.descripcion}`);
        navigate("/mantaincombos");
      })
      .catch((error) => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={1}>
        <Grid size={12} sm={12}>
          <Typography variant="h5" gutterBottom>
            Modificar Combo
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
                helperText={errors.descripcion?.message}
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
                helperText={errors.precio?.message}
              />
            )}
          />
        </Grid>

        {/* Selección de productos */}
        <Grid size={12} sm={6}>
          <Typography variant="h5">Productos</Typography>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              style={{
                flex: 1,
                borderColor: errors.productos ? "red" : "inherit",
              }}
            >
              <option value="">Selecciona un producto</option>
              {productosDisponibles.map((producto) => (
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

          {/* Lista de productos añadidos */}
          <ul>
            {comboProducts.map((product) => (
              <li key={product.id_producto}>
                {product.nombre_producto} --- Cantidad: {product.cantidad}
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
        <Grid
          size={4}
          sm={12}
          container
          justifyContent="center"
          alignItems="center"
        >
          <FormHelperText sx={{ color: "#d32f2f" }}>
            {errors.imagen ? errors.imagen.message : " "}
          </FormHelperText>

          {/* Mostrar la imagen precargada si existe */}
          {previewImage && (
            <Grid item xs={12} sm={4} container justifyContent="center">
              <img
                src={previewImage}
                alt="Imagen del producto"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </Grid>
          )}
        </Grid>

        {/* Botón de cargar imagen */}
        <Grid size={12} sm={4} container justifyContent="center">
          <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ m: 1 }}
            >
              Cargar Imagen
              <input type="file" hidden onChange={handleChange} />
            </Button>
            {fileName && <FormHelperText>{fileName}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid size={12} sm={12}>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            sx={{ m: 1 }}
          >
            Guardar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
