import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import { Flex } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import ExpenseComponent from './ExpenseComponent';
import { NavBarHeader2 } from './ui-components';
import CategoryComponent from './CategoryComponent';

// To connect with amplify and configure user
Amplify.configure(config);

function App({ signOut, user }) {
  return (
    <>
    <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <NavBarHeader2 />
      <Flex justifyContent="space-evenly" alignItems="flex-start" padding="50px 50px">
      <ExpenseComponent />
      <CategoryComponent />
    </Flex>
    </div>

    </>
  );
}

export default withAuthenticator(App);
//<button onClick={signOut}>Sign out</button>
//<h1>Hello {user.username}</h1>