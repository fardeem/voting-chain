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
    <ElectionsLayout>
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
    </ElectionsLayout>
  );
};

export default Page;
