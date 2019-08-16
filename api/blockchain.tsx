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
  getLongestChain
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

  const [blockchain, dispatch] = useReducer(blockchainReducer, [], () => {
    const localChain = localStorage.getItem('blockchain');

    if (localChain) return JSON.parse(localChain);
    else return [genesisBlock];
  });
  const chainPreviousHashRef = useRef(genesisBlock.hash);

  const [peers, sendVote, sendBlock] = useNetwork(
    (vote: Vote) => setMiningQueue(currentQueue => [...currentQueue, vote]),
    (blocks: Block[]) =>
      dispatch({ value: blocks, context: { users, elections } })
  );

  //====================
  // Side Effects
  //====================

  // Update new peers with the current local blockchain
  useEffect(() => {
    var localChain = localStorage.getItem('blockchain') || '[]';
    sendBlock(JSON.parse(localChain));
  }, [peers]);

  // Update the local blockchain cache
  // Update previous hash for next block,
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
        blockchain: getLongestChain(blockchain),
        miningQueue,
        peersCount: Object.keys(peers).length,
        castVote(partialVote: VoteInfo) {
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
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};
