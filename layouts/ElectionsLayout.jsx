import React, { useContext } from 'react';
import Head from 'next/head';
import Router from 'next/router';

import DataContext from '../api/DataProvider';
import ElectionsNav from '../components/ElectionsNav';
import Loading from '../components/Loading';

const ElectionsLayout = ({ children, title }) => {
  const { currentUser } = useContext(DataContext);

  if (!currentUser) {
    Router.push('/');
    return null;
  }

  if (currentUser.role === 'admin') {
    Router.push('/admin');
    return <Loading />;
  }

  return (
    <main className="min-h-screen bg-pattern pb-10">
      <header>
        <div className="w-full max-w-4xl mx-auto px-8 pt-6 pb-8">
          <ElectionsNav />

          <Head>
            <title>{title}</title>
          </Head>

          <div className="text-center text-white mt-6">
            <h1 className="text-6xl font-light leading-none">{title}</h1>
          </div>
        </div>
      </header>

      {children}
    </main>
  );
};

export default ElectionsLayout;
