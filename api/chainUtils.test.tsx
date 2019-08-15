import { getLongestChain, sortBlockchain } from './chainUtils';

test('Find longest chain in blockchain', () => {
  const chain = [
    { hash: '1', previousHash: '0' },
    { hash: '2', previousHash: '1' },
    { hash: '3', previousHash: '2' },
    { hash: '4', previousHash: '3' },
    { hash: '5', previousHash: '3' },
    { hash: '6', previousHash: '5' },
    { hash: '9', previousHash: '6' },
    { hash: '7', previousHash: '5' },
    { hash: '8', previousHash: '7' }
  ];

  const result = [
    { hash: '9', previousHash: '6' },
    { hash: '6', previousHash: '5' },
    { hash: '5', previousHash: '3' },
    { hash: '3', previousHash: '2' },
    { hash: '2', previousHash: '1' },
    { hash: '1', previousHash: '0' }
  ];

  expect(
    // @ts-ignore
    getLongestChain(chain)
  ).toEqual(result);
});

test('Blockchain is sorted properly', () => {
  var chain = [
    { hash: '1', previousHash: '0' },
    { hash: '4', previousHash: '3' },
    { hash: '3', previousHash: '2' },
    { hash: '8', previousHash: '7' },
    { hash: '5', previousHash: '4' },
    { hash: '7', previousHash: '6' },
    { hash: '6', previousHash: '5' },
    { hash: '2', previousHash: '1' }
  ];

  const sorted = [
    { hash: '1', previousHash: '0' },
    { hash: '2', previousHash: '1' },
    { hash: '3', previousHash: '2' },
    { hash: '4', previousHash: '3' },
    { hash: '5', previousHash: '4' },
    { hash: '6', previousHash: '5' },
    { hash: '7', previousHash: '6' },
    { hash: '8', previousHash: '7' }
  ];

  expect(
    // @ts-ignore
    sortBlockchain(chain)
  ).toEqual(sorted);
});
