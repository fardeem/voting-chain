import React, { useContext } from 'react';
import BlockchainContext from '../api/blockchain';

export default () => {
  const { peersCount } = useContext(BlockchainContext);
  return (
    <>
      <style jsx>
        {`
          div {
            bottom: 30px;
            left: 25px;
            transition: background-color 0.5s;
          }
        `}
      </style>
      <div
        className={`bg-white fixed transition-opacity shadow-lg z-10 p-2 font-mono text-xs rounded ${peersCount >
          0 && 'bg-green-500 text-white opacity-100'} `}
      >
        {peersCount} Connected Peer{(peersCount === 0 || peersCount > 1) && 's'}
      </div>
    </>
  );
};
