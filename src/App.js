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
import ExpenseComponent from './ExpenseComponent';
import { NavBarHeader2 } from './ui-components';

// To connect with amplify and configure user
Amplify.configure(config);

function App({ signOut, user }) {
  console.log(user);
  return (
    <>
      <NavBarHeader2 />
      
      
      
      <ExpenseComponent></ExpenseComponent>
    </>
  );
}

export default withAuthenticator(App);
//<button onClick={signOut}>Sign out</button>
//<h1>Hello {user.username}</h1>