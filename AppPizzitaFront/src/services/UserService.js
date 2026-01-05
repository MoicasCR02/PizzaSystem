import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'usuarios';

class UserService {
  getUsers() {
    return axios.get(BASE_URL);
  }
  getUserById(UserId) {
    return axios.get(BASE_URL + '/' + UserId);
  }
  getAllClientes() {
    return axios.get(BASE_URL + '/getAllClientes/');
  }
  createUser(User) {
    return axios.post(BASE_URL, JSON.stringify(User));
  }
  loginUser(User) {
    return axios.post(BASE_URL + '/login/', JSON.stringify(User));
  }
}

export default new UserService();
