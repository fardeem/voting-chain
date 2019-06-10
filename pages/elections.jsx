/**
 * This page shows all the elections.
 * If a election id is passed in, it shows the nomination/voting page accordingly
 */

import React from 'react';
import { withRouter } from 'next/router';

import ElectionsNav from '../components/ElectionsNav';
import ElectionsTitle from '../components/ElectionsTitle';
import ElectionsList from '../components/ElectionsList';

const ElectionsPage = ({ router }) => {
  return (
    <main>
      <header className="bg-pattern">
        <div className="w-full max-w-4xl mx-auto px-8 pt-6 pb-4 mb-6">
          <ElectionsNav />

          <ElectionsTitle electionId={router.query.id} />
        </div>
      </header>

      <div className="content w-full rounded-t-lg -mt-2 bg-white">
        <div className="w-full max-w-4xl mx-auto px-8 pt-10">
          <ElectionsList />
        </div>
      </div>
    </main>
  );
};

export default withRouter(ElectionsPage);
