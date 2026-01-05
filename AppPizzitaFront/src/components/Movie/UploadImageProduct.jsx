import React from "react";
import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { InputLabel } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import { MenuItem } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ImageService from "../../services/ImageService";
import ProductService from "../../services/ProductService";

export function UploadImageProduct() {
  const navigate = useNavigate();
  let formData = new FormData();
  // Esquema de validación
  const movieSchema = yup.object({
    id_producto: yup
      .number()
      .typeError("Seleccione una pelicula")
      .required("La pelicula es requerida"),
  });
  const {
    control, //register
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id_producto: "",
      image: "",
    },
    // Asignación de validaciones
    resolver: yupResolver(movieSchema),
  });

  const [error, setError] = useState("");
  // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e);
  //Lista de peliculas
  const [dataProduct, setDataMovie] = useState({});
  const [loadedMovie, setLoadedMovie] = useState(false);
  useEffect(() => {
    ProductService.getProducts()
      .then((response) => {
        console.log(response);
        setDataMovie(response.data);
        setLoadedMovie(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          setLoadedMovie(false);
          throw new Error("Respuesta no válida del servidor");
        }
      });
  }, []);
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  function handleChange(e) {
    if (e.target.files) {
      setFileURL(
        URL.createObjectURL(e.target.files[0], e.target.files[0].name)
      );
      setFile(e.target.files[0], e.target.files[0].name);
    }
  }

  // Accion submit
  const onSubmit = (DataForm) => {
    console.log("Formulario:");
    console.log(DataForm);

    try {
      if (movieSchema.isValid()) {
        // Creamos un FormData para enviar el archivo

        formData.append("file", file); //Imagen
        formData.append("id_producto", DataForm.id_producto);
        //Subir imagen para pelicula
        ImageService.createImage(formData)
          .then((response) => {
            console.log(response);
            setError(response.error);
            //Respuesta al usuario de creación
            if (response.data != null) {
              toast.success(response.data, {
                duration: 4000,
                position: "top-center",
              });
              // Redireccion a la tabla
              return navigate("/movie-table");
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
      console.error(e);
    }
  };

  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={1}>
          <Grid size={12} sm={12}>
            <Typography variant="h5" gutterBottom>
              Imagénes Producto
            </Typography>
          </Grid>

          <Grid size={12} sm={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              {/* Lista de peliculas */}
              {loadedMovie && (
                <Controller
                  name="id_producto"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel id="id_producto">Producto</InputLabel>
                      <Select
                        {...field}
                        labelId="id_producto"
                        label="Producto"
                        value={field.value}
                      >
                        {dataProduct &&
                          dataProduct.map((id_producto) => (
                            <MenuItem key={id_producto.id_id_producto} value={id_producto.id_producto}>
                              {id_producto.nombre_producto}
                            </MenuItem>
                          ))}
                      </Select>
                    </>
                  )}
                />
              )}
              <FormHelperText sx={{ color: "#d32f2f" }}>
                {errors.id_producto ? errors.id_producto.message : " "}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={12} sm={12}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <input type="file" {...field} onChange={handleChange} />
                )}
              />
              <FormHelperText sx={{ color: "#d32f2f" }}>
                {errors.image ? errors.image.message : " "}
              </FormHelperText>
            </FormControl>
            <img src={fileURL} width={300} />
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
