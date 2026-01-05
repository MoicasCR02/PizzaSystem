import React from 'react';
import { useEffect, useState } from 'react';
import { ListCardMenu } from './ListCardMenu';
import MenuService from '../../services/MenuService';

export function ListMenu() {
  //Resultado de consumo del API, respuesta
  const [data, setData] = useState(null);
  //Error del API
  const [error, setError] = useState('');
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);

  //Llamar al API y obtener la lista de productos 
  useEffect(() => {
    MenuService.getMenu()
      .then((response) => {
        console.log(response);
        setData(response.data);
        setError(response.error);
        setLoaded(true);       
      })
      .catch((error) => {
        console.log(error);
        if (error instanceof SyntaxError) {
          setError(error);
          setLoaded(false);
        }
      });
  }, []);
  if(!loaded) return <p>Cargando..</p>
  if(error) return <p>Error: {error.message}</p>
  //cambiar card
  return <>{data && <ListCardMenu data={data} isShopping={true} />}</>
 
}

