import React, { Component } from 'react';
import Router from 'next/router';

import AccountsPage from '../layouts/AccountsPage';
import AccountsForm from '../components/AccountsForm';

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
