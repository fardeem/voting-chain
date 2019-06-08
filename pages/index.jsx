import React, { Component } from 'react';
import Router from 'next/router';
import Head from 'next/head';

import AccountsPage from '../layouts/accountsPage';
import AccountsForm from '../components/accountsForm';

import { auth } from '../api/firebase';

class Home extends Component {
  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        Router.push('/elections');
      } else {
      }
    });
  }

  render() {
    return (
      <AccountsPage>
        <AccountsForm />
      </AccountsPage>
    );
  }
}

export default Home;
