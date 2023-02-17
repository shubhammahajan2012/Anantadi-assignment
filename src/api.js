import axios from 'axios';

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com/users/1",
});

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};
