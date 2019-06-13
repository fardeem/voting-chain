import React, { useContext } from 'react';
import Head from 'next/head';

import DataProvider from '../api/DataProvider';

const ElectionsTitle = ({ electionId }) => {
  const { elections } = useContext(DataProvider);
  let title = 'All elections';
  let subtitle = '';

  if (electionId && elections) {
    const { name, status } = elections.find(e => e.id === electionId);

    title = name;

    if (status === 'voting') subtitle = 'Vote candidates';
    else if (status === 'nominating') subtitle = 'nominate candidates';
    else subtitle = 'See results';

    subtitle += ' for the election';
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <div className="text-center text-white mt-12">
        <p className="uppercase tracking-widest text-xs">&nbsp;{subtitle}</p>
        <h1 className="text-6xl font-light">{title}</h1>
      </div>
    </>
  );
};

export default ElectionsTitle;
