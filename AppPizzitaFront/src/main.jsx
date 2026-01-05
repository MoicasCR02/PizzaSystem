import React from 'react';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Home } from './components/Home/Home.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PageNotFound } from './components/Home/PageNotFound.jsx';
import { ListProducts } from './components/Movie/ListProducts.jsx';
import { DetailProduct } from './components/Movie/DetailProduct.jsx';
import { ListCombos } from './components/Movie/ListCombos.jsx';
import { DetailCombo } from './components/Movie/DetailCombo.jsx';
import { ListMenu } from './components/Movie/ListMenu.jsx';
import { DetailMenu } from './components/Movie/DetailMenu.jsx';
import { ListProcess } from './components/Movie/ListProcess.jsx';
import { DetailProcess } from './components/Movie/DetailProcess.jsx';
import TableProducts  from './components/Movie/TableProducts.jsx';
import { CreateProduct } from './components/Movie/CreateProduct.jsx';
import { UpdateProduct } from './components/Movie/UpdateProduct.jsx';
import { UploadImageProduct }  from './components/Movie/UploadImageProduct.jsx';
import TableProcess from './components/Movie/TableProcess.jsx';
import { CreateProcess } from './components/Movie/CreateProcess.jsx';
import TableMenu from './components/Movie/TableMenu.jsx';
import TableCombos from './components/Movie/TableCombos.jsx';
import { Menu }from './components/Movie/Menu.jsx';
import { CreateCombo } from './components/Movie/CreateCombo.jsx';
import { UpdateCombo } from './components/Movie/UpdateCombo.jsx';
import { UpdateProcess } from './components/Movie/UpdateProcess.jsx';
import { ListCardProcesoCreate } from './components/Movie/MostrarProcesos.jsx';
import { CreatePedido } from './components/Pedido/CreatePedido.jsx';
import HistorialPedidos from './components/Movie/HistorialPedidos.jsx';
import   TablePedidosRealTime  from './components/Movie/TablePedidosRealTime.jsx';
import TableTotalPedidos   from './components/Movie/TableTotalPedidos.jsx';
import DetallePedido from './components/Movie/DetallePedido.jsx';
import { Login } from './components/User/Login.jsx';
import UserProvider from './components/User/UserProvider.jsx';
import { Unauthorized } from './components/User/Unauthorized.jsx';
import { Logout } from './components/User/Logout.jsx';
import { Signup } from './components/User/Signup.jsx';
import { Auth } from './components/User/Auth.jsx';
import TableUsers from './components/Movie/TableUsers.jsx';
import { CreateUser } from './components/Movie/CreateUser.jsx';
import GestionCocina from './components/Movie/GestionCocina.jsx';
import DetallePedidoCocina from './components/Movie/DetallePedidoCocina.jsx';
import  Dashboard  from './components/Movie/Dashboard.jsx';

const rutas = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '*',
        element: <PageNotFound />,
      },
      //Pizzita
      //Administrador
      {
        path: '/',
        element: <Auth requiredRoles = {["Administrador"]} />,
        children: [
          {
            path: '/products/crear/',
            element: <CreateProduct /> 
          },
          {
            path: '/products/update/:id',
            element: <UpdateProduct/>
          },
          {
            path: '/mantainprocess',
            element: <TableProcess />
          },
          {
            path: '/process/crear/',
            element: <ListCardProcesoCreate />
          },
          {
            path: '/process/update/:id',
            element: <UpdateProcess/>
          },
          {
            path: '/mantaincombos',
            element: <TableCombos /> 
          },
          {
            path: '/combo/crear/',
            element: <CreateCombo />
          },
          {
            path: '/combo/update/:id',
            element: <UpdateCombo/>
          },
          {
            path: '/pedidosrealtime',
            element: <TablePedidosRealTime />
          },
        ]
      },
      //Encargado y Cliente
      {
        path: '/',
        element: <Auth requiredRoles = {["Encargado", "Cliente","Administrador"]} />,
        children: [
          {
            path: '/pedido/crear/',
            element: <CreatePedido />,
          },
          
        ]
      },
      {
        path: '/mantainmenu',
        element: <TableMenu />
      },
      {
        path: '/todospedidos',
        element: <TableTotalPedidos />
      },
      {
        path: '/mantainproducts',
        element: <TableProducts />
      },
      //Gestion de la Cocina
      {
        path: '/productos',
        element: <ListProducts />,
      },
      {
        path: '/productos/:id',
        element: <DetailProduct />
      },
      {
        path: '/combos',
        element: <ListCombos />,
      },
      {
        path: '/combos/:id',
        element: <DetailCombo />
      },
      {
        path: '/menu',
        element: <ListMenu />,
      },
      {
        path: '/menu/:id',
        element: <DetailMenu />
      },
      {
        path: '/process',
        element: <ListProcess />,
      },
      {
        path: '/process/:id',
        element: <DetailProcess />
      },
      {
        path: '/products/image/',
        element: <UploadImageProduct />
      },
      {
        path: '/producto_proceso_preparacion/:id',
        element: <CreateProcess />
      }, 
      {
        path: '/menudisponible',
        element: <Menu /> 
      },
      {
        path: '/historialpedidos',
        element: <HistorialPedidos />,
      },
      {
        path: '/pedidos/detailpedido/:id',
        element: <DetallePedido/>
      },
      {
        path: '/unauthorized',
        element: <Unauthorized />
      },
      {
        path: '/user/login',
        element:<Login />
      },
      {
        path: '/user/logout',
        element:<Logout />
      },
      {
        path: '/user/create',
        element:<Signup />
      },
      {
        path: '/user/registrados',
        element:<TableUsers />
      },
      {
        path: '/user/createuser',
        element:<CreateUser />
      },
      {
        path: '/cocina',
        element:<GestionCocina />
      },
      {
        path: '/pedidos/gestion/:id',
        element: <DetallePedidoCocina/>
      },
      {
        path: '/dashboard',
        element: <Dashboard/>
      },
    ]
  },
]);
createRoot(document.getElementById("root")).render(

  <StrictMode>
    <UserProvider>
    <RouterProvider router={rutas} />
    </UserProvider>
    
</StrictMode>,
);
