import React from 'react';
import Head from 'next/head';

import ElectionsNav from '../components/ElectionsNav';
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
