import React, { useEffect } from 'react';
import Head from 'next/head';
import NProgress from 'nprogress';

let timeout;

const Loading = () => {
  useEffect(() => {
    if (timeout) clearTimeout(timeout);
    NProgress.start();

    return () => {
      timeout = setTimeout(() => {
        NProgress.done();
      }, 1000);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Loading</title>
      </Head>

      <div className="w-full h-screen bg-pattern flex justify-center items-center">
        <img src="/static/logo.png" className="max-w-sm" alt="Logo" />
      </div>
    </>
  );
};

export default Loading;
