import API from "./api";


export const getGoals = async () => {
  const response = await API.get("/goals");
  return response.data;
};


export const createGoal = async (goalData) => {
  const response = await API.post("/goals", goalData);
  return response.data;
};


export const addMoneyToGoal = async (id, amount) => {
  const response = await API.put(`/goals/${id}/deposit`, {
    amount,
  });

  return response.data;
};


export const deleteGoal = async (id) => {
  const response = await API.delete(`/goals/${id}`);
  return response.data;
};