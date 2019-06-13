import React, { useState } from 'react';
import Head from 'next/head';

// TODO: Authenticate properly

import AdminElectionList from '../components/AdminElectionList';
import AdminCreateForm from '../components/AdminCreateForm';

const AdminPage = () => {

  return (
    <main
    >
      <Head>
        <title>Admin</title>
      </Head>
    </main>
  );
};

export default AdminPage;
