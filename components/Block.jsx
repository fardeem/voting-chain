import React, { useContext } from 'react';
import DataContext from '../api/DataProvider';
import { format } from 'date-fns';

const Block = ({ block }) => {
  const { users, elections } = useContext(DataContext);
  let VoteContent;

  if (block.vote !== null) {
    const voteFormatted = {
      to: users.find(user => user.id === block.vote.to).name,
      from: users.find(user => user.id === block.vote.from).name,
      election: elections.find(
        election => election.id === block.vote.electionId
      ).name
    };

    VoteContent = (
      <table className="table">
        <style jsx>{`
          .table {
            border-collapse: separate;
            border-spacing: 1rem 0.5rem;
          }
        `}</style>
        <tbody>
          <tr>
            <td className="font-bold uppercase tracking-wide mr-2">TO</td>
            <td>{voteFormatted.to}</td>
          </tr>
          <tr>
            <td className="font-bold uppercase tracking-wide mr-2">From</td>
            <td>{voteFormatted.from}</td>
          </tr>
          <tr>
            <td className="font-bold uppercase tracking-wide mr-2">Election</td>
            <td>{voteFormatted.election}</td>
          </tr>
          <tr>
            <td className="font-bold uppercase tracking-wide mr-2">
              Timestamp
            </td>
            <td>
              {format(
                new Date(block.vote.timestamp),
                'MMMM do, yyyy h:mm bbbb' // Ex: August 9th, 2001 7:00 a.m.
              )}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <li className="w-full max-w-md mx-auto bg-gray-800 shadow-md rounded mb-8 font-mono text-xs">
      <p className="bg-pink-500 p-2 rounded-t cs">
        <span className="font-bold uppercase tracking-wide mr-4">
          Previous Hash
        </span>
        {block.previousHash}
      </p>
      <p className="bg-indigo-500 p-2 cs">
        <span className="font-bold uppercase tracking-wide mr-4">Hash</span>
        {block.hash}
      </p>
      <div className="text-white p-2 rounded-b">
        {block.vote === null ? (
          <p className="font-bold uppercase tracking-widest">Genesis block</p>
        ) : (
          <>
            <span className="font-bold uppercase tracking-wide mr-4">Vote</span>
            {VoteContent}
          </>
        )}
      </div>
    </li>
  );
};

export default Block;
