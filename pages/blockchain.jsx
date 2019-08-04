import React, { Component, useState, useEffect, useContext } from 'react';

import BlockchainContext from '../api/blockchain';

const Socket = () => {
  const { blockchain, castVote, miningQueue } = useContext(BlockchainContext);

  return (
    <div>
      <div>
        <h1>Hello</h1>

        <button
          className="bg-gray-300 p-1"
          onClick={() => {
            castVote({
              to: 'Wamia',
              electionId: '12345555',
              position: 'cookier_monster'
            });
          }}
        >
          Add vote
        </button>

        {/* <div>
          <h1 className="text-lg">In queue</h1>
          <ul>
            {miningQueue.map((vote, index) => (
              <li key={index}>
                From {vote.from} to {vote.to} for {vote.electionId} in position{' '}
                {vote.electionId}
              </li>
            ))}
          </ul>
        </div> */}

        <hr />

        <div className="border-gray-900 border-t-2">
          <h1 className="text-2xl">Blockchain</h1>

          <ul>
            {blockchain.map((block, index) => (
              <li key={index}>
                Hash: {block.hash}, previousHash: {block.previousHash}, vote:{' '}
                {JSON.stringify(block.vote)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Socket;
