import React, { useContext } from 'react';

import BlockchainContext from '../api/blockchain';
import { sortBlockchain } from '../api/chainUtils';
import Block from './Block';

const BlockList = () => {
  const { blockchain } = useContext(BlockchainContext);

  return (
    <ol className="pb-8">
      {sortBlockchain(blockchain).map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </ol>
  );
};

export default BlockList;
