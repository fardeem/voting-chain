import { makeResults } from './makeResults';

test('makeResults should compute results properly', () => {
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

  const expectedResults = [
    {
      pos1: [{ user: 'u1', vote: 8 }],
      pos2: [{ user: 'u3', vote: 5 }],
      pos3: [{ user: 'u2', vote: 2 }],
      pos4: [{ user: 'u5', vote: 6 }, { user: 'u6', vote: 6 }],
      pos5: [{ user: 'u4', vote: 7 }],
      pos6: [{ user: 'u4', vote: 7 }]
    },
    ['pos5', 'pos6', 'pos4']
  ];

  expect(makeResults(votes, positions, users)).toEqual(expectedResults);
});
