import React, { useContext } from 'react';
import Head from 'next/head';
import Router from 'next/router';

import Loading from '../components/Loading';
import DataContext from '../api/DataProvider';

const AdminLayout = ({ title, menuItems, children }) => {
  const { currentUser } = useContext(DataContext);

  if (!currentUser || currentUser.role !== 'admin') {
    Router.push('/');
    return <Loading />;
  }

  return (
    <main>
      <Head>
        <title>{title}</title>
      </Head>

      <header className="bg-pattern">
        <div className="flex justify-between items-center w-full max-w-4xl mx-auto px-8 py-6 mb-4">
          <div>
            <p className="text-gray-600 text-sm uppercase font-bold tracking-widest">
              Admin DashBoard
            </p>
            <h1 className="text-white text-4xl font-light">{title}</h1>
          </div>

          {menuItems}
        </div>
      </header>

      <div className="content w-full rounded-t-lg -mt-2 bg-white">
        <div className="relative w-full max-w-4xl mx-auto px-8 pt-4">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AdminLayout;
