import { useContext } from 'react';
import { makeResults, ResultsByPosition } from './makeResults';
import BlockchainContext from './blockchain';
import DataContext from './DataProvider';

export function useElectionResult(electionId: string) {
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
