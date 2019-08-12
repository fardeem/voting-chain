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
    <div className="">
      {Object.keys(positions).map((key, index) => (
        <div className="mb-20 flex" key={index}>
          <div className="w-1/3">
            <h1 className="text-sm font-bold uppercase tracking-wide">
              {positions[key]}
            </h1>
          </div>

          <div className="w-2/3">
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
                    className="inline-block px-2 py-1 bg-gray-300 rounded-lg mr-3 mb-3"
                  >
                    {user.name}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NominationsPage;
