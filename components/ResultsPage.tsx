import React, { useContext } from 'react';

import { useRouter } from 'next/router';
import DataContext from '../api/DataProvider';
import { useElectionResult } from '../api/useResults';

function randomVote() {
  return Math.floor(Math.random() * 10) + 1;
}

const ResultsPage = ({ context }) => {
  const router = useRouter();
  const { id } = router.query;
  const result = useElectionResult(id);

  return <div>Results</div>;
};

export default ResultsPage;
