// import { useRouter } from 'next/router';

// const Post = () => {
//   const router = useRouter();
//   const { id } = router.query;

//   return <p>Post: {id}</p>;
// };

// export default Post;

import React, { useState, useContext } from 'react';

import DataContext from '../../api/DataProvider';
import { useRouter } from 'next/router';
import ElectionsLayout from '../../layouts/ElectionsLayout';
import VotingPage from '../../components/VotingPage';
import NominationsPage from '../../components/NominationsPage';
import ResultsPage from '../../components/ResultsPage';

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const { elections } = useContext(DataContext);
  const election =
    elections.length > 0 && elections.find(election => election.id === id);

  return (
    <ElectionsLayout title={election.name}>
      <div className="text-center -mt-4 mb-6">
        <p className="inline-block text-white bg-indigo-600 text-sm font-bold py-2 px-4 rounded">
          Now:{' '}
          {(() => {
            switch (election.status) {
              case 'VOTING':
                return 'Voting';
              case 'NOMINATING':
                return 'Nominating';
              default:
                return 'Showing Results';
            }
          })()}
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded">
        {(() => {
          switch (election.status) {
            case 'VOTING':
              return <VotingPage context={election} />;
            case 'NOMINATING':
              return <NominationsPage context={election} />;
            default:
              return <ResultsPage context={election} />;
          }
        })()}
      </div>
    </ElectionsLayout>
  );
};

export default Page;
