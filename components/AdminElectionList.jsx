import React, { useContext } from 'react';
import { format } from 'date-fns';

import DataProvider from '../api/DataProvider';

const AdminElectionList = () => {
  const { elections } = useContext(DataProvider);
  return (
    <div className="sm:flex flex-wrap -mr-8 mt-8">
      {elections
        .sort((a, b) => b.start - a.start)
        .map(election => (
          <div key={election.id} className="w-full sm:w-1/3 rounded pr-8 mb-20">
            <div
              className={
                'px-4 py-2 inline-block rounded uppercase font-bold text-white tracking-widest text-xs mb-4 ' +
                (status => {
                  switch (status) {
                    case 'voting':
                      return 'bg-blue-500';
                    case 'done':
                      return 'bg-red-500';
                    default:
                      return 'bg-yellow-500';
                  }
                })(election.status)
              }
            >
              {election.status === 'done' ? 'finished' : election.status}
            </div>

            <div className="mb-4">
              <p className="text-sm tracking-wider uppercase text-gray-600">
                Name
              </p>
              <h1 className="text-xl">{election.name}</h1>
            </div>

            <div className="mb-4">
              <p className="text-sm tracking-wider uppercase text-gray-600">
                Start
              </p>
              <time className="text-lg">
                {format(election.start, 'MMMM do, yyyy')}
              </time>
            </div>

            <div className="mb-4">
              <p className="text-sm tracking-wider uppercase text-gray-600">
                End
              </p>
              <time className="text-lg">
                {format(election.end, 'MMMM do, yyyy')}
              </time>
            </div>

            <div className="mb-4">
              <p className="text-sm tracking-wider uppercase text-gray-600">
                Positions
              </p>
              <ul>
                {Object.keys(election.positions).map(key => (
                  <li className="mb-2" key={key}>
                    {election.positions[key]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AdminElectionList;
