import React, { useContext } from 'react';
import Link from 'next/link';
import { formatDistance } from 'date-fns';

import DataContext from '../api/DataProvider';

const ElectionsList = () => {
  const { elections } = useContext(DataContext);
  const electionStates = ['DONE', 'VOTING', 'NOMINATING'];

  return (
    <div className="md:flex mb-4 md:-mr-8">
      {electionStates.map(state => (
        <div className="w-full md:w-1/3 mr-8" key={state}>
          <h1 className="text-sm font-bold border-purple-500 border-b-2 pb-1 mb-6 uppercase tracking-wide">
            {state === 'DONE' && 'Past elections 📖'}
            {state === 'VOTING' && 'VOTING 🗳'}
            {state === 'NOMINATING' && 'NOMINATING 🎯'}
          </h1>

          <List
            status={state}
            data={elections
              .filter(e => e.status === state)
              .sort((a, b) => (a.end < b.end ? 1 : -1))}
          />
        </div>
      ))}
    </div>
  );
};

const List = ({ data, status }) => {
  if (data.length === 0) {
    return (
      <div className="empty font-extrabold text-3xl select-none text-gray-300">
        Nothing To See Here
      </div>
    );
  }

  return (
    <ul>
      {data.map(({ id, name, start, end }) => (
        <li key={id} className="mb-4">
          <Link href="/elections/[id]" as={`/elections/${id}`}>
            <a className="text-md hover:text-purple-600">{name}</a>
          </Link>

          <p className="italic text-xs text-gray-600">
            {(() => {
              if (status === 'VOTING')
                return `Voting ends in ${formatDistance(
                  new Date(end.toISOString()),
                  new Date()
                )}`;
              else if (status === 'NOMINATING')
                return `Voting begins in ${formatDistance(
                  new Date(start.toISOString()),
                  new Date()
                )}`;
              else
                return `Election ended ${formatDistance(
                  new Date(end.toISOString()),
                  new Date()
                )} ago`;
            })()}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default ElectionsList;
