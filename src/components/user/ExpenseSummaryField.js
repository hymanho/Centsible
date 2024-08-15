// src/components/user/ExpenseSummaryField.js

import React, { useState, useEffect } from 'react';
import AddExpenseForm from './ExpenseSummary/AddExpenseForm'; // Ensure this path is correct
import { getExpenseContainer } from '../../backend/Account/ExpenseManagement/ExpenseService'; // Adjust to the correct import path for your service
import { auth } from '../../firebase'; // Ensure you have Firebase auth imported

const ExpenseSummaryField = () => {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      const user = auth.currentUser;
      if (user) {
        const email = user.email;
        setUserEmail(email);
        const expenseContainer = await getExpenseContainer(email);
        if (expenseContainer) {
          setExpenses(expenseContainer.expenses || []);
        }
      }
    };

    fetchExpenses();
  }, []);

  const handleAddExpense = (newExpense) => {
    setExpenses([...expenses, newExpense]);
    setShowForm(false); // Hide the form after adding the expense
  };

  return (
    <div>
      <h2>Expense Summary</h2>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add Expense'}
      </button>
      {showForm && <AddExpenseForm onAddExpense={handleAddExpense} />}
      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>
            {expense.title}: ${expense.amount} on {expense.date} in {expense.category}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseSummaryField;
