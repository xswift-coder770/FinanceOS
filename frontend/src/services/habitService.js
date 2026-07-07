import API from "./api";


export const getHabits = async () => {
  const response = await API.get("/habits");
  return response.data;
};


export const createHabit = async (habitData) => {
  const response = await API.post("/habits", habitData);
  return response.data;
};


export const toggleHabit = async (id) => {
  const response = await API.put(`/habits/${id}/toggle`);
  return response.data;
};


export const deleteHabit = async (id) => {
  const response = await API.delete(`/habits/${id}`);
  return response.data;
};