import React from "react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

//import ticket from '../../assets/ticket.jpg';

import MenuService from "../../services/MenuService";
import { Card } from "react-bootstrap";
import { Info } from "@mui/icons-material";

export function DetailMenu() {
  const routeParams = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState(true);
  const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";
  const [infoMenu, setinfoMenu] = useState([]);
  const [combos, setCombos] = useState([]);
  //Url para acceder a la imagenes guardadas en el API
  //const BASE_URL = import.meta.env.VITE_BASE_URL+'uploads'
  //Resultado de consumo del API, respuesta
  //Error del API
  const [error, setError] = useState("");
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    //Llamar al API y obtener una pelicula
    MenuService.getMenuById(routeParams.id)
    .then((response) => {
      console.log(response.data);
      setError(response.error);
      setLoaded(true);
      const allCategories = [
        "all", // Agrega la opción "all" al principio
        ...new Set(
          response.data.productos
            .map((item) => item.nombre_categoria) // Mapea las categorías de cada producto
            .filter((nombre_categoria) => nombre_categoria) // Elimina cualquier valor vacío (si es necesario)
        ),
      ];
      setCategories(allCategories); // Establece las categorías únicas

      console.log(allCategories);
      // Actualizar los elementos del menú
      setMenuItems(response.data.productos); // Asigna solo los productos al estado
      setItems(response.data.productos);
      setinfoMenu(response.data);
      setCombos(response.data.combos);
    })
    .catch((err) => {
      console.error(err);
      setError("Error al cargar los datos");
    });
  }, [routeParams.id]);

  
  // Filtrar elementos por categoría
  const filterItems = (nombre_categoria) => {
    if (nombre_categoria === "all") {
      setMenuItems(items);
      return;
    }
    const newItems = items.filter(
      (item) => item.nombre_categoria === nombre_categoria
    );
    setMenuItems(newItems);
  };

  
  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <main>
      <section className="menu section">
        <div className="title">
          <h2>{infoMenu.nombre_menu}</h2>
          <div className="underline"></div>
        </div>
        {/* Botones de categorías */}
        <div className="btn-container">
          {categories.map((category, index) => (
            <button
              type="button"
              className="filter-btn"
              key={index}
              onClick={() => filterItems(category)}
            >
              {category}
            </button>
          ))}
        </div>
        {/* Lista de menú */}
        <div className="section-center">
          {menuItems.map((menuItem) => {
            const {
              id_producto,
              nombre_producto,
              imagen,
              precio,
              descripcion,
            } = menuItem;
            return (
              <article key={id_producto} className="menu-item">
                <img
                  src={`${BASE_URL}/${imagen}`}
                  alt={nombre_producto}
                  className="photo"
                />
                <div className="item-info">
                  <header>
                    <h4>{nombre_producto}</h4>
                    <h4 className="price">${precio}</h4>
                  </header>
                  <p className="item-text">{descripcion}</p>
                </div>
              </article>
            );
          })}
        </div>
        <div className="title">
          <h2>Combos</h2>
          <div className="underline"></div>
        </div>
        {/* Lista de Combos */}
        <div className="section-center">
          {combos.map((combo) => {
            const { id_combo, descripcion, imagen, precio } = combo;
            return (
              <article key={id_combo} className="menu-item">
                <img
                  src={`${BASE_URL}/${imagen}`}
                  alt={descripcion}
                  className="photo"
                />
                <div className="item-info">
                  <header>
                    <h4>{descripcion}</h4>
                    <h4 className="price">${precio}</h4>
                  </header>
                  <Card.Footer className="card-footer">
                    <Link to={`/combos/${id_combo}`}>
                      <Info /> Detalles
                    </Link>
                  </Card.Footer>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
