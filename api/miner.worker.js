import shajs from 'sha.js';

self.addEventListener('message', event => {
  const { vote, previousHash } = event.data;

  let hash = '';
  let nonce = 0;
  const message = JSON.stringify(vote);
  const difficulty = 4;

  while (
    hash.substring(0, difficulty) !==
    [...Array(difficulty)].map(() => '0').join('')
  ) {
    hash = shajs('sha256')
      .update(message + previousHash + String(nonce))
      .digest('hex');
    nonce++;
  }

  self.postMessage({
    hash,
    previousHash,
    nonce,
    vote
  });
});
