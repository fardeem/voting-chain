import React, { Component } from 'react';
import Head from 'next/head';
import NProgress from 'nprogress';

class Loading extends Component {
  componentDidMount = () => {
    NProgress.start();
  };

  componentWillUnmount = () => {
    NProgress.done();
  };

  render() {
    return (
      <>
        <Head>
          <title>Loading</title>
        </Head>
        <div className="w-full h-screen bg-pattern flex justify-center items-center">
          <span className="text-white text-4xl uppercase tracking-widest font-extrabold">
            Loading
          </span>
        </div>
      </>
    );
  }
}

export default Loading;
