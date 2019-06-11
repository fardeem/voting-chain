import React, { useContext } from 'react';
import Head from 'next/head';

import DataProvider from '../api/DataProvider';

const ElectionsTitle = ({ electionId }) => {
  const { elections } = useContext(DataProvider);

  const headerTitle =
    electionId && elections.length !== 0
      ? elections.find(e => e.id === electionId).name
      : 'All Elections';

  return (
    <>
      <Head>
        <title>{headerTitle}</title>
      </Head>

      <h1 className="text-6xl font-light text-white text-center mt-12">
        {headerTitle}
      </h1>
    </>
  );
};

export default ElectionsTitle;
