import React from "react";
import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { Box, FormHelperText, TextField } from "@mui/material";
import toast from "react-hot-toast";
import ProcessService from "../../services/ProcessService";
import ProductService from "../../services/ProductService";
import ProcesosPreparacionService from "../../services/ProcesosPreparacionService";
import { SelectProcess } from "./Form/SelectProcesos";
import { Controller, useForm } from "react-hook-form";


export function CreateProcess() {
  const navigate = useNavigate();
  const routeParams = useParams();
  console.log(routeParams);
  const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";

  // Esquema de validación
  const ProcessSchema = yup.object({
    id_producto: yup
      .number()
      .required("La categoría es requerida")
      .typeError("Seleccione una categoría"),
    id_proceso: yup.array().min(1, "El prodcuto es requerido"),
    orden_estacion: yup.array().min(1, "El prodcuto es requerido"),
  });
  const {
    control, //register
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id_producto: "",
      id_proceso: [],
      orden_estacion: [],
    },
    // Asignación de validaciones
    resolver: yupResolver(ProcessSchema),
  });

  //Gestión de errores
  const [error, setError] = useState("");
  // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e);
  // Accion submit
  const onSubmit = (DataForm) => {
    // Formatear datos en el orden deseado
    const formattedData = {
      id_producto: String(DataForm.id_producto),
      id_proceso: DataForm.id_proceso.map((id) => parseInt(id, 10)),
      orden_estacion: DataForm.orden_estacion, 
    };
    console.log("Formulario:");
    console.log(formattedData);
    console.log("Datos que se enviarán:", JSON.stringify(formattedData, null, 2));
    //Llamar al API
    try {
      if (ProcessSchema.isValid()) {
        //Crear pelicula
        ProcessService.createProcess(formattedData)
          .then((response) => {
            setError(response.error);
            //Respuesta al usuario
            if (response.data != null) {
              toast.success(`Proceso creado #${response.data.id_proceso}`, {
                duration: 4000,
                position: "top-center",
              });
              //Redirección tabla de peliculas
              return navigate("/mantainprocess");
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
    } catch (error) {
      console.error(error);
    }
  };

  //Lista de Productos
  const [dataProducts, setDataProducts] = useState({});
  useEffect(() => {
    if (routeParams.id) {
      ProductService.getProductById(routeParams.id)
        .then((response) => {
          console.log(response);
          setDataProducts(response.data);
          // Asignar el valor precargado al formulario
          setValue("id_producto", response.data.id_producto);
        })
        .catch((error) => {
          console.error(error);
          setError(error);
        });
    }
  }, [routeParams.id, setValue]);
  //Lista de Procesos
  const [dataProcess, setDataProcess] = useState({});
  const [loadedProcess, setLoadedProcess] = useState(false);
  useEffect(() => {
    ProcesosPreparacionService.getProcessP()
      .then((response) => {
        console.log(response);
        setDataProcess(response.data);
        setLoadedProcess(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          setLoadedProcess(false);
          throw new Error("Respuesta no válida del servidor");
        }
      });
  }, []);

  // Observa cambios en id_proceso y actualiza orden_preparacion
  const selectedProcesses = watch("id_proceso");
  useEffect(() => {
    // Genera un array de ordenes [1, 2, 3, ...] con la longitud de id_proceso
    const orden_estacion = selectedProcesses.map((_, index) => index + 1);
    setValue("orden_estacion", orden_estacion);
  }, [selectedProcesses, setValue]);

  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={1}>
          <Grid size={12} sm={12}>
            <Typography variant="h5" gutterBottom>
              Crear Procesos
            </Typography>
          </Grid>
          <Grid size={4} sm={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
            {dataProducts && (
        <Grid container spacing={2}>
          <Grid size={5}>
            <Box
              component="img"
              sx={{
                borderRadius: "4%",
                maxWidth: "100%",
                height: "auto",
              }}
              alt="Imagen"
              src={`${BASE_URL}/${dataProducts.imagen}`}
            />
          </Grid>
          <Grid size={7}>
            <Typography variant="h4" component="h1" gutterBottom>
              {dataProducts.nombre_producto}
            </Typography>
          </Grid>
        </Grid>
      )}
            </FormControl>
          </Grid>
          <Grid size={4} sm={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              {loadedProcess && (
                <Controller
                  name="id_proceso"
                  control={control}
                  render={({ field }) => (
                    <SelectProcess
                      field={field}
                      data={dataProcess}
                      error={Boolean(errors.id_proceso)}
                    />
                  )}
                />
              )}
              <FormHelperText sx={{ color: "#d32f2f" }}>
                {errors.id_proceso ? errors.id_proceso.message : " "}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="orden_estacion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="orden_estacion"
                    label="orden_estacion"
                    value={selectedProcesses
                      .map((_, index) => index + 1)
                      .join(", ")}
                    disabled
                    helperText={
                      errors.orden_estacion
                        ? errors.orden_estacion.message
                        : " "
                    }
                  />
                )}
              />
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
    </>
  );
}
