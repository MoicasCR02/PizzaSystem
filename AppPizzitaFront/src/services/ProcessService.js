import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'producto_proceso_preparacion';

class ProcessService {

  //Listas procesos
  //localhost:81/apimovie/movie
  getProcess() {
    return axios.get(BASE_URL);
  }

  getProcessById(ProductId){
    return axios.get(BASE_URL+'/'+ProductId);
  }
  createProcess(Process) {
    return axios.post(BASE_URL, Process, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  updateProcess(Process) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(Process)
    })
  }

}



export default new ProcessService();
