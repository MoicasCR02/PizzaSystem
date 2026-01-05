import React from 'react';
import Card from 'react-bootstrap/Card'; // Importar Card de Bootstrap
import { Link } from 'react-router-dom';
import { Info } from '@mui/icons-material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PropTypes from 'prop-types';
import '../../themes/estilos.css';
import 'bootstrap/dist/css/bootstrap.min.css';


ListCardMenu.propTypes = {
  data: PropTypes.array,
  isShopping: PropTypes.bool.isRequired,
};

export function ListCardMenu({ data, isShopping }) {
  // Url para acceder a las imágenes guardadas en el API
    //const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';

  return (
    <div className="container">
    <div className="row">
      {data &&
        data.map((item) => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={item.id_menu}>
            <Card className="hover-float" style={{ height: '100%' }}> {/* Establecer altura fija */}
              <Card.Body className="d-flex flex-column"> {/* Flex para asegurar el contenido se ajuste */}
              <Card.Title className="text-center flex-grow-1">{item.nombre_menu}</Card.Title>
                <Card.Title className="text-center flex-grow-1">{item.id_combo}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted text-center">
                Fecha inicio: {item.fecha_inicio}
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted text-center">
                Fecha Final: {item.fecha_final}
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted text-center">
                Hora inicio: {item.hora_inicio}
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted text-center">
                Hora fin: {item.hora_fin}
                </Card.Subtitle>
                <Card.Text className="text-center flex-grow-1">{item.descripcion}</Card.Text>
                <Card.Footer className="d-flex justify-content-between align-items-center">
                  <Link to={`/menu/${item.id_menu}`} >
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
