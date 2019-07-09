import React, { useEffect } from 'react';
import Head from 'next/head';
import NProgress from 'nprogress';

const Loading = () => {
  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  });

  return (
    <>
      <Head>
        <title>Loading</title>
      </Head>

      <div className="w-full h-screen bg-pattern flex justify-center items-center" />
    </>
  );
};

export default Loading;
