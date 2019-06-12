import React, { useState, useContext } from 'react';

import DataProvider from '../api/DataProvider';
import firebase, { db } from '../api/firebase';

const NominationsPage = ({ context }) => {
  const { users } = useContext(DataProvider);
  const { id, positions, nominations } = context;

  return (
    <div className="flex flex-wrap -mr-8">
      {Object.keys(positions).map((key, index) => (
        <div className="w-1/3 pr-8 mb-40" key={index}>
          <h1 className="text-sm font-bold border-pink-500 border-b-2 pb-1 mb-6 uppercase tracking-wide">
            {positions[key]}
          </h1>

          <NominateUser
            options={users.filter(user => !nominations[key].includes(user.id))}
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

const NominateUser = ({ options, position, electionId }) => {
  const [selectedUser, setSelectedUser] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    // if (selectedUser)
    db.collection('elections')
      .doc(electionId)
      .update({
        [`nominations.${position}`]: firebase.firestore.FieldValue.arrayUnion(
          selectedUser
        )
      })
      .then(() => {
        setSelectedUser('');
      });

    console.log(
      `Nominate user ${selectedUser} to position with key ${position} for election with id ${electionId}`
    );
  }

  return (
    <form className="w-full max-w-sm mb-6" onSubmit={handleSubmit}>
      <div className="flex">
        <select
          className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 mr-3 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          value={selectedUser}
          onChange={e => setSelectedUser(e.target.value)}
        >
          <option value="" />
          {options.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <button
          className="flex-shrink-0 bg-pink-500 hover:bg-pink-600 border-pink-500 hover:border-pink-600 text-sm border-4 shadow text-white py-1 px-2 rounded"
          type="submit"
        >
          Nominate
        </button>
      </div>
    </form>
  );
};

export default NominationsPage;
