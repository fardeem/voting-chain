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
        <div className="w-full h-screen bg-pattern flex justify-center items-center" />
      </>
    );
  }
}

export default Loading;
