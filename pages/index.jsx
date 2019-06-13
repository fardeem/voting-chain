import React, { useContext } from 'react';
import Router from 'next/router';

import AccountsPage from '../layouts/AccountsPage';
import AccountsForm from '../components/AccountsForm';

import DataProvider from '../api/DataProvider';

const Home = () => {
  const { currentUser } = useContext(DataProvider);

  if (currentUser && currentUser.role === 'admin') {
    Router.push('/admin');
    return null;
  }

  if (currentUser) {
    Router.push('/elections');
    return null;
  }

  return (
    <AccountsPage>
      <AccountsForm />
    </AccountsPage>
  );
};

export default Home;
