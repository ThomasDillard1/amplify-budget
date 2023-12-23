import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';

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