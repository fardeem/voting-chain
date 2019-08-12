import React, { useContext, useState, useEffect } from 'react';
import { formatDistance } from 'date-fns';

import BlockchainContext, { Vote } from '../api/blockchain';
import DataContext, { User } from '../api/DataProvider';

interface VotingInfo extends Vote {
  isMined?: Boolean;
  loaded?: Boolean;
}

interface Props {
  options: User[];
  position: string;
  electionId: string;
}

const VoteForUser = ({ options, position, electionId }: Props) => {
  const [selectedUser, setSelectedUser] = useState('default');
  const [votedFor, setVotedFor] = useState<Partial<VotingInfo>>({});
  const { currentUser } = useContext(DataContext);
  const { blockchain, miningQueue, castVote } = useContext(BlockchainContext);

  useEffect(() => {
    const vote: VotingInfo = blockchain
      .filter(block => block.previousHash !== '0')
      .map((block): VotingInfo => ({ ...block.vote, isMined: true }))
      .concat(miningQueue)
      .find(
        vote =>
          vote.from === currentUser.id &&
          vote.electionId === electionId &&
          vote.position === position
      );

    if (vote) {
      setVotedFor(vote);
      setSelectedUser(vote.to);
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
    <form className="w-2/3 flex items-center" onSubmit={handleSubmit}>
      <div className=" w-3/4 relative mr-3">
        <select
          value={selectedUser}
          disabled={!!votedFor.to}
          onChange={e => setSelectedUser(e.target.value)}
          className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="default" disabled>
            Select your option
          </option>

          {options.map(user => {
            const voteCount = blockchain.filter(
              ({ vote }) =>
                vote.electionId === electionId &&
                vote.position === position &&
                vote.to === user.id
            ).length;

            return (
              <option
                value={user.id}
                key={user.id}
                disabled={currentUser.id === user.id}
              >
                {user.name} – {voteCount} vote{voteCount > 1 ? 's' : null}
              </option>
            );
          })}
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
        {votedFor.isMined && (
          <p className="text-xs text-right italic text-gray-500">
            Voted <br />
            {formatDistance(new Date(votedFor.timestamp), new Date())} ago
          </p>
        )}
        <button
          className={
            'bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded ' +
            (votedFor.isMined && 'hidden')
          }
          type="submit"
        >
          {(() => {
            if (selectedUser === votedFor.to && !votedFor.isMined) {
              return 'Processing';
            }

            return 'Vote';
          })()}
        </button>
      </div>
    </form>
  );
};

export default VoteForUser;
