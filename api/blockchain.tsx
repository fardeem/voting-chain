import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  createContext,
  useReducer
} from 'react';
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

  const [blockchain, dispatch] = useReducer(blockchainReducer, [genesisBlock]);
  const chainPreviousHashRef = useRef(genesisBlock.hash);

  const { currentUser, users } = useContext(DataContext);

  /**
   * Send votes to mining queue
   * Check that signature matches with public key
   */
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

    setMiningQueue(miningQueue.splice(1, miningQueue.length));
    setIsMining(true);

    miner.addEventListener('message', ({ data: block }: { data: Block }) => {
      // Broadcast to network that this is a new block
      broadcastToNetwork(JSON.stringify(block), 'BLOCK').then(() => {
        setIsMining(false);
      });
    });
  }, [miningQueue, isMining]);

  /**
   * Listen on socket for new blocks
   * Add them to the chain
   */
  useEffect(() => {
    socket.on('BLOCK', (block: Block) => {
      dispatch({ type: 'UPDATE', value: [block] });
    });

    return () => {
      socket.off('BLOCK');
    };
  }, []);

  return (
    <BlockchainContext.Provider
      value={{
        blockchain,
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

const genesisBlock: Block = {
  hash: '0008a5469e5cb0d2c2844a18efaf8fc723e100b08c34485b784e04fce79166f9',
  previousHash: '0',
  nonce: 194,
  vote: null
};

function getLongestChain(blockchain: Block[]) {
  console.log(blockchain);
  const found = [];

  function buildLink(parent: Block, history = []) {
    var next = blockchain.filter(item => item.previousHash === parent.hash);

    if (next.length === 0) {
      return found.push([parent, ...history]);
    } else {
      return next.forEach(item => {
        return buildLink(item, [parent, ...history]);
      });
    }
  }

  buildLink(blockchain.find(block => block.previousHash === '0'));

  return found.sort((a, b) => b.length - a.length)[0];
}

type BlockchainActions = { type: 'UPDATE'; value: Block[] };

function blockchainReducer(blockchain: Block[], action: BlockchainActions) {
  if (action.type !== 'UPDATE') throw new Error('HOBE NAH TOH!');

  const updates = [];
  action.value.forEach(update => {
    if (
      blockchain.find(
        block =>
          block.hash === update.hash &&
          block.previousHash === update.previousHash
      )
    )
      return;
    updates.push(update);
  });

  return [...blockchain, ...updates];
}
