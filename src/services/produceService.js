// services/produceService.js
import axios from "axios";

export const fetchTraderProduce = async (traderId) => {
  const url = `/api/produce?traderId=${traderId}`;
  const response = await axios.get(url);
  return response.data;
};

export const addNewProduce = async (produceData) => {
  await axios.post("/api/produce", produceData);
};

export const updateProduce = async (id, produceData) => {
  await axios.put(`/api/produce/${id}`, produceData);
};

export const deleteProduce = async (id) => {
  await axios.delete(`/api/produce/${id}`);
};
