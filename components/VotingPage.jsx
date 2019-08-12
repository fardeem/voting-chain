import React, { useContext } from 'react';
import { useRouter } from 'next/router';

import DataContext from '../api/DataProvider';
import VoteForUser from './VoteForUser';

const VotingPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { users, elections } = useContext(DataContext);
  const { positions, nominations } = elections.find(
    election => election.id === id
  );

  console.log('hhh');
  return (
    <div className="">
      {Object.keys(positions).map((key, index) => (
        <div key={index} className="flex items-center mb-20">
          <div className="w-1/3">
            <h1 className="text-sm font-bold uppercase tracking-wide">
              {positions[key]}
            </h1>
          </div>

          <VoteForUser
            options={users.filter(user => nominations[key].includes(user.id))}
            position={key}
            electionId={id}
          />
        </div>
      ))}
    </div>
  );
};

export default VotingPage;
