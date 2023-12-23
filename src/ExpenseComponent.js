/*
    Three parts: Listing the expenses, creating the expenses, deleting the expenses
    1) Listing the expenses - easy, do first
    2) Creating the expenses - use a button
    3) Deleting the expenses - use a button
*/

import { Button, Flex, Text, View } from "@aws-amplify/ui-react";
// Expenses Model
import { createExpense, updateExpense, deleteExpense } from './graphql/mutations';
import { listExpenses } from './graphql/queries';


// GraphQL API
import { generateClient } from 'aws-amplify/api';

import { useEffect, useState } from 'react';

// To connect with the GraphQL api
const client = generateClient();

export default function ExpenseComponent() {
    const [items, setItems] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    useEffect(() => {  
      displayExpenses();
    }, []);

    async function displayExpenses(){
      const expenses = await client.graphql({query:listExpenses});
      console.log(expenses);
      setItems(expenses.data.listExpenses.items);
    }

    async function createExpenseItem() {
      try {
        const expenseInput = {
          amount: 40.00,        // Replace with the actual amount
          category: 'Food', // Replace with the actual category
          description: 'My second expense!',
          date: '2023-02-01'     // Replace with the actual date
        };
        await client.graphql({
          query: createExpense,
          variables: {
            input:
              expenseInput
          }
        });
        console.log(expenseInput)
        displayExpenses();
      } catch (e){
        console.log(e)
      }
    }

    const handleSort = (key) => {
      let direction = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      setSortConfig({ key, direction });
    };
  
    const sortedItems = [...items].sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      } else {
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
      }
    });

    return (
        <>
        <h1>Expenses</h1>
        <Button
          size="small"
          variation="primary"
          onClick={() => {
            createExpenseItem();
          }}
        >Create Expense</Button>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('category')}>Category</th>
            <th onClick={() => handleSort('description')}>Description</th>
            <th onClick={() => handleSort('amount')}>Amount</th>
            <th onClick={() => handleSort('date')}>Date</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item, index) => (
            <tr key={index}>
              <td>{item.category}</td>
              <td>{item.description}</td>
              <td>{item.amount}</td>
              <td>{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

        </>
    );
}