import axios from "axios";
const Base_URL = import.meta.env.VITE_BASE_URL + "reportes";

class ReporteService {
  
  VistaProductosMasComprados() {
    return axios.get(Base_URL + '/VistaProductosMasComprados');
  }

  VistaProductosMenosComprados() {
    return axios.get(Base_URL + '/VistaProductosMenosComprados');

  }

  VistaCombosMasComprados() {
    return axios.get(Base_URL + '/VistaCombosMasComprados');

  }

  VistaCombosMenosComprados() {
    return axios.get(Base_URL + '/VistaCombosMenosComprados');

  }

  VistaCantidadPedidosPorEstado() {
    return axios.get(Base_URL + '/VistaCantidadPedidosPorEstado');

  }
}

export default new ReporteService();