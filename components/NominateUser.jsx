import React, { useState } from 'react';
import firebase, { db } from '../api/firebase';

const NominateUser = ({ options, position, electionId }) => {
  const [selectedUser, setSelectedUser] = useState('default');

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
    <form className="w-full  mb-6" onSubmit={handleSubmit}>
      <div className="flex">
        <select
          className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 mr-3 px-2 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
          value={selectedUser}
          onChange={e => setSelectedUser(e.target.value)}
        >
          <option value="default" disabled>
            Select a user
          </option>
          {options.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <button
          className="flex-shrink-0 bg-purple-500 hover:bg-purple-600 border-purple-500 hover:border-purple-600 text-sm border-4 text-white py-1 px-2 rounded"
          type="submit"
        >
          Nominate
        </button>
      </div>
    </form>
  );
};

export default NominateUser;
