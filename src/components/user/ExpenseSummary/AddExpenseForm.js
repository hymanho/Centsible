// src/components/AddExpenseForm.js

import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase';
import { addExpense } from '../../../backend/Account/ExpenseManagement/ExpenseService';
import Expense from '../../../models/ExpensesDataModel';

const AddExpenseForm = ({ onAddExpense }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [user] = useAuthState(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newExpense = new Expense(
      null, // ID will be generated by Firestore
      title,
      parseFloat(amount),
      date,
      category,
      description
    );

    await addExpense(user.email, newExpense);

    // Call the parent function to add the new expense and hide the form
    onAddExpense(newExpense);

    // Optionally, you can reset the form fields here if needed
    setTitle('');
    setAmount('');
    setDate('');
    setCategory('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default AddExpenseForm;