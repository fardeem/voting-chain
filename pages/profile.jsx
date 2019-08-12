import React, { useContext } from 'react';
import Router from 'next/router';

import DataContext from '../api/DataProvider';
import Loading from '../components/Loading';
import ChangePassword from '../components/ChangePassword';
import ElectionsLayout from '../layouts/ElectionsLayout';

const Profile = () => {
  const { currentUser } = useContext(DataContext);

  if (!currentUser) {
    Router.push('/');
    return <Loading />;
  }

  return (
    <ElectionsLayout title="Profile">
      <ChangePassword />
    </ElectionsLayout>
  );
};

export default Profile;
