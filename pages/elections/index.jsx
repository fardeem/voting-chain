/**
 * This page shows all the elections.
 * If a election id is passed in, it shows the nomination/voting page accordingly
 */

import React from 'react';

import ElectionsLayout from '../../layouts/ElectionsLayout';
import ElectionsList from '../../components/ElectionsList';

const ElectionsPage = () => (
  <ElectionsLayout title="All Elections">
    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded">
      <ElectionsList />

      <style jsx>{`
        footer {
          background-image: url(/static/illustration.png);
          min-height: 200px;
        }
      `}</style>
      <footer className="-mb-8 bg-contain bg-no-repeat bg-center" />
    </div>
  </ElectionsLayout>
);

export default ElectionsPage;
