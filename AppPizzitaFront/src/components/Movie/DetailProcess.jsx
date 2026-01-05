import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
//import ticket from '../../assets/ticket.jpg';
import ProcessService from '../../services/ProcessService';
import { Card } from 'react-bootstrap';

export function DetailProcess() {
  const routeParams = useParams();
  console.log(routeParams);
  //Url para acceder a la imagenes guardadas en el API
  const BASE_URL = import.meta.env.VITE_BASE_URL+'uploads'
  //Resultado de consumo del API, respuesta
  const [data, setData] = useState(null);
  //Error del API
  const [error, setError] = useState('');
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    //Llamar al API y obtener el proceso
    ProcessService.getProcessById(routeParams.id)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
        throw new Error('Respuesta no válida del servidor');
      });
  }, [routeParams.id]);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className="container">
    <div className="row">
      {data &&
        data.map((item) => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={item.nombre_proceso}>
            <Card.Subtitle className="mb-2 text-with text-center">
                  Producto: {item.nombre_producto} 
                </Card.Subtitle>
            <Card className="hover-float" style={{ height: '100%' }}> {/* Establecer altura fija */}
              <Card.Img
                variant="top"
                src={`${BASE_URL}/${item.imagen}`}
                alt={item.nombre_proceso}
                style={{ objectFit: 'cover', height: '200px' }} // Ajusta la altura de la imagen
              />
              <Card.Body className="d-flex flex-column"> {/* Flex para asegurar el contenido se ajuste */}
                <Card.Title className="text-center flex-grow-1">{}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted text-center">
                  Proceso: {item.nombre_proceso} 
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted text-center">
                  Orden Estación: {item.orden_estacion} 
                </Card.Subtitle>
                <Card.Text className="text-center flex-grow-1">{item.descripcion}</Card.Text>
                <Card.Footer className="d-flex justify-content-between align-items-center">
                </Card.Footer>
              </Card.Body>
            </Card>
          </div>
        ))}
    </div>
  </div>
  );
}
