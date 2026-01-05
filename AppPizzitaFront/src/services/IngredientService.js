import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'ingredientes';

class IngredientService {
  getIngredients() {
    return axios.get(BASE_URL);
  }

  getIngredientById(id_ingrediente) {
    return axios.get(BASE_URL + '/' + id_ingrediente);
  }
}

export default new IngredientService();