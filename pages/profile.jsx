import React, { useContext } from 'react';
import Head from 'next/head';
import Router from 'next/router';

import DataContext from '../api/DataProvider';
import ElectionsNav from '../components/ElectionsNav';
import Loading from '../components/Loading';
import ChangePassword from '../components/ChangePassword';

const Profile = () => {
  const { currentUser } = useContext(DataContext);

  if (!currentUser) {
    Router.push('/');
    return <Loading />;
  }

  return (
    <main className="min-h-screen bg-pattern">
      <Head>
        <title>Profile</title>
      </Head>

      <header>
        <div className="w-full max-w-4xl mx-auto px-8 pt-6 pb-4 mb-6">
          <ElectionsNav />

          <div className="text-center text-white mt-10">
            <h1 className="text-6xl font-light leading-none">Your Profile</h1>
          </div>
        </div>
      </header>

      <ChangePassword />
    </main>
  );
};

export default Profile;
