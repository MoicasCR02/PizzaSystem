import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'pedidos';

class PedidoService {

  getPedidos() {
    return axios.get(BASE_URL);
  }

  getPedidoID(PedidoID){
    return axios.get(BASE_URL+'/'+PedidoID);
  }

  getDetallePedidoID(PedidoID){
    return axios.get(BASE_URL+'/'+'getDetallePedido/'+PedidoID);
  }

  getDetallePedidoIDCocina(PedidoID){
    return axios.get(BASE_URL+'/'+'getDetallePedidoCocina/'+PedidoID);
  }

  getPedidoCliente(PedidoID){
    return axios.get(BASE_URL+'/getCliente/'+PedidoID);
  }



  createPedido(Pedido) {
    return axios.post(BASE_URL, JSON.stringify(Pedido));
  }

}
export default new PedidoService();
