/**
 * This page shows all the elections.
 * If a election id is passed in, it shows the nomination/voting page accordingly
 */

import React, { useContext } from 'react';
import Router, { withRouter } from 'next/router';

import DataProvider from '../../api/DataProvider';
import Loading from '../../components/Loading';
import ElectionsLayout from '../../layouts/ElectionsLayout';
import ElectionsList from '../../components/ElectionsList';

const ElectionsPage = ({ router }) => {
  const { currentUser } = useContext(DataProvider);

  if (!currentUser) {
    Router.push('/');
    return null;
  }

  if (currentUser.role === 'admin') {
    Router.push('/admin');
    return <Loading />;
  }

  return (
    <ElectionsLayout>
      <ElectionsList />
    </ElectionsLayout>
  );
};

export default ElectionsPage;
