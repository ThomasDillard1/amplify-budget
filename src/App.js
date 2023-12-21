import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';

// GraphQL API
import { generateClient } from 'aws-amplify/api';

// Expenses Model
import { createExpense, updateExpense, deleteExpense } from './graphql/mutations';
import { listExpenses } from './graphql/queries';

//ToDo Model
import { createTodo, updateTodo, deleteTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';

import { useEffect, useState } from 'react';

// To connect with amplify and configure user
Amplify.configure(config);

// To connect with the GraphQL api
const client = generateClient();

function App({ signOut, user }) {
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
    createExpenseItem();

    async function displayExpenses(){
      const expenses = await client.graphql({query:listExpenses});
      console.log(expenses);
      setItems(expenses.data.listExpenses.items);
    }
    displayExpenses();
  }, []);

  return (
    <>
      <h1>Hello {user.username}</h1>
      
      <button onClick={signOut}>Sign out</button>
      {items.map((item, index) => (
        <div key={index}>
          {item.description} : {index}
        </div>
      ))}
    </>
  );
}

export default withAuthenticator(App);

/*
      {items.map((item, index) => (
        <div key={index}>
          {item.name} : {index}
        </div>
      ))}
      */