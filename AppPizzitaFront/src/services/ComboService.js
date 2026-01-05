import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'combos';
class ComboService {
  //Definición para Llamar al API y obtener el listado de combos

  getCombos() {
    return axios.get(BASE_URL);
  }
  //Obtener pelicula
  //localhost:81/apimovie/movie/1
  getComboById(ComboId){
    return axios.get(BASE_URL+'/'+ComboId);
  }

  getProductosCombos(ComboId){ 
    return axios.get(BASE_URL+'/'+ComboId);
   }
   
   //Create combo
   createCombo(Combo) {
    return axios.post(BASE_URL, JSON.stringify(Combo));
  }

  updateCombo(Combo) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(Combo)
    })
  }

}
export default new ComboService();
