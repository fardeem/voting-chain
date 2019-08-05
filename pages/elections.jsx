/**
 * This page shows all the elections.
 * If a election id is passed in, it shows the nomination/voting page accordingly
 */

import React, { useContext } from 'react';
import Router, { withRouter } from 'next/router';

import DataProvider from '../api/DataProvider';
import ElectionsNav from '../components/ElectionsNav';
import ElectionsTitle from '../components/ElectionsTitle';
import ElectionsList from '../components/ElectionsList';
import NominationsPage from '../components/NominationsPage';
import VotingPage from '../components/VotingPage';
import Loading from '../components/Loading';

const ElectionsPage = ({ router }) => {
  const { elections, currentUser } = useContext(DataProvider);

  const electionId = router.query.id;
  let currentElection;
  if (electionId) currentElection = elections.find(e => e.id === electionId);

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
        <div className="w-full max-w-4xl mx-auto px-8 pt-10">
          {(() => {
            if (electionId && currentElection) {
              switch (currentElection.status) {
                case 'voting':
                  return <VotingPage context={currentElection} />;
                case 'nominating':
                  return <NominationsPage context={currentElection} />;
                default:
                  return <h1>Results</h1>;
              }
            }

            return <ElectionsList />;
          })()}
        </div>
      </div>

      <footer className="py-8" />
    </main>
  );
};

export default withRouter(ElectionsPage);
