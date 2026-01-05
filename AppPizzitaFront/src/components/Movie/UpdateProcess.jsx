import React, { useEffect, useState } from "react";
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

export function UpdateProcess() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";
  const [values, setValores] = useState(null);
  const [dataProducts, setDataProducts] = useState({});
  const [dataProcess, setDataProcess] = useState({});
  const [loadedProcess, setLoadedProcess] = useState(false);
  const [error, setError] = useState("");

  // Hook de formulario
  const {
    control,
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
    resolver: yupResolver(
      yup.object({
        id_producto: yup
          .number()
          .required("La categoría es requerida")
          .typeError("Seleccione una categoría"),
        id_proceso: yup
          .array()
          .min(1, "Debe seleccionar al menos un proceso")
          .required("El proceso es requerido"),
        orden_estacion: yup.array().min(1, "El orden estación es requerido"),
      })
    ),
  });

  // Cargar datos de productos y procesos
  useEffect(() => {
    if (routeParams.id) {
      ProductService.getProductById(routeParams.id)
        .then((response) => {
          setDataProducts(response.data);
          setValue("id_producto", response.data.id_producto);
        })
        .catch((error) => {
          console.error(error);
          setError(error);
        });
    }

    if (routeParams.id && !isNaN(Number(routeParams.id))) {
      ProcessService.getProcessById(routeParams.id)
        .then((response) => {
          setValores(response.data);
          const idsProceso = response.data.map((item) => item.id_proceso);
          setValue("id_proceso", idsProceso);
          const ordenes = idsProceso.map((_, index) => index + 1);
          setValue("orden_estacion", ordenes);
        })
        .catch((error) => {
          console.log(error);
          setError(error);
        });
    }
  }, [routeParams.id]);

  // Cargar lista de procesos
  useEffect(() => {
    ProcesosPreparacionService.getProcessP()
      .then((response) => {
        setDataProcess(response.data);
        setLoadedProcess(true);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
        setLoadedProcess(false);
      });
  }, []);

  // Observar cambios en id_proceso
  const selectedProcesses = watch("id_proceso");

  useEffect(() => {
    if (selectedProcesses && selectedProcesses.length > 0) {
      const orden_estacion = selectedProcesses.map((_, index) => index + 1);
      setValue("orden_estacion", orden_estacion, { shouldValidate: true });
    }
  }, [selectedProcesses, setValue]);

  // Acción de submit
  const onSubmit = (data) => {
    const formattedData = {
      id_producto: String(data.id_producto),
      id_proceso: data.id_proceso.map((id) => parseInt(id, 10)),
      orden_estacion: data.orden_estacion,
    };

    console.log("Datos que se enviarán:", formattedData);

    ProcessService.updateProcess(formattedData)
      .then((response) => {
        if (response.data) {
          console.log("Datos:", response.data);
          toast.success(`Proceso Actualizado`, {
            duration: 4000,
            position: "top-center",
          });
          navigate("/mantainprocess");
        }
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.error(error);
          setError("Respuesta no válida del servidor");
        }
      });
  };

  // Mostrar errores en caso de haber
  if (error) return <p>Error: {error.message}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Crear Procesos
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
            {dataProducts && (
              <Grid container spacing={2}>
                <Grid item xs={5}>
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
                <Grid item xs={7}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {dataProducts.nombre_producto}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={4}>
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
                    value={field.value}
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
                  label="Orden Estación"
                  value={watch("orden_estacion").join(", ")}
                  disabled
                  helperText={
                    errors.orden_estacion ? errors.orden_estacion.message : " "
                  }
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="secondary" sx={{ m: 1 }}>
            Guardar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
