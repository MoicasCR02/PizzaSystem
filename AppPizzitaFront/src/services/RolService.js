import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'rol';

class RolService {
  getRol() {
    return axios.get(BASE_URL);
  }
  getRolById(UserId) {
    return axios.get(BASE_URL + '/' + UserId);
  }
}

export default new RolService();