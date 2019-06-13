import React, { useContext } from 'react';
import moment from 'moment';

import DataProvider from '../api/DataProvider';

const AdminElectionList = () => {
  const { elections } = useContext(DataProvider);
  return (
    <div className="flex flex-wrap -mr-8 mt-8">
      {elections
        .sort((a, b) => b.start - a.start)
        .map(election => (
          <div key={election.id} className="w-1/3 rounded pr-8">
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

            <div className="mb-8">
              <p className="text-sm tracking-wider uppercase text-gray-600">
                Name
              </p>
              <h1 className="text-xl">{election.name}</h1>
            </div>

            <div className="mb-8">
              <p className="text-sm tracking-wider uppercase text-gray-600">
                Start time
              </p>
              <time className="text-lg">
                {moment(election.start).format('MMM Do YYYY, h:mm a')}
              </time>
            </div>

            <div className="mb-8">
              <p className="text-sm tracking-wider uppercase text-gray-600">
                End time
              </p>
              <time className="text-lg">
                {moment(election.end).format('MMM Do YYYY, h:mm a')}
              </time>
            </div>

            <div className="mb-8">
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
