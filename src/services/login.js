import axios from 'axios';
const baseUrl = '/api/login';

const login = async (crendentials) => {
  const response = await axios.post(baseUrl, crendentials);
  console.log('login response', response.data);
  return response.data;
};

export default { login };