import React, { useState } from 'react';
import Head from 'next/head';

// TODO: Authenticate properly

import AdminElectionList from '../components/AdminElectionList';
import AdminCreateForm from '../components/AdminCreateForm';

const AdminPage = () => {
  const [isCreating, setIsCreating] = useState(false);

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
        <div className="flex justify-between items-center w-full max-w-4xl mx-auto px-8 pt-6 mb-8">
          <div>
            <p className="text-gray-600 text-sm uppercase font-bold tracking-widest">
              Admin DashBoard
            </p>
            <h1 className="text-white text-4xl font-light">
              {isCreating ? 'Create New Election' : 'All Election'}
            </h1>
          </div>

          <div className="accounts">
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="text-white bg-purple-600 cursor-pointer hover:bg-purple-500 text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isCreating ? 'Cancel' : 'Create Election'}
            </button>
          </div>
        </div>
      </header>

      <div className="content w-full rounded-t-lg -mt-2 bg-white">
        <div className="relative w-full max-w-4xl mx-auto px-8 pt-10">
          <AdminCreateForm show={isCreating} />
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
