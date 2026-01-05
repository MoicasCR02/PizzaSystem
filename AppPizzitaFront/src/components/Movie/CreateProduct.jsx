import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { SelectCategory } from "./Form/SelectCategory";
import { FormHelperText } from "@mui/material";
import IngredientService from "../../services/IngredientService";
import { SelectIngredients } from "./Form/SelectIngredients";
import CategoryService from "../../services/CategoryService";
import ProductService from "../../services/ProductService";
import toast from "react-hot-toast";

export function CreateProduct() {
  const navigate = useNavigate();

  // Esquema de validación
  const productSchema = yup.object({
    nombre_producto: yup
      .string()
      .required("El nombre del producto es requerido")
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(100, "El nombre no puede exceder los 100 caracteres"),
    descripcion: yup
      .string()
      .required("La descripción es requerida")
      .min(10, "La descripción debe tener al menos 10 caracteres")
      .max(500, "La descripción no puede exceder los 500 caracteres"),
    precio: yup
      .number()
      .required("El precio es requerido")
      .typeError("El precio debe ser un número válido")
      .positive("El precio debe ser un número positivo")
      .max(100000, "El precio no puede exceder los 100,000")
      .min(100, "El precio debe ser al menos 100 colones"), // Mínimo 100
    id_categoria: yup
      .number()
      .required("La categoría es requerida")
      .typeError("Seleccione una categoría válida")
      .integer("La categoría debe ser un número entero"),
    ingredientes: yup
      .array()
      .of(yup.string().required("Cada ingrediente debe ser un texto válido"))
      .min(1, "Al menos un ingrediente es requerido"),
    imagen: yup.mixed().required("La imagen es requerida"),
  });

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
    resolver: yupResolver(productSchema),
  });

  const [fileName, setFileName] = useState(""); // Estado para el nombre de la imagen
  const [fileURL, setFileURL] = useState(null);
  const handleChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Validar tamaño
      if (file.size > 4 * 1024 * 1024) {
        toast.error("El archivo excede el tamaño máximo de 4 MB");
        return;
      }

      // Validar formato
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error(
          "Formato no permitido. Solo se aceptan imágenes JPG o PNG."
        );
        return;
      }
    }
    if (file) {
      setFileName(file.name); // Guardar solo el nombre del archivo en el estado
      setFileURL(
        URL.createObjectURL(event.target.files[0], event.target.files[0].name)
      );
    }
  };

  // Accion submit
  const onSubmit = (DataForm) => {
    console.log("Formulario:");
    console.log(DataForm);

    // Agregar el nombre del archivo de la imagen al formulario
    const formData = {
      ...DataForm,
      imagen: fileName, // Añadir el nombre de la imagen a los datos del formulario
    };

    // Llamar al API
    try {
      if (productSchema.isValid()) {
        ProductService.createProduct(formData)
          .then((response) => {
            if (response.data != null) {
              toast.success(
                `Producto ingresado #${response.data.id_producto} - ${response.data.nombre_producto}`,
                {
                  duration: 4000,
                  position: "top-center",
                }
              );
              return navigate("/mantainproducts");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Lista de Categorias
  const [dataCategoria, setDataCategoria] = useState({});
  const [loadedCategoria, setLoadedCategoria] = useState(false);
  useEffect(() => {
    CategoryService.getCategory()
      .then((response) => {
        setDataCategoria(response.data);
        setLoadedCategoria(true);
      })
      .catch((error) => {
        console.error(error);
        setLoadedCategoria(false);
      });
  }, []);

  // Lista de Ingredientes
  const [dataIngredients, setDataIngredients] = useState({});
  const [loadedIngredients, setLoadedIngredients] = useState(false);
  useEffect(() => {
    IngredientService.getIngredients()
      .then((response) => {
        setDataIngredients(response.data);
        setLoadedIngredients(true);
      })
      .catch((error) => {
        console.error(error);
        setLoadedIngredients(false);
      });
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={1}>
          <Grid size={12} sm={12}>
            <Typography variant="h5" gutterBottom>
              Crear Producto
            </Typography>
          </Grid>

          {/* Nombre del Producto */}
          <Grid size={12} sm={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="nombre_producto"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="nombre_producto"
                    label="Nombre Producto"
                    error={Boolean(errors.nombre_producto)}
                    helperText={
                      errors.nombre_producto
                        ? errors.nombre_producto.message
                        : " "
                    }
                  />
                )}
              />
            </FormControl>
          </Grid>

          {/* Descripción */}
          <Grid size={12} sm={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="descripcion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="descripcion"
                    label="Descripción"
                    error={Boolean(errors.descripcion)}
                    helperText={
                      errors.descripcion ? errors.descripcion.message : " "
                    }
                  />
                )}
              />
            </FormControl>
          </Grid>

          {/* Precio */}
          <Grid size={12} sm={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="precio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="precio"
                    label="Precio"
                    error={Boolean(errors.precio)}
                    helperText={errors.precio ? errors.precio.message : " "}
                  />
                )}
              />
            </FormControl>
          </Grid>

          {/* Categoría */}
          <Grid size={12} sm={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              {loadedCategoria && (
                <Controller
                  name="id_categoria"
                  control={control}
                  render={({ field }) => (
                    <SelectCategory
                      field={field}
                      data={dataCategoria}
                      error={Boolean(errors.id_categoria)}
                    />
                  )}
                />
              )}
              <FormHelperText sx={{ color: "#d32f2f" }}>
                {errors.id_categoria ? errors.id_categoria.message : " "}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* Ingredientes */}
          <Grid size={12} sm={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              {loadedIngredients && (
                <Controller
                  name="ingredientes"
                  control={control}
                  render={({ field }) => (
                    <SelectIngredients
                      field={field}
                      data={dataIngredients}
                      error={Boolean(errors.ingredientes)}
                    />
                  )}
                />
              )}
              <FormHelperText sx={{ color: "#d32f2f" }}>
                {errors.ingredientes ? errors.ingredientes.message : " "}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* Imagen */}
          <Grid size={12} sm={12}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="imagen"
                control={control}
                render={({ field }) => (
                  <Button variant="outlined" component="label">
                    Cargar Imagen
                    <input
                      type="file"
                      {...field}
                      hidden
                      onChange={(e) => {
                        field.onChange(e); // Esto conecta con el Controller
                        handleChange(e); // Maneja el cambio de archivo
                      }}
                      accept="image/jpeg, image/png, image/jpg" // Restringe formatos desde el input
                    />
                  </Button>
                )}
              />
              <FormHelperText sx={{ color: "#d32f2f" }}>
                {errors.imagen ? errors.imagen.message : " "}
              </FormHelperText>
            </FormControl>
            {/* Muestra el nombre de la imagen seleccionada */}
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
    </>
  );
}
