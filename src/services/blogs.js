import axios from 'axios';
const baseUrl = '/api/blogs';

let token;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (blogObject) => {
  const config = {
    headers: { Authorization: token }
  };

  const response = await axios.post(baseUrl, blogObject, config);
  return response.data;
};

const update = async (blogObject) => {
  const config = {
    headers: { Authorization: token }
  };

  const response = await axios.put(`${baseUrl}/${blogObject.id}`, blogObject, config);
  console.log('response data in update:', response.data);
  return response.data;
};

const remove = async (blogId) => {
  const config = {
    headers: { Authorization: token }
  };

  await axios.delete(`${baseUrl}/${blogId}`, config);
};

export default {
  setToken,
  getAll,
  create,
  update,
  remove
};
