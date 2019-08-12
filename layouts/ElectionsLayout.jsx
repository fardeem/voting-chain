import React, { useContext } from 'react';
import Router from 'next/router';

import DataContext from '../api/DataProvider';
import ElectionsNav from '../components/ElectionsNav';
import ElectionsTitle from '../components/ElectionsTitle';
import Loading from '../components/Loading';

const ElectionsLayout = ({ children }) => {
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
    <main className="min-h-screen">
      <header className="bg-pattern">
        <div className="w-full max-w-4xl mx-auto px-8 pt-6 pb-16">
          <ElectionsNav />
          <ElectionsTitle />
        </div>
      </header>

      <div className="content w-full rounded-lg -mt-2 mx-auto pb-6 bg-white">
        <div className="w-full max-w-4xl mx-auto px-8 pt-10">{children}</div>
      </div>

      <style jsx>{`
        footer {
          background-image: url(static/illustration.png);
          min-height: 200px;
        }
      `}</style>
      <footer className=" bg-contain bg-no-repeat bg-center" />
    </main>
  );
};

export default ElectionsLayout;
