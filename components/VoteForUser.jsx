import React, { useContext, useState, useEffect } from 'react';
import BlockchainContext from '../api/blockchain';
import DataContext from '../api/DataProvider';

const VoteForUser = ({ options, position, electionId }) => {
  const [selectedUser, setSelectedUser] = useState('default');
  const { castVote } = useContext(BlockchainContext);

  function handleSubmit(e) {
    e.preventDefault();

    castVote({
      to: selectedUser,
      electionId,
      position
    });
  }

  return (
    <form className="w-3/4 flex items-center" onSubmit={handleSubmit}>
      <div className=" w-3/4 relative">
        <select
          value={selectedUser}
          onChange={e => setSelectedUser(e.target.value)}
          className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="default" disabled>
            Select your option
          </option>

          {options.map(user => (
            <option value={user.id} key={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>

      <div className="w-1/4 text-right">
        <button
          className="text-r bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Vote
        </button>
      </div>
    </form>
  );
};

export default VoteForUser;