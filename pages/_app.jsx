/**
 * A custom app component is being used to
 * - Including the css file
 * - Wrap the entire app with context providers
 */

import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';

import { DataProvider } from '../api/DataProvider';

import '../styles/main.css';

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Head>
          <link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
        </Head>
        <DataProvider>
          <Component {...pageProps} />
        </DataProvider>
      </Container>
    );
  }
}
