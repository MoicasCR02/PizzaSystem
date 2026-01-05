import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useParams } from "react-router-dom";
import ComboService from "../../services/ComboService";

export function DetailCombo() {
  const routeParams = useParams();
  const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ComboService.getComboById(routeParams.id)
      .then((response) => {
        setData(response.data);
        setLoaded(true);
      })
      .catch((error) => {
        setError(error.message);
        setLoaded(true);
      });
  }, [routeParams.id]);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Container component="main" sx={{ mt: 8, mb: 2 }}>
      {data && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Box
              component="img"
              sx={{
                borderRadius: "4%",
                maxWidth: "100%",
                height: "auto",
              }}
              alt="Imagen del combo"
              src={`${BASE_URL}/${data.imagen}`}
            />
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography variant="h4" component="h1" gutterBottom>
              {data.nombre_producto}
            </Typography>
            <Typography component="span" variant="subtitle1" display="block">
              <Box fontWeight="bold" display="inline">
                Descripción:
              </Box>{" "}
              {data.descripcion}
            </Typography>

            <Typography
              component="span"
              variant="subtitle1"
              display="block"
              sx={{ mt: 2 }}
            >
              <Box fontWeight="bold" display="inline">
                Productos que lo componen:
              </Box>
              <List sx={{ marginTop: 2 }}>
                {data.productos.map((item, index) => (
                  <ListItem
                    key={index}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <ListItemIcon>
                      <ArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center">
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold", marginRight: 1 }}
                          >
                           {item.cantidad}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ fontStyle: "italic" }}
                          >
                            {item.nombre_producto}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Typography>

            <Typography
              variant="subtitle1"
              component="h3"
              gutterBottom
              sx={{ mt: 3 }}
            >
              Precio: &cent; {data.precio}
            </Typography>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
