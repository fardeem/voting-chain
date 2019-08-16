/**
 * A custom app component is being used to
 * - Including the css file
 * - Wrap the entire app with context providers
 */

import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import NProgress from 'nprogress';
import Router from 'next/router';

import { DataProvider } from '../api/DataProvider';
import { BlockchainProvider } from '../api/blockchain';

import '../styles/main.css';

export default class MyApp extends App {
  static defaultProps = {
    showAfterMs: 300,
    spinner: true
  };

  /** @type {NodeJS.Timeout} */
  timer = null;

  routeChangeStart = () => {
    const { showAfterMs } = this.props;
    clearTimeout(this.timer);
    this.timer = setTimeout(NProgress.start, showAfterMs);
  };

  routeChangeEnd = () => {
    clearTimeout(this.timer);
    NProgress.done();
  };

  componentDidMount() {
    const { options } = this.props;

    if (options) {
      NProgress.configure(options);
    }

    Router.events.on('routeChangeStart', this.routeChangeStart);
    Router.events.on('routeChangeComplete', this.routeChangeEnd);
    Router.events.on('routeChangeError', this.routeChangeEnd);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    Router.events.off('routeChangeStart', this.routeChangeStart);
    Router.events.off('routeChangeComplete', this.routeChangeEnd);
    Router.events.off('routeChangeError', this.routeChangeEnd);
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Head>
          <link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
        </Head>
        <DataProvider>
          <BlockchainProvider>
            <Component {...pageProps} />
          </BlockchainProvider>
        </DataProvider>
      </Container>
    );
  }
}
