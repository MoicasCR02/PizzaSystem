import React from 'react';
import Card from 'react-bootstrap/Card'; // Importar Card de Bootstrap
import { Link } from 'react-router-dom';
import { Info } from '@mui/icons-material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PropTypes from 'prop-types';
import '../../themes/estilos.css';
import 'bootstrap/dist/css/bootstrap.min.css';


ListCardProcess.propTypes = {
  data: PropTypes.array,
  isShopping: PropTypes.bool.isRequired,
};

export function ListCardProcess({ data, isShopping }) {
  // Url para acceder a las imágenes guardadas en el API
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';

  return (
    <div className="container">
    <div className="row">
      {data &&
        data.map((item) => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={item.nombre_producto}>
            <Card className="hover-float" style={{ height: '100%' }}> {/* Establecer altura fija */}
              <Card.Img
                variant="top"
                src={`${BASE_URL}/${item.imagen}`}
                alt={item.nombre_producto}
                style={{ objectFit: 'cover', height: '200px' }} // Ajusta la altura de la imagen
              />
              <Card.Body className="d-flex flex-column"> {/* Flex para asegurar el contenido se ajuste */}
                <Card.Title className="text-center flex-grow-1">{item.nombre_producto}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted text-center">
                  Cantidad de Procesos: {item.cantidad_procesos} 
                </Card.Subtitle>
                <Card.Text className="text-center flex-grow-1">{item.descripcion}</Card.Text>
                <Card.Footer className="d-flex justify-content-between align-items-center">
                  <Link to={`/process/${item.id_producto}`} className="btn btn-info">
                    <Info /> Detalles
                  </Link>
                  {isShopping && (
                    <button className="btn btn-success">
                      <AddShoppingCartIcon /> Comprar
                    </button>
                  )}
                </Card.Footer>
              </Card.Body>
            </Card>
          </div>
        ))}
    </div>
  </div>
  );
}


