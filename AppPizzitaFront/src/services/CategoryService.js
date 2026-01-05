import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'categorias';

class CategoryService {
  getCategory() {
    return axios.get(BASE_URL);
  }

  getCategoryById(id_categoria) {
    return axios.get(BASE_URL + '/' + id_categoria);
  }
}

export default new CategoryService();