import React, { useContext } from 'react';

import VoteForUser from './VoteForUser';
import DataContext from '../api/DataProvider';

const ResolveHold = ({ positionsOnHold, election }) => {
  const { users } = useContext(DataContext);
  const { id, positions } = election;

  return (
    <div>
      <p className="bg-indigo-500 text-white max-w-lg mx-auto text-sm p-4 mb-8 rounded-lg">
        This election is <b>ON HOLD</b>. This happens when there are two or more
        winners in a single election or a user wins two or more positions with
        the same amount of vote. In both cases, determining a unique winner for
        a position is not possible and must be decided by a vote from the admin.
      </p>

      {Object.keys(positionsOnHold).map((key, index) => (
        <div key={index} className="flex items-center mb-20">
          <div className="w-1/3">
            <h1 className="text-sm font-bold uppercase tracking-wide">
              {positions[key]}
            </h1>
          </div>

          <VoteForUser
            options={positionsOnHold[key].map(({ user: userId }) =>
              users.find(({ id }) => id === userId)
            )}
            position={key}
            electionId={id}
          />
        </div>
      ))}
    </div>
  );
};

export default ResolveHold;
