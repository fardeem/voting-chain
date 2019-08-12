import { useContext } from 'react';
import DataContext from './DataProvider';
import BlockchainContext from './blockchain';

import 'array-flat-polyfill';

interface VoteByNominee {
  user: string;
  position: string;
  vote: number;
}

interface ResultsByUser {
  [key: string]: {
    vote: number;
    positions: string[];
  };
}

interface Winner {
  user: string;
  vote: number;
}

interface ResultsByPosition {
  [key: string]: Winner[];
}

function makeResults(
  votes: VoteByNominee[],
  positions: string[],
  nominees: string[]
) {
  const results: ResultsByUser = nominees.reduce((result, nomineeId) => {
    result[nomineeId] = { vote: 0, positions: [] };
    return result;
  }, {});
  const positionsOnHold: string[] = [];

  positions.forEach(position => {
    // get users for this position
    const nominations = votes.filter(vote => vote.position === position);
    let highestVote = Math.max(...nominations.map(({ vote }) => vote));

    (function updateResults() {
      nominations
        .filter(({ vote }) => vote === highestVote)
        .forEach(nominee => {
          const resultForNominee = results[nominee.user];

          if (resultForNominee.vote === nominee.vote) {
            resultForNominee.positions.push(nominee.position);
          } else if (
            resultForNominee.vote > nominee.vote &&
            resultForNominee.positions.length > 0
          ) {
            const votesWithSecondHighestVote = nominations
              .filter(({ vote }) => vote < highestVote)
              .map(({ vote }) => vote);

            if (votesWithSecondHighestVote.length > 0) {
              highestVote = Math.max(...votesWithSecondHighestVote);
              updateResults();
            }
          } else {
            resultForNominee.vote = nominee.vote;
            resultForNominee.positions = [nominee.position];
          }
        });
    })();
  });

  const resultsByPosition: ResultsByPosition = positions.reduce((acc, item) => {
    const winners = [];

    Object.values(results).forEach(({ positions, vote }, i, self) => {
      if (positions.includes(item))
        winners.push({ user: Object.keys(results)[i], vote });

      if (
        positions.length > 1 ||
        self
          .filter((_, selfIndex) => selfIndex !== i)
          .find(val => val.positions.includes(positions[0]))
      )
        return positionsOnHold.push(...positions);
    });

    acc[item] = winners;

    return acc;
  }, {});

  return [resultsByPosition, Array.from(new Set(positionsOnHold))];
}

const positions = ['pos1', 'pos2', 'pos3', 'pos4', 'pos5', 'pos6'];
const users = ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'];

const votes = [
  { vote: 8, user: 'u1', position: 'pos1' },
  { vote: 3, user: 'u2', position: 'pos1' },
  { vote: 2, user: 'u4', position: 'pos1' },
  { vote: 1, user: 'u2', position: 'pos2' },
  { vote: 5, user: 'u3', position: 'pos2' },
  { vote: 2, user: 'u2', position: 'pos3' },
  { vote: 4, user: 'u3', position: 'pos3' },
  { vote: 6, user: 'u5', position: 'pos4' },
  { vote: 6, user: 'u6', position: 'pos4' },
  { vote: 7, user: 'u4', position: 'pos5' },
  { vote: 7, user: 'u4', position: 'pos6' }
];

console.log(makeResults(votes, positions, users));

export function useElectionResult(
  electionId: string
): (string[] | ResultsByPosition)[] {
  const { blockchain } = useContext(BlockchainContext);
  const { elections } = useContext(DataContext);
  const { nominations } = elections.find(({ id }) => id === electionId);

  const votesForElection = blockchain
    .filter(
      block => block.vote !== null && block.vote.electionId === electionId
    )
    .map(({ vote }) => vote);

  const positions = Object.keys(nominations);
  const nominees = Object.values(nominations).flat();

  const votesByNominee = Object.values(nominations)
    .map((nominees, i) => {
      const position = positions[i];
      return nominees.map(nominee => ({
        user: nominee,
        position: position,
        vote: votesForElection.filter(
          vote => vote.to === nominee && vote.position === position
        ).length
      }));
    })
    .flat();

  return makeResults(votesByNominee, positions, nominees);
}
