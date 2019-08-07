import React, { useContext, useState, useEffect } from 'react';
import { formatDistance } from 'date-fns';

import BlockchainContext, { Vote } from '../api/blockchain';
import DataContext from '../api/DataProvider';

interface VotingInfo extends Vote {
  isMined?: Boolean;
}

const VoteForUser = ({ options, position, electionId }) => {
  const [selectedUser, setSelectedUser] = useState('default');
  const [votedFor, setVotedFor] = useState<Partial<VotingInfo>>({});
  const { currentUser } = useContext(DataContext);
  const { blockchain, miningQueue, castVote } = useContext(BlockchainContext);

  useEffect(() => {
    const blocks: VotingInfo[] = blockchain
      .filter(block => block.previousHash !== '0')
      .map((block): VotingInfo => ({ ...block.vote, isMined: true }))
      .concat(miningQueue)
      .filter(
        vote =>
          vote.from === currentUser.id &&
          vote.electionId === electionId &&
          vote.position === position
      )
      .sort((a, b) => {
        return b.timestamp - a.timestamp;
      });

    if (blocks.length > 0) {
      setVotedFor(blocks[0]);
      setSelectedUser(blocks[0].to);
    }
  }, [blockchain, miningQueue]);

  function handleSubmit(e) {
    e.preventDefault();

    if (selectedUser === votedFor.to) return;

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
        {votedFor.to === selectedUser && (
          <p className="text-xs text-right italic text-gray-500">
            Voted <br />
            {formatDistance(new Date(votedFor.timestamp), new Date())} ago
          </p>
        )}
        <button
          className={
            'bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded ' +
            (votedFor.to === selectedUser && 'hidden')
          }
          type="submit"
        >
          {(() => {
            if (votedFor.to === '') {
              return 'Vote';
            } else if (selectedUser !== votedFor.to) {
              return 'Change';
            } else if (!votedFor.isMined && votedFor.to !== '') {
              return 'Processing';
            }

            return '';
          })()}
        </button>
      </div>
    </form>
  );
};

export default VoteForUser;
