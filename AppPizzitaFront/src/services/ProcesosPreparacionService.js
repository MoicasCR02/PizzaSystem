import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'proceso_preparacion';

class ProcesosPreparacionService {

  //Listas procesos
  //localhost:81/apimovie/movie
  getProcessP() {
    return axios.get(BASE_URL);
  }
  //Obtener pelicula
  //localhost:81/apimovie/movie/1
  getProcessPById(ProductId){
    return axios.get(BASE_URL+'/'+ProductId);
  }
}

export default new ProcesosPreparacionService();
