import API from "./api"; 


// GET EXPENSES
export const getExpenses = async () => {
  const response = await API.get("/expenses");
  return response.data;
};


// ADD EXPENSE
export const addExpense = async (expenseData) => {
  const response = await API.post("/expenses", expenseData);
  return response.data;
};


// DELETE EXPENSE
export const deleteExpense = async (id) => {
  const response = await API.delete(`/expenses/${id}`);
  return response.data;
};