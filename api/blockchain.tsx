import React, { useState, useEffect, useContext, createContext } from 'react';
import shajs from 'sha.js';
import io from 'socket.io-client';

// @ts-ignore
import Miner from './miner.worker';
import ec from './curve';
import DataContext from './DataProvider';
import { auth } from './firebase';

const socket = io('localhost:8500');

//====================
// Interfaces
//====================

interface VoteInfo {
  to: string;
  electionId: string;
  position: string;
}

interface Vote extends VoteInfo {
  from: string;
  timestamp: number;
  signature: string;
}

interface Block {
  hash: string;
  previousHash: string;
  nonce: number;
  vote: Vote;
}

//====================
// Context
//====================

type ContextProps = {
  blockchain: Block[];
  miningQueue: Vote[];
  castVote: Function;
};

const BlockchainContext = createContext<Partial<ContextProps>>({});
export default BlockchainContext;

//====================
// Provider
//====================

export const BlockchainProvider = ({ children }) => {
  const [miningQueue, setMiningQueue] = useState<Array<Vote>>([]);
  const [isMining, setIsMining] = useState(false);

  const { currentUser, users } = useContext(DataContext);

  useEffect(() => {
    socket.on('MINE', (vote: Vote) => {
      const fromUser = users.find(user => user.id === vote.from);
      const publicKey = ec.keyFromPublic(fromUser.publicKey, 'hex');

      if (publicKey.verify(hashVote(vote), vote.signature)) {
        setMiningQueue(currentQueue => [...currentQueue, vote]);
      }
    });

    return () => {
      socket.off('MINE');
    };
  }, []);

  useEffect(() => {
    if (miningQueue.length === 0 || isMining) return;

    const miner = new Miner();
    const transaction = miningQueue[0];

    miner.postMessage({
      vote: transaction,
      previousHash: '0'
    });

    setMiningQueue(miningQueue.splice(1, miningQueue.length));
    setIsMining(true);

    miner.addEventListener('message', ({ data: block }: { data: Block }) => {
      // Broadcast to network that this is a new block
      console.log(block);
      setIsMining(false);
    });
  }, [miningQueue, isMining]);

  return (
    <BlockchainContext.Provider
      value={{
        blockchain: [],
        miningQueue,
        castVote: (vote: VoteInfo) => {
          return castVote(vote, currentUser.privateKey);
        }
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

//====================
// Helper Functions
//====================

function hashVote(vote: Vote): string {
  return shajs('sha256')
    .update(
      vote.from + vote.to + vote.electionId + vote.position + vote.timestamp
    )
    .digest('hex');
}

function castVote({ to, electionId, position }: VoteInfo, privateKey: string) {
  const key = ec.keyFromPrivate(privateKey, 'hex');

  const vote: Vote = {
    to,
    electionId,
    position,
    timestamp: Date.now(),
    from: auth.currentUser.uid,
    signature: ''
  };

  const voteHash = hashVote(vote);
  vote.signature = key.sign(voteHash, 'base64').toDER('hex');

  return broadcastToNetwork(JSON.stringify(vote), 'VOTE');
}

type BroadcastAction = 'BLOCK' | 'VOTE';
function broadcastToNetwork(body: string, action: BroadcastAction) {
  let endpoint = '';
  const method = 'POST';
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };

  if (action === 'BLOCK') endpoint = 'new-block';
  else if (action === 'VOTE') endpoint = 'new-vote';

  return fetch(`http://localhost:8500/${endpoint}`, {
    method,
    headers,
    body
  });
}
