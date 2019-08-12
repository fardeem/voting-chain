import React from 'react';

import BlockList from '../components/BlockList';
import ElectionsLayout from '../layouts/ElectionsLayout';

const Blockchain = () => {
  return (
    <ElectionsLayout title="Blockchain">
      <BlockList />
    </ElectionsLayout>
  );
};

export default Blockchain;
