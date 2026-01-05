import React, { useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import Tooltip from "@mui/material/Tooltip";
import "../../themes/estilos.css";
import { useCart } from "../../hook/useCart";
import { UserContext } from "../../contexts/UserContext";
//import { motion } from "framer-motion";

export default function Header() {
  //Obtener Informacion del usuario
  const { user, decodeToken, autorize } = useContext(UserContext);
  const [userData, setUserData] = useState(decodeToken());
  useEffect(() => {
    setUserData(decodeToken());
  }, [user]);

  const { cart, getCountItems } = useCart();
  //Gestión menu usuario
  const [anchorElUser, setAnchorEl] = React.useState(null);
  //Gestión menu opciones
  const [mobileOpcionesAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  //Booleano Menu opciones responsivo
  const isMobileOpcionesMenuOpen = Boolean(mobileOpcionesAnchorEl);
  //Gestión menu principal
  const [anchorElPrincipal, setAnchorElPrincipal] = React.useState(null);
  //Abierto menu usuario
  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  //Cerrado menu usuario
  const handleUserMenuClose = () => {
    setAnchorEl(null);
    handleOpcionesMenuClose();
  };
  //Abierto menu principal
  const handleOpenPrincipalMenu = (event) => {
    setAnchorElPrincipal(event.currentTarget);
  };
  //Cerrado menu principal
  const handleClosePrincipalMenu = () => {
    setAnchorElPrincipal(null);
  };
  //Abierto menu opciones
  const handleOpcionesMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  //Cerrado menu opciones
  const handleOpcionesMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  // Nueva gestión del submenú de Mantenimientos
  const [anchorElMantenimientos, setAnchorElMantenimientos] =
    React.useState(null);
  const handleOpenMantenimientosMenu = (event) => {
    setAnchorElMantenimientos(event.currentTarget);
  };
  const handleCloseMantenimientosMenu = () => {
    setAnchorElMantenimientos(null);
  };

  //Lista enlaces menu usuario
  const userItems = [
    {name: "Login", link: "/user/login", login: false, roles: ["Administrador", "Cliente"]},
    {name: "Registrarse", link: "/user/create", login: false, roles: ["Administrador", "Cliente"],},
    {name: "Historial de pedidos", link: "/historialpedidos", login: true, roles: ["Cliente"],},
    {name: "Todos los pedidos", link: "/todospedidos", login: true, roles: ["Administrador","Encargado"],},
    {name: "Pedidos en preparacion", link: "/pedidosrealtime", login: true, roles: ["Administrador"],},
    {name: "Logout", link: "/user/logout", login: true, roles: ["Administrador", "Cliente", "Cocina"],},
    {name: "Usuarios registrados", link: "/user/registrados", login: true, roles: ["Administrador"],},
    {name: "Registrar un usuario", link: "/user/createuser", login: true, roles: ["Administrador"],},
  ];
  //Lista enlaces menu principal
  const navItems = [
    {
      name: "Productos",
      link: "/productos",
      roles: ["Administrador", "Cliente","Encargado"],
    },
    {
      name: "Combos Disponibles",
      link: "/combos",
      roles: ["Administrador", "Cliente","Encargado"],
    },
    {
      name: "Menu Disponibles",
      link: "/menu",
      roles: ["Administrador", "Cliente","Encargado"],
    },
    {
      name: "Procesos de preparación de los productos",
      link: "/process",
      roles: ["Administrador", "Cliente","Encargado"],
    },
    { name: "Mantenimientos", roles: ["Administrador"] },
    {
      name: "Menu disponible",
      link: "/menudisponible",
      roles: ["Administrador", "Cliente","Encargado"],
    },
    {
      name: "Gestion de Cocina",
      link: "/cocina",
      roles: ["Cocina"],
    },
    {
      name: "Dashboard",
      link: "/dashboard",
      roles: ["Encargado", "Administrador"],
    },
  ];

  // Lista específica de Mantenimientos
  const mantenimientosItems = [
    { name: "Mantenimiento Productos", link: "/mantainproducts" },
    { name: "Mantenimiento Procesos de Preparación", link: "/mantainprocess" },
    { name: "Mantenimiento Menús", link: "/mantainmenu" },
    { name: "Mantenimiento Combos", link: "/mantaincombos" },
  ];

  //Menu de mantenimientos
  // Menú de Mantenimientos
  const mantenimientosMenu = (
    <Menu
      anchorEl={anchorElMantenimientos}
      open={Boolean(anchorElMantenimientos)}
      onClose={handleCloseMantenimientosMenu}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      {mantenimientosItems.map((item, index) => (
        <MenuItem
          key={index}
          component={Link}
          to={item.link}
          onClick={handleCloseMantenimientosMenu}
        >
          <Typography sx={{ textAlign: "center" }}>{item.name}</Typography>
        </MenuItem>
      ))}
    </Menu>
  );

  //Identificador menu principal
  const menuIdPrincipal = "menu-appbar";
  //Menu Principal
  const menuPrincipal = (
    <Box
      sx={{
        flexGrow: 1,
        display: { xs: "none", sm: "flex" },
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {navItems
        .filter((item) => !item.name.startsWith("Mantenimientos")) // Excluir mantenimientos
        .map(
          (item, index) =>
            userData &&
            item.roles &&
            autorize({ requiredRoles: item.roles }) ? (
              <Button
                key={index}
                component={Link}
                to={item.link}
                color="secondary"
                className="navbar-item"
              >
                <Typography textAlign="center">{item.name}</Typography>
              </Button>
            ) : null // No renderizar nada si no pasa la autorización
        )}

      {/* Verificar si el usuario tiene acceso para mostrar el botón de Mantenimientos */}
      {userData && autorize({ requiredRoles: ["Administrador", "Encargado"] }) && (
        <Button
          color="secondary"
          onClick={handleOpenMantenimientosMenu}
          className="navbar-item"
        >
          <Typography textAlign="center">Mantenimientos</Typography>
        </Button>
      )}
      {mantenimientosMenu}
    </Box>
  );

  //Menu Principal responsivo
  const menuPrincipalMobile = navItems
    .filter((item) => !item.name.startsWith("Mantenimiento"))
    .map((page, index) => (
      <MenuItem key={index} component={Link} to={page.link}>
        <Typography sx={{ textAlign: "center" }}>{page.name}</Typography>
      </MenuItem>
    ));

  // Agregar el submenú móvil
  menuPrincipalMobile.push(
    <MenuItem key="mantenimientos" onClick={handleOpenMantenimientosMenu}>
      <Typography sx={{ textAlign: "center" }}>Mantenimientos</Typography>
    </MenuItem>
  );
  menuPrincipalMobile.push(mantenimientosMenu);

  //Identificador menu usuario
  const userMenuId = "user-menu";
  //Menu Usuario
  const userMenu = (
    <Box sx={{ flexGrow: 1 }}>
      <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-controls={userMenuId}
        aria-haspopup="true"
        onClick={handleUserMenuOpen}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>

      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleUserMenuClose}
      >
        <MenuItem>
          <Typography variant="subtitle1" gutterBottom>
            {userData?.email}
          </Typography>
        </MenuItem>
        {userItems.map((setting, index) => {
          // Si el elemento requiere que el usuario esté logueado y tiene el rol adecuado
          if (
            setting.login &&
            userData &&
            Object.keys(userData).length > 0 &&
            autorize({ requiredRoles: setting.roles })
          ) {
            return (
              <MenuItem key={index} component={Link} to={setting.link}>
                <Typography sx={{ textAlign: "center" }}>
                  {setting.name}
                </Typography>
              </MenuItem>
            );
          }
          // Si el elemento no requiere login, se muestra cuando el usuario no está logueado
          else if (!setting.login && Object.keys(userData).length === 0) {
            return (
              <MenuItem key={index} component={Link} to={setting.link}>
                <Typography sx={{ textAlign: "center" }}>
                  {setting.name}
                </Typography>
              </MenuItem>
            );
          }
          // Si el elemento no requiere login pero el usuario está logueado, puedes mostrarlo también si lo deseas
          else if (setting.login && Object.keys(userData).length === 0) {
            return null; // No mostrar nada
          }
          // Si el usuario está logueado pero no tiene el rol adecuado
          else if (
            setting.login &&
            userData &&
            Object.keys(userData).length > 0 &&
            !autorize({ requiredRoles: setting.roles })
          ) {
            return null; // No mostrar nada
          }
        })}
      </Menu>
    </Box>
  );
  //Identificador menu opciones
  const menuOpcionesId = "badge-menu-mobile";
  //Menu opciones responsivo
  const menuOpcionesMobile = (
    <Menu
      anchorEl={mobileOpcionesAnchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuOpcionesId}
      keepMounted
      open={isMobileOpcionesMenuOpen}
      onClose={handleOpcionesMenuClose}
    >
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge
            badgeContent={getCountItems(cart)}
            color="primary"
            component={Link}
            to="/pedido/crear/"
          >
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Compras</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notificaciones</p>
      </MenuItem>
    </Menu>
  );

  const boxEmptyForSmallScreens = (
    <Box sx={{ display: { xs: "block", md: "none" }, flexGrow: 1 }} />
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        color="primaryLight"
        sx={{ backgroundColor: "primaryLight.main" }}
      >
        <Toolbar>
          <IconButton
            size="large"
            color="inherit"
            aria-controls={menuIdPrincipal}
            aria-haspopup="true"
            sx={{ mr: 2 }}
            onClick={handleOpenPrincipalMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id={menuIdPrincipal}
            anchorEl={anchorElPrincipal}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElPrincipal)}
            onClose={handleClosePrincipalMenu}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            {menuPrincipalMobile}
          </Menu>
          {/* Enlace página inicio */}
          <Tooltip title="Pizita">
            <IconButton
              size="large"
              edge="end"
              component="a"
              href="/"
              aria-label="Pizzita"
              color="primary"
            >
              <LocalPizzaIcon />
            </IconButton>
          </Tooltip>
          {/* Enlace página inicio */}
          {menuPrincipal}

          {boxEmptyForSmallScreens}

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton size="large" color="inherit">
              <Badge
                badgeContent={getCountItems(cart)}
                color="primary"
                component={Link}
                to="/pedido/crear/"
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={17} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
          <div>{userMenu}</div>
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={menuOpcionesId}
              aria-haspopup="true"
              onClick={handleOpcionesMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {menuOpcionesMobile}
    </Box>
  );
}
