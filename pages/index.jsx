import React, { Component } from 'react';
import Router from 'next/router';
import Head from 'next/head';

import AccountsPage from '../layouts/accountsPage';
import AccountsForm from '../components/accountsForm';


class Home extends Component {
  render() {
    return (
      <AccountsPage>
        <AccountsForm />
      </AccountsPage>
    );
  }
}

export default Home;
