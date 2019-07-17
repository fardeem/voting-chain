import React, { useContext } from 'react';
import Link from 'next/link';
import moment from 'moment';

import DataContext from '../api/DataProvider';

const ElectionsList = () => {
  const { elections } = useContext(DataContext);
  const electionStates = ['voting', 'nominating', 'done'];

  return (
    <div className="flex mb-4 -mr-8">
      {electionStates.map(state => (
        <div className="w-1/3 mr-8" key={state}>
          <h1 className="text-sm font-bold border-purple-500 border-b-2 pb-1 mb-6 uppercase tracking-wide">
            {state === 'done' ? 'Past elections' : state}
          </h1>

          <List
            data={elections.filter(e => e.status === state)}
            status={state}
          />
        </div>
      ))}
    </div>
  );
};

const List = ({ data, status }) => {
  return data.length !== 0 ? (
    <ul>
      {data.map(({ id, name, start, end }) => (
        <li key={id} className="mb-4">
          <Link href={`/elections?id=${id}`}>
            <a className="text-md hover:text-purple-600">{name}</a>
          </Link>

          <p className="italic text-sm font-serif text-gray-600">
            {(() => {
              if (status === 'voting')
                return `Voting ends ${moment(end.toISOString()).fromNow()}`;
              else if (status === 'nominating')
                return `Voting begins ${moment(start.toISOString()).fromNow()}`;
              else
                return `Election ended ${moment(end.toISOString()).fromNow()}`;
            })()}
          </p>
        </li>
      ))}
    </ul>
  ) : (
    <div className="empty font-extrabold text-3xl select-none text-gray-300">
      Nothing To
      <br /> See Here
    </div>
  );
};

export default ElectionsList;
