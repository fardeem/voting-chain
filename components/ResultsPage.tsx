import React, { useContext } from 'react';

import DataContext, { Election } from '../api/DataProvider';
import BlockchainContext from '../api/blockchain';
import { useElectionResult } from '../api/useResults';

const ResultsPage = ({ context }: { context: Election }) => {
  const { users } = useContext(DataContext);
  const { blockchain } = useContext(BlockchainContext);
  const { id, positions, nominations } = context;
  const [results, holdList] = useElectionResult(id);

  return (
    <div>
      {Object.keys(positions).map(key => (
        <div className="mb-20 flex" key={key}>
          <div className="w-1/3">
            <h1 className="text-sm font-bold uppercase tracking-wide mt-1">
              {positions[key]}
            </h1>

            {holdList.includes(key) && (
              <div className="p-2 inline-block rounded uppercase font-bold bg-red-600 text-white tracking-widest text-xs mt-2">
                ON HOLD
              </div>
            )}
          </div>

          <div className="w-2/3">
            <h1 className="text-sm font-bold uppercase tracking-wide mb-2">
              Winner{results[key].length > 1 && 's'} 🌟
            </h1>
            <ul className="text-xl winners bg-purple-400 text-white px-2 pt-2 rounded">
              {results[key]
                .map(({ user: userId, vote }) => ({
                  ...users.find(({ id }) => id === userId),
                  vote
                }))
                .map(({ id, name, vote }) => (
                  <li
                    key={id}
                    className="flex justify-between items-center pb-2"
                  >
                    <p>{name}</p>
                    <p className="text-sm font-bold uppercase">
                      {vote} vote{vote > 1 && 's'}
                    </p>
                  </li>
                ))}

              {results[key].length === 0 && (
                <p className="pb-2 opacity-75 italic">
                  No winner could be determined
                </p>
              )}
            </ul>

            <h1 className="text-sm font-bold uppercase tracking-wide mt-8">
              Other nominees 😭
            </h1>
            <ul className="p-2 pl-2">
              {nominations[key]
                .filter(nominee =>
                  results[key].every(winner => nominee !== winner.user)
                )
                .map(userId => ({
                  ...users.find(({ id }) => id === userId),
                  vote: blockchain.filter(
                    ({ vote }) =>
                      vote !== null &&
                      vote.to === userId &&
                      vote.electionId === id &&
                      vote.position === key
                  ).length
                }))
                .map(({ id, name, vote }) => (
                  <li
                    key={id}
                    className="flex justify-between items-center mb-2"
                  >
                    <p>{name}</p>
                    <p className="text-xs font-bold uppercase">
                      {vote} vote{vote > 1 && 's'}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsPage;
