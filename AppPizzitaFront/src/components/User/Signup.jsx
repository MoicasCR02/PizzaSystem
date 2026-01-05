/* eslint-disable no-unused-vars */
import React from "react";
import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import UserService from "../../services/UserService";
import { yupResolver } from "@hookform/resolvers/yup";

export function Signup() {
  const navigate = useNavigate();
  // Esquema de validación
  const loginSchema = yup.object({
    nombre_usuario: yup
      .string()
      .required("El nombre es requerido")
      .matches(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        "El nombre solo puede contener letras y espacios"
      )
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(50, "El nombre no debe exceder los 50 caracteres"),

    email: yup
      .string()
      .required("El email es requerido")
      .email("El formato del email no es válido")
      .max(100, "El email no debe exceder los 100 caracteres"),

    password: yup
      .string()
      .required("El password es requerido")
      .min(8, "El password debe tener al menos 8 caracteres")
      .max(50, "El password no debe exceder los 50 caracteres")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "El password debe incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (@, $, !, %, *, ?, &)"
      ),

    telefono: yup
      .string()
      .required("El teléfono es requerido")
      .matches(
        /^(\+?[\d\s]{7,15})$/,
        "El teléfono debe tener entre 7 y 15 dígitos, con un prefijo internacional opcional (+)"
      ),

    id_rol: yup
      .number()
      .required("El rol es requerido")
      .positive("El rol debe ser un número positivo")
      .integer("El rol debe ser un número entero"),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    // Valores iniciales
    defaultValues: {
      nombre_usario: "",
      email: "",
      password: "",
      telefono: "",
      id_rol: 2,
    },
    // Asignación de validaciones
    resolver: yupResolver(loginSchema),
  });

  const [error, setError] = useState(null);
  const notify = () =>
    toast.success("Usuario registrado", {
      duration: 4000,
      position: "top-center",
    });
  // Accion submit
  const onSubmit = (DataForm) => {
    const DataFormatted = () => {
      return {
        nombre_usuario: DataForm.nombre_usuario,
        email: DataForm.email,
        password: DataForm.password,
        fecha_registro: new Date().toISOString().split("T")[0], // Fecha actual en formato YYYY-MM-DD
        telefono: DataForm.telefono,
        id_rol: DataForm.id_rol,
      };
    };
    try {
      console.log(DataFormatted());
      //Registrar usuario
      //Asignar por defector rol
      setValue("id_rol", 2);
      UserService.createUser(DataFormatted())
        .then((response) => {
          console.log(response);
          notify();
          return navigate("/user/login/");
        })
        .catch((error) => {
          if (error instanceof SyntaxError) {
            console.log(error);
            setError(error);
            throw new Error("Respuesta no válida del servidor");
          }
        });
    } catch (e) {
      // handle your error
    }
  };

  // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e);

  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={1}>
          <Grid size={12} sm={12}>
            <Typography variant="h5" gutterBottom>
              Registrar Usuario
            </Typography>
          </Grid>
          <Grid size={12} sm={12}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="nombre_usuario"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="nombre_usuario"
                    label="Nombre"
                    error={Boolean(errors.nombre_usuario)}
                    helperText={
                      errors.nombre_usuario ? errors.nombre_usuario.message : " "
                    }
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12} sm={6}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="email"
                    label="Email"
                    error={Boolean(errors.email)}
                    helperText={errors.email ? errors.email.message : " "}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12} sm={12}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="telefono"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="telefono"
                    label="Telefono"
                    error={Boolean(errors.telefono)}
                    helperText={errors.telefono ? errors.telefono.message : " "}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12} sm={6}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="password"
                    label="Password"
                    type="password"
                    error={Boolean(errors.password)}
                    helperText={errors.password ? errors.password.message : " "}
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
              Login
            </Button>
          </Grid>
        </Grid>
        {/* Sing up lindo */}
        
      </form>
      
    </>
  );
}
