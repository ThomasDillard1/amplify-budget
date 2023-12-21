import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';

// GraphQL API
import { generateClient } from 'aws-amplify/api';
import { createExpense, updateExpense, deleteExpense } from './graphql/mutations';
import { listExpenses } from './graphql/queries';
import { createTodo, updateTodo, deleteTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';

import { useEffect, useState } from 'react';
Amplify.configure(config);
const client = generateClient();

function App({ signOut, user }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    async function createTodoItem() {
      await client.graphql({
        query: createTodo,
        variables: {
          input: {
            name: 'My first todo!'
          }
        }
      });
    }
    //createTodoItem();

    async function listItems(){
      const todos = await client.graphql({query:listTodos});
      console.log(30, todos);
      setItems(todos.data.listTodos.items);
    }
    listItems();
  }, []);

  return (
    <>
      <h1>Hello {user.username}</h1>
      
      <button onClick={signOut}>Sign out</button>
      {items.map((item, index) => (
        <div key={index}>
          {item.name} : {index}
        </div>
      ))}
    </>
  );
}

export default withAuthenticator(App);