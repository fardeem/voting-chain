import React, { useState, useContext } from 'react';

import DataContext from '../api/DataProvider';
import VoteForUser from './VoteForUser';

const VotingPage = ({ context }) => {
  const { users } = useContext(DataContext);
  const { id, positions, nominations } = context;

  return (
    <div className="">
      {Object.keys(positions).map((key, index) => (
        <div key={index} className="flex items-center mb-20">
          <div className="w-1/4">
            <p className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4">
              {positions[key]}
            </p>
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
