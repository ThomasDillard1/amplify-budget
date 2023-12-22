/*
    Three parts: Listing the expenses, creating the expenses, deleting the expenses
    1) Listing the expenses - easy, do first
    2) Creating the expenses - use a button
    3) Deleting the expenses - use a button
*/
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
    useEffect(() => {
      async function createExpenseItem() {
        try {
          const expenseInput = {
            amount: 50.00,        // Replace with the actual amount
            category: 'Groceries', // Replace with the actual category
            description: 'My first expense!',
            date: '2023-01-01'     // Replace with the actual date
          };
          await client.graphql({
            query: createExpense,
            variables: {
              input:
                expenseInput
            }
          });
          console.log(expenseInput)
        } catch (e){
          console.log(e)
        }
      }
      //createExpenseItem();
  
      async function displayExpenses(){
        const expenses = await client.graphql({query:listExpenses});
        console.log(expenses);
        setItems(expenses.data.listExpenses.items);
      }
      displayExpenses();
    }, []);

    return (
        <>
        <p>I am the expense component</p>
        {items.map((item, index) => (
            <div key={index}>
              {item.description} : {index}
            </div>
        ))}
        </>
    );
}