import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.101:5000/api', // use your backend IP
});

export default api;
