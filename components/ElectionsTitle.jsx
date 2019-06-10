import React from 'react';
import Head from 'next/head';

const ElectionsTitle = ({ electionId }) => {
  const headerTitle = electionId ? `Election #${electionId}` : 'All Elections';

  return (
    <>
      <Head>
        <title>{headerTitle}</title>
      </Head>

      <div className="text-white text-center mt-12">
        <h1 className="text-6xl font-light">{headerTitle}</h1>
        <h2 className="font-serif italic text-lg text-pink-500">
          6 elections are being voted on. 3 are being nominated.
        </h2>
      </div>
    </>
  );
};

export default ElectionsTitle;
