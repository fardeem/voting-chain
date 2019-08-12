import React, { useContext } from 'react';
import Router from 'next/router';

import AccountsLayout from '../layouts/AccountsLayout';
import AccountsForm from '../components/AccountsForm';

import DataProvider from '../api/DataProvider';
import Loading from '../components/Loading';

const Home = () => {
  const { currentUser } = useContext(DataProvider);

  if (currentUser && currentUser.role === 'admin') {
    Router.push('/admin');
    return <Loading />;
  }

  if (currentUser) {
    Router.push('/elections');
    return <Loading />;
  }

  return (
    <AccountsLayout>
      <AccountsForm />
    </AccountsLayout>
  );
};

export default Home;
