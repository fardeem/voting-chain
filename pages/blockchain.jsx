import React from 'react';
import Head from 'next/head';

import ElectionsNav from '../components/ElectionsNav';
import BlockList from '../components/BlockList';

const Blockchain = () => {
  return (
    <main className="bg-pattern">
      <Head>
        <title>Profile</title>
      </Head>

      <header>
        <div className="w-full max-w-4xl mx-auto px-8 pt-6 pb-4 mb-6">
          <ElectionsNav />

          <div className="text-center text-white mt-10">
            <h1 className="text-6xl font-light leading-none">Blockchain</h1>
          </div>
        </div>
      </header>

      <BlockList />
    </main>
  );
};

export default Blockchain;
