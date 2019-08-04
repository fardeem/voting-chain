import React, { Component, useState, useEffect, useContext } from 'react';
import Head from 'next/head';

import BlockchainContext from '../api/blockchain';

const Blockchain = () => {
  const { blockchain, castVote, miningQueue } = useContext(BlockchainContext);

  return (
    <div>
      <Head>
        <title>Blockchain Explorer</title>
      </Head>
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

        <div>
          <h1 className="text-lg">In queue</h1>
          <ul>
            {miningQueue.map((vote, index) => (
              <li key={index}>
                From {vote.from} to {vote.to} for {vote.electionId} in position{' '}
                {vote.electionId}
              </li>
            ))}
          </ul>
        </div>

        <hr />

        <div className="border-gray-900 border-t-2">
          <h1 className="text-2xl">Blockchain</h1>

          <ul>
            {blockchain
              .sort((a, b) => {
                return a.hash === b.previousHash ? -1 : 1;
              })
              .map((block, index) => (
                <li className="text-xs font-mono" key={index}>
                  Hash: {block.hash}{' '}
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>{' '}
                  previousHash: {block.previousHash}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Blockchain;
