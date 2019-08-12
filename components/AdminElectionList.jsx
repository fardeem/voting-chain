import React, { useContext } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';

import DataProvider from '../api/DataProvider';
import { useElectionResult } from '../api/useResults';

const AdminElectionList = () => {
  const { elections } = useContext(DataProvider);
  return (
    <div className="sm:flex flex-wrap -mr-8 mt-8">
      {elections
        .sort((a, b) => (a.status > b.status ? 1 : -1))
        .map(election => (
          <div key={election.id} className="w-full sm:w-1/3 rounded pr-8 mb-10">
            <div
              className={
                'px-4 py-2 inline-block rounded uppercase font-bold text-white tracking-widest text-xs mb-4 ' +
                (status => {
                  switch (status) {
                    case 'VOTING':
                      return 'bg-blue-500';
                    case 'DONE':
                      return 'bg-red-500';
                    default:
                      return 'bg-yellow-500';
                  }
                })(election.status)
              }
            >
              {election.status === 'DONE' ? 'finished' : election.status}
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

            {election.status === 'DONE' &&
              useElectionResult(election.id)[1].length > 0 && (
                <div className="mb-4">
                  <Link href="/admin/[id]" as={`/admin/${election.id}`}>
                    <a className="text-sm tracking-wider uppercase text-red-500 underline">
                      Requires attention
                    </a>
                  </Link>
                </div>
              )}
          </div>
        ))}
    </div>
  );
};

export default AdminElectionList;
