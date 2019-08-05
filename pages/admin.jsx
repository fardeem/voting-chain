import React, { useState, useContext } from 'react';
import Router from 'next/router';
import Head from 'next/head';

import AdminElectionList from '../components/AdminElectionList';
import AdminCreateForm from '../components/AdminCreateForm';
import DataContext from '../api/DataProvider';
import { auth } from '../api/firebase';
import Loading from '../components/Loading';

const AdminPage = () => {
  const { currentUser } = useContext(DataContext);
  const [isCreating, setIsCreating] = useState(false);

  if (!currentUser || currentUser.role !== 'admin') {
    Router.push('/');
    return <Loading />;
  }

  return (
    <main
      onClick={e => {
        if (isCreating) {
          setIsCreating(false);
        }
      }}
    >
      <Head>
        <title>Admin</title>
      </Head>

      <header className="bg-pattern">
        <div className="flex justify-between items-center w-full max-w-3xl mx-auto py-6 mb-4">
          <div>
            <p className="text-gray-600 text-sm uppercase font-bold tracking-widest">
              Admin DashBoard
            </p>
            <h1 className="text-white text-4xl font-light">
              {isCreating ? 'Create New Election' : 'All Election'}
            </h1>
          </div>

          <div>
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="text-white bg-purple-600 cursor-pointer hover:bg-purple-500 text-sm font-bold py-2 px-4 mr-4 rounded focus:outline-none"
            >
              {isCreating ? 'Cancel' : 'Create Election'}
            </button>

            <button
              onClick={() => auth.signOut()}
              className="text-white bg-purple-600 cursor-pointer hover:bg-purple-500 text-sm font-bold py-2 px-4 rounded focus:outline-none"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <div className="content w-full rounded-t-lg -mt-2 bg-white">
        <div className="relative w-full max-w-3xl mx-auto pt-4">
          <AdminCreateForm show={isCreating} setShow={setIsCreating} />
          <div
            className={
              'transition-opacity ' +
              (isCreating ? 'opacity-25' : 'opacity-100')
            }
          >
            <AdminElectionList />
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminPage;
