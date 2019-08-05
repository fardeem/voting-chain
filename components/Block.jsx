import React from 'react';

const Block = ({ block }) => {
  return (
    <li className="w-full max-w-md mx-auto bg-white shadow-md rounded py-4 mb-8">
      <p className="font-mono text-sm">Previous Hash: {block.previousHash}</p>
      <p className="font-mono text-sm">Hash: {block.hash}</p>
    </li>
  );
};

export default Block;
