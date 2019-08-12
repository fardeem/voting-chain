/**
 * Renders the forgot password page
 *
 * Takes an email input, calls the firebase auth api and sends a reset link.
 * Actual resetting of the password works through the default firebase ui.
 *
 * The component has states:
 * - email: to keep track of the email
 * - error: for error messages
 * - success: for success messages
 */

import React, { useState } from 'react';
import NProgress from 'nprogress';
import Head from 'next/head';

import AccountsLayout from '../layouts/accountsLayout';
import { auth, handleAuthError } from '../api/firebase';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    NProgress.start();

    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        setSuccess('Email sent! Please check your inbox.');
        NProgress.done();
      })
      .catch(({ code }) => {
        NProgress.done();
        setError(handleAuthError(code));
      });
  }

  return (
    <AccountsLayout>
      <Head>
        <title>Forgot Password</title>
      </Head>

      <form onSubmit={handleSubmit}>
        <h1 className="text-4xl mb-6 font-bold">Reset Password</h1>

        <label className="block mb-8">
          <span className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </span>
          <input
            type="email"
            onChange={({ target }) => setEmail(target.value)}
            value={email}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>

        {success.length !== 0 && (
          <p className="text-green-500 text-xs italic mb-2">{success}</p>
        )}

        {error.length !== 0 && (
          <p className="text-red-500 text-xs italic mb-2">{error}</p>
        )}

        <div className="flex items-center justify-between">
          <input
            className="bg-pink-500 hover:bg-pink-700 cursor-pointer text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            value="Submit"
          />

          <a
            href="/"
            className="block align-baseline font-bold text-sm text-pink-500 hover:text-pink-800"
          >
            Login
          </a>
        </div>
      </form>
    </AccountsLayout>
  );
};

export default ForgotPassword;
