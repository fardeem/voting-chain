const positions = ['pos1', 'pos2', 'pos3', 'pos4', 'pos5', 'pos6'];
const users = ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'];

/*
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

const results = {
  u1: { vote: 0, positions: [] },
  u2: { vote: 0, positions: [] },
  u3: { vote: 0, positions: [] },
  u4: { vote: 0, positions: [] },
  u5: { vote: 0, positions: [] },
  u6: { vote: 0, positions: [] }
};
*/

const votes = [
  {
    vote: 10,
    user: 'u1',
    position: 'pos1'
  },
  {
    vote: 8,
    user: 'u2',
    position: 'pos1'
  },
  {
    vote: 3,
    user: 'u1',
    position: 'pos2'
  },
  {
    vote: 2,
    user: 'u2',
    position: 'pos2'
  },
  {
    vote: 7,
    user: 'u1',
    position: 'pos3'
  },
  {
    vote: 5,
    user: 'u2',
    position: 'pos3'
  },
  {
    vote: 4,
    user: 'u2',
    position: 'pos4'
  },
  {
    vote: 1,
    user: 'u1',
    position: 'pos5'
  },
  {
    vote: 1,
    user: 'u2',
    position: 'pos5'
  }
];

const results = {
  u1: { vote: 0, positions: [] },
  u2: { vote: 0, positions: [] },
  u3: { vote: 0, positions: [] },
  u4: { vote: 0, positions: [] },
  u5: { vote: 0, positions: [] }
};

positions.forEach((position, i) => {
  // get users
  const nominations = votes
    .filter(vote => vote.position === position)
    .sort((a, b) => b.vote - a.vote);

  let highestVote = Math.max(...nominations.map(({ vote }) => vote));

  function updateResults() {
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
  }

  updateResults();
});

console.log(results);

const positionsOnHold = Object.values(results)
  .filter(({ positions }, inde, arr) => {
    if (positions.length > 1) return true;
    if (
      arr
        .filter((_, i) => inde !== i)
        .find(val => val.positions.includes(positions[0]))
    )
      return true;
  })
  .map(val => val.positions)
  .flat();

const positionsHolded = new Set(positionsOnHold);

console.log(positionsHolded);

// const results = {
//   pos1: 'u1',
//   pos2: 'u3',
//   pos3: 'u2',
//   pos4: ['u5', 'u6'],
//   pos5: ['u3'],
//   pos6: ['u3']
// };
