import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'menu';

class MenuService {
  //Definición para Llamar al API y obtener el listado de películas

  //Listas peliculas
  //localhost:81/apimovie/movie
  getMenu() {
    return axios.get(BASE_URL);
  }
  //Obtener pelicula
  //localhost:81/apimovie/movie/1
  getMenuById(MenuId){
    return axios.get(BASE_URL+'/'+MenuId);
  }

  getMenuDisponible(){
    return axios.get(BASE_URL+'/'+ 'getMenuDisponible');
  }

  createMovie(Movie) {
    return axios.post(BASE_URL, JSON.stringify(Movie));
  }
  updateMovie(Movie) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(Movie)

    })
  }
}
export default new MenuService();
