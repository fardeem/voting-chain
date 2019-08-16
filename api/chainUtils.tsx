import shajs from 'sha.js';

import { Vote, Block } from './blockchain';
import { User, Election } from './DataProvider';

export function hashVote(vote: Vote): string {
  return shajs('sha256')
    .update(
      vote.from + vote.to + vote.electionId + vote.position + vote.timestamp
    )
    .digest('hex');
}

export const genesisBlock: Block = {
  hash: '000767da7e56264368c96030e274be80bae945ca9e3a512ad126fac473438833',
  previousHash: '0',
  nonce: 224,
  // @ts-ignore
  vote: {}
};

/**
 * Find longest chain the blockchain
 *
 * 1. Start at the genesis block
 * 2. Move the the block connected to the genesis block
 * 3. Push the genesis block to a list of visited blocks
 * 4. Repeat step 1 with this new block
 * 5. End when no other blocks has previousHash equal to
 *    the current block
 *
 * For forks, duplicate the history list and concurrently
 * work on both forks.
 *
 */
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

interface BlockchainActions {
  value: Block[];
  context: {
    users: User[];
    elections: Election[];
  };
}

export function blockchainReducer(
  blockchain: Block[],
  action: BlockchainActions
) {
  function isBlockValid(block: Block) {
    // Reject blocks with false hash
    const calculatedHash = shajs('sha256')
      .update(
        JSON.stringify(block.vote) + block.previousHash + String(block.nonce)
      )
      .digest('hex');

    if (calculatedHash !== block.hash) return false;

    // Reject blocks that already exists
    // Judging by the hash and previousHash
    const existsOnBlockchain = blockchain.find(
      ({ hash }) => hash === block.hash
    );

    if (existsOnBlockchain) return;

    // Pt2: Verify vote
    const { vote } = block;
    const fromUser = action.context.users.find(({ id }) => id === vote.from);
    const forElection = action.context.elections.find(
      ({ id }) => id === vote.electionId
    );

    // Reject vote if its to self
    if (vote.to === vote.from) return false;

    // Reject if user has already votde to this
    // election and position
    const previousVote = getLongestChain(blockchain).find(
      block =>
        block.vote.from === vote.from &&
        block.vote.electionId === vote.electionId &&
        block.vote.position === vote.position
    );

    if (previousVote) return false;

    // Reject vote if its not from the admin
    // and is after the election endtime
    if (
      fromUser.role !== 'admin' &&
      vote.timestamp > new Date(forElection.end).getTime()
    )
      return false;

    // Reject vote if its from the admin
    // and is before the election endtime
    if (
      fromUser.role === 'admin' &&
      vote.timestamp < new Date(forElection.end).getTime()
    )
      return false;

    return true;
  }

  const updates = [];
  action.value.forEach(block => {
    if (isBlockValid(block)) updates.push(block);
  });

  return [...blockchain, ...updates];
}
