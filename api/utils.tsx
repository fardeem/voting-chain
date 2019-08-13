import shajs from 'sha.js';
import ec from './curve';

import { VoteInfo, Vote, Block } from './blockchain';
import { auth } from './firebase';

export function hashVote(vote: Vote): string {
  return shajs('sha256')
    .update(
      vote.from + vote.to + vote.electionId + vote.position + vote.timestamp
    )
    .digest('hex');
}

export function castVote(
  { to, electionId, position }: VoteInfo,
  privateKey: string
) {
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

type BroadcastAction = 'BLOCK' | 'VOTE' | 'CHAIN';
export function broadcastToNetwork(body: string, action: BroadcastAction) {
  let endpoint = '';
  const method = 'POST';
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };

  if (action === 'BLOCK') endpoint = 'new-block';
  else if (action === 'VOTE') endpoint = 'new-vote';
  else if (action === 'CHAIN') endpoint = 'chain';

  return fetch(`http://localhost:8500/${endpoint}`, {
    method,
    headers,
    body
  });
}

export const genesisBlock: Block = {
  hash: '0008a5469e5cb0d2c2844a18efaf8fc723e100b08c34485b784e04fce79166f9',
  previousHash: '0',
  nonce: 194,
  // @ts-ignore
  vote: {}
};

export function getLongestChain(blockchain: Block[]): Block[] {
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

export function sortBlockchain(chain: Block[]) {
  const itemsByPrev = chain.reduce((a, item) => {
    a[item.previousHash] = item;
    return a;
  }, {});

  const sorted = [];
  const { length } = chain;
  let lastId = 0;

  while (sorted.length < length) {
    const obj = itemsByPrev[lastId];
    sorted.push(obj);
    lastId = obj.hash;
  }

  return sorted;
}

type BlockchainActions = { type: 'UPDATE'; value: Block[] };

export function blockchainReducer(
  blockchain: Block[],
  action: BlockchainActions
) {
  if (action.type !== 'UPDATE') throw new Error('HOBE NAH TOH!');

  const updates = [];
  action.value.forEach(newBlock => {
    const calculatedHash = shajs('sha256')
      .update(
        JSON.stringify(newBlock.vote) +
          newBlock.previousHash +
          String(newBlock.nonce)
      )
      .digest('hex');

    if (
      blockchain.find(
        block =>
          block.hash === newBlock.hash &&
          block.previousHash === newBlock.previousHash
      ) &&
      calculatedHash === newBlock.hash
    )
      return;

    updates.push(newBlock);
  });

  return [...blockchain, ...updates];
}
