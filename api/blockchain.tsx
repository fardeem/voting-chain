import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  createContext,
  useReducer
} from 'react';

// @ts-ignore
import Miner from './miner.worker';
import ec from './curve';
import DataContext from './DataProvider';
import {
  blockchainReducer,
  genesisBlock,
  hashVote,
  getLongestChain,
  sortBlockchain
} from './chainUtils';
import useNetwork from './useNetwork';
import { auth } from './firebase';

//====================
// Interfaces
//====================

export interface VoteInfo {
  to: string;
  electionId: string;
  position: string;
}

export interface Vote extends VoteInfo {
  from: string;
  timestamp: number;
  signature: string;
}

export interface Block {
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
  peersCount: number;
};

const BlockchainContext = createContext<Partial<ContextProps>>({});
export default BlockchainContext;

//====================
// Provider
//====================

export const BlockchainProvider = ({ children }) => {
  const { currentUser, users, elections } = useContext(DataContext);

  const [miningQueue, setMiningQueue] = useState<Array<Vote>>([]);
  const [isMining, setIsMining] = useState(false);

  const [blockchain, dispatch] = useReducer(blockchainReducer, [genesisBlock]);
  const chainPreviousHashRef = useRef(genesisBlock.hash);

  const [peers, sendVote, sendBlock] = useNetwork(
    subscribeToNewVote,
    subscribeToNewBlocks
  );

  function castVote(partialVote: VoteInfo) {
    const key = ec.keyFromPrivate(currentUser.privateKey, 'hex');

    const vote: Vote = {
      ...partialVote,
      timestamp: Date.now(),
      from: auth.currentUser.uid,
      signature: ''
    };

    // Sign the vote with the user's private key
    const voteHash = hashVote(vote);
    vote.signature = key.sign(voteHash, 'base64').toDER('hex');

    return sendVote(vote);
  }

  function subscribeToNewVote(vote: Vote) {
    const fromUser = users.find(user => user.id === vote.from);

    // client isn't logged in
    if (!fromUser) return;

    const publicKey = ec.keyFromPublic(fromUser.publicKey, 'hex');

    // Verify that the vote has an authenticate signature
    if (publicKey.verify(hashVote(vote), vote.signature)) {
      setMiningQueue(currentQueue => [...currentQueue, vote]);
    }
  }

  function subscribeToNewBlocks(blocks: Block[]) {
    return dispatch({ type: 'UPDATE', value: blocks });
  }

  // Initialize the blockchain
  useEffect(function() {
    // Hydrate with the local cache
    var localChain = localStorage.getItem('blockchain') || '[]';
    dispatch({ type: 'UPDATE', value: JSON.parse(localChain) });
  }, []);

  // Update new peers with the current blockchain
  useEffect(() => {
    var localChain = localStorage.getItem('blockchain') || '[]';

    sendBlock(JSON.parse(localChain));
  }, [peers]);

  // Update the local blockchain cache
  // Update previous hash for next block,
  // everytime the blockchain is updated
  useEffect(() => {
    window.localStorage.setItem('blockchain', JSON.stringify(blockchain));
    chainPreviousHashRef.current = getLongestChain(blockchain)[0].hash;
  }, [blockchain]);

  /**
   * Listen to mining queue
   * Mine votes one by one
   * Broadcast votes to network
   */
  useEffect(() => {
    if (miningQueue.length === 0 || isMining) return;

    const miner = new Miner();
    const transaction = miningQueue[0];

    // Check if the user has voted for this election and position before
    const previousVote = blockchain.find(
      ({ vote }: { vote: Vote }) =>
        vote.from === transaction.from &&
        vote.electionId === transaction.electionId &&
        vote.position === transaction.position
    );

    // Get the role of the user who voted
    const { role } = users.find(({ id }) => id === transaction.from) || {
      role: 'user'
    };

    const electionBeingVoteTo = elections.find(
      election => election.id === transaction.electionId
    );

    // Do not:
    // let users change their vote,
    // vote for themselves,
    // vote to closed elections, if not the admin
    // vote to open elections, if the admin -- For elections on hold
    if (
      previousVote ||
      transaction.to === transaction.from ||
      (electionBeingVoteTo.end < new Date() && role !== 'admin') ||
      (electionBeingVoteTo.end > new Date() && role === 'admin')
    ) {
      setMiningQueue(miningQueue.splice(1, miningQueue.length));
      return;
    }

    miner.postMessage({
      vote: transaction,
      previousHash: chainPreviousHashRef.current
    });

    setIsMining(true);

    miner.addEventListener('message', ({ data: block }: { data: Block }) => {
      // Broadcast to network that this is a new block
      sendBlock([block]);
      setMiningQueue(miningQueue.splice(1, miningQueue.length));
      setIsMining(false);
    });
  }, [miningQueue, isMining]);

  return (
    <BlockchainContext.Provider
      value={{
        blockchain: sortBlockchain(getLongestChain(blockchain)),
        miningQueue,
        castVote,
        peersCount: Object.keys(peers).length
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};
