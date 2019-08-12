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

export interface ResultsByPosition {
  [key: string]: Winner[];
}

export function makeResults(
  votes: VoteByNominee[],
  positions: string[],
  nominees: string[]
): [ResultsByPosition, string[]] {
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
