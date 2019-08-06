import React, { useState, useContext } from 'react';

import DataProvider from '../api/DataProvider';
import NominateUser from './NominateUser';

const NominationsPage = ({ context }) => {
  const { users } = useContext(DataProvider);
  const { id, positions, nominations } = context;

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
                  className="inline-block px-2 py-1 bg-gray-400 rounded-lg mr-3"
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
