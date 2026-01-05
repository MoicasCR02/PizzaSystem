import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'productos';

class ProductService {
  //Definición para Llamar al API y obtener el listado de películas

  //Listas peliculas
  //localhost:81/apimovie/movie
  getProducts() {
    return axios.get(BASE_URL);
  }

  getProductsProcesos() {
    return axios.get(BASE_URL+'/'+'allProcess');
  }

  //Obtener pelicula
  //localhost:81/apimovie/movie/1
  getProductById(ProductId){
    return axios.get(BASE_URL+'/'+ProductId);
  }


  createProduct(Product) {
    return axios.post(BASE_URL, JSON.stringify(Product));
  }

  updateProduct(Product) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(Product)
    })
  }
}
export default new ProductService();
