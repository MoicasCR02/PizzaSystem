import React from 'react';
import { useEffect, useState } from 'react';
import { ListCardCombos} from './ListCardCombos';
import ComboService from '../../services/ComboService';

export function ListCombos() {
  //Resultado de consumo del API, respuesta
  const [data, setData] = useState(null);
  //Error del API
  const [error, setError] = useState('');
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);

  //Llamar al API y obtener la lista de productos 
  useEffect(() => {
    ComboService.getCombos()
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
  //Cambiar list card dependiendo de tabla
  return <>{data && <ListCardCombos data={data} isShopping={true} />}</>
 
}