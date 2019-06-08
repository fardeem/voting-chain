/**
 * Renders the account login, sign up form.
 *
 * Depending on the context(login or signup), the appropriate firebase api call is made.
 *
 * The following states are used:
 * - name, email, password
 * - isSigningUp: to track the context of the form
 * - error: to manage error and display error messages
 */

import React, { useState } from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';

import { auth, db } from '../api/firebase';

const AccountsForm = ({}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    NProgress.start();

    const done = () => {
      NProgress.done();
      Router.push('/elections');
    };

    const error = ({ code }) => {
      setError(auth.handleError(code));
      NProgress.done();
    };

    if (isSigningUp) {
      // Sign Up
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(res => {
          return db
            .collection('users')
            .doc(res.user.uid)
            .set({
              name: name
            });
        })
        .then(done)
        .catch(error);
    } else {
      // Login
      auth
        .signInWithEmailAndPassword(email, password)
        .then(done)
        .catch(error);
    }

    console.log(email, password);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-4xl font-bold mb-6">
        {isSigningUp ? 'Sign Up' : 'Login'}
      </h1>

      {isSigningUp ? (
        <label className="block mb-4">
          <span className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </span>
          <input
            type="text"
            onChange={({ target }) => setName(target.value)}
            value={name}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
      ) : null}

      <label className="block mb-4">
        <span className="block text-gray-700 text-sm font-bold mb-2">
          Email
        </span>
        <input
          type="email"
          onChange={({ target }) => setEmail(target.value)}
          value={email}
          autoComplete="email"
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </label>

      <label className="block mb-6">
        <span className="block text-gray-700 text-sm font-bold mb-2">
          Password
        </span>
        <input
          type="password"
          onChange={({ target }) => setPassword(target.value)}
          value={password}
          autoComplete="current-password"
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </label>

      {error.length !== 0 ? (
        <p className="text-red-500 text-xs italic mb-2">{error}</p>
      ) : null}

      <div className="flex items-center justify-between">
        <input
          className="bg-pink-500 cursor-pointer hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          value={isSigningUp ? 'Sign Up' : 'Sign In'}
        />

        <div className="text-right">
          <button
            className="inline-block align-baseline font-bold text-sm text-pink-500 hover:text-pink-800"
            onClick={() => setIsSigningUp(!isSigningUp)}
            type="button"
          >
            {isSigningUp ? 'Login' : 'Create account'}
          </button>

          {!isSigningUp ? (
            <a
              href="/forgot-password"
              className="block align-baseline font-bold text-sm text-pink-500 hover:text-pink-800"
            >
              Forgot password?
            </a>
          ) : null}
        </div>
      </div>
    </form>
  );
};

export default AccountsForm;
