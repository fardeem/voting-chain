import React, { useState, useContext } from 'react';
import Router from 'next/router';

import { auth } from '../../api/firebase';
import DataContext from '../../api/DataProvider';
import Loading from '../../components/Loading';
import AdminLayout from '../../layouts/AdminLayout';
import AdminElectionList from '../../components/AdminElectionList';
import AdminCreateForm from '../../components/AdminCreateForm';

const AdminPage = () => {
  const { currentUser } = useContext(DataContext);
  const [isCreating, setIsCreating] = useState(false);

  if (!currentUser || currentUser.role !== 'admin') {
    Router.push('/');
    return <Loading />;
  }

  const MenuItems = () => (
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
  );

  return (
    <AdminLayout
      title={isCreating ? 'New Election' : 'All Election'}
      menuItems={<MenuItems />}
    >
      <div>
        <AdminCreateForm show={isCreating} setShow={setIsCreating} />
        <div
          className={
            'transition-opacity ' + (isCreating ? 'opacity-25' : 'opacity-100')
          }
        >
          <AdminElectionList />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;
