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

const ElectionsPage = ({ router }) => {
  const { elections, currentUser } = useContext(DataProvider);

  const electionId = router.query.id;
  let currentElection;
  if (electionId) currentElection = elections.find(e => e.id === electionId);

  if (!currentUser) {
    Router.push('/');
    return null;
  }

  return (
    <main className="min-h-screen">
      <header className="bg-pattern">
        <div className="w-full max-w-4xl mx-auto px-8 pt-6 pb-4 mb-6">
          <ElectionsNav />

          <ElectionsTitle electionId={electionId} />
        </div>
      </header>

      <div className="content w-full rounded-t-lg -mt-2 bg-white">
        <div className="w-full max-w-4xl mx-auto px-8 pt-10">
          {(() => {
            if (electionId && currentElection) {
              if (currentElection.status === 'voting')
                return <VotingPage context={currentElection} />;
              else if (currentElection.status === 'nominating')
                return <NominationsPage context={currentElection} />;
              else return <h1>Results</h1>;
            } else {
              return <ElectionsList />;
            }
          })()}
        </div>
      </div>
    </main>
  );
};

export default withRouter(ElectionsPage);
