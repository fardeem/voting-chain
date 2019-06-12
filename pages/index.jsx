import React, { useContext } from 'react';
import Router from 'next/router';

import AccountsPage from '../layouts/AccountsPage';
import AccountsForm from '../components/AccountsForm';

import DataProvider from '../api/DataProvider';

const Home = () => {
  const { currentUser } = useContext(DataProvider);

  if (!currentUser) {
    return (
      <AccountsPage>
        <AccountsForm />
      </AccountsPage>
    );
  } else {
    Router.push('/elections');
    return null;
  }
};

export default Home;
