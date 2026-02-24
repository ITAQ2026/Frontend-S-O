import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-so.onrender.com', 
});

export default api;
// Comentario de prueba para forzar git