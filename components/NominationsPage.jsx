import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';

import DataContext from '../api/DataProvider';
import NominateUser from './NominateUser';

const NominationsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { users, elections } = useContext(DataContext);
  const { positions, nominations } = elections.find(
    election => election.id === id
  );

  return (
    <div className="md:flex flex-wrap -mr-8">
      {Object.keys(positions).map((key, index) => (
        <div className="w-full md:w-1/3 pr-8 mb-20" key={index}>
          <h1 className="text-sm font-bold border-purple-500 border-b-2 pb-1 mb-6 uppercase tracking-wide">
            {positions[key]}
          </h1>

          <NominateUser
            options={users.filter(
              user =>
                !nominations[key].includes(user.id) && user.role !== 'admin'
            )}
            position={key}
            electionId={id}
          />

          <ul>
            {users
              .filter(user => nominations[key].includes(user.id))
              .map(user => (
                <li
                  key={user.id}
                  className="inline-block px-2 py-1 bg-gray-400 rounded-lg mr-3 mb-3"
                >
                  {user.name}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default NominationsPage;
