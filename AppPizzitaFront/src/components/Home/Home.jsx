import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
export function Home() {
  const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";
  return (
    <Container sx={{ p: 4 }} maxWidth="sm">
    {/* Título principal */}
    <Typography
      component="h1"
      variant="h2"
      align="center"
      color="text.primary"
      gutterBottom
      sx={{ fontWeight: "bold" }}
    >
      Pizzita
    </Typography>
    
    {/* Descripción secundaria */}
    <Typography
      variant="h5"
      align="center"
      color="text.secondary"
      paragraph
      sx={{ fontStyle: "italic", mb: 4 }}
    >
      La mejor comida Italiana del país
    </Typography>

    {/* Imagen con animación */}
    <motion.div
      animate={{ y: [0, -20, 0] }}
      transition={{ repeat: Infinity, duration: 3 }}
    >
      <Box
        component="img"
        sx={{
          borderRadius: "8px", // Bordes más redondeados para una mejor estética
          maxWidth: "100%",
          height: "auto",
          boxShadow: 3, // Sombra para darle profundidad
          display: "block", // Asegura que la imagen no se desborde
          margin: "0 auto", // Centra la imagen
        }}
        alt="Pizzita"
        src={`${BASE_URL}/Pizzita.jpg`}
      />
    </motion.div>
  </Container>
  );
}
