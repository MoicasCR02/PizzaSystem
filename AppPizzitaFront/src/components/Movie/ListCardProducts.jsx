import React from 'react';
import Card from 'react-bootstrap/Card'; // Importar Card de Bootstrap
import { Link } from 'react-router-dom';
import { Info } from '@mui/icons-material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PropTypes from 'prop-types';
import '../../themes/estilos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCart } from '../../hook/useCart';


ListCardProducts.propTypes = {
  data: PropTypes.array,
  isShopping: PropTypes.bool.isRequired,
};

export function ListCardProducts({ data, isShopping }) {
  const { addItem }=useCart()
  // Url para acceder a las imágenes guardadas en el API
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';

  return (
    <div className="container">
      <div className="row">
        {data &&
          data.map((item) => (
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={item.id_producto}>
              <Card className="hover-float" style={{ height: '100%' }}>
                <Card.Img
                  variant="top"
                  src={`${BASE_URL}/${item.imagen.imagen}`}
                  alt={item.nombre_producto}
                  style={{ objectFit: 'cover', height: '200px' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-center fw-bold fs-5 mb-2">{item.nombre_producto}</Card.Title>
                  <Card.Subtitle className="text-center text-muted fs-6 mb-3">
                    &cent;{item.precio}
                  </Card.Subtitle>
                  <Card.Text className="text-center text-muted mb-3">{item.descripcion}</Card.Text>
                  <Card.Footer className="d-flex justify-content-between align-items-center">
                    <Link to={`/productos/${item.id_producto}`} className="btn btn-outline-info w-100">
                      <Info /> Detalles
                    </Link>
                    {isShopping && (
                      <button className="btn btn-outline-success w-100" onClick={()=>addItem(item)}>
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
