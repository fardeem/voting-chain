import React, { useState, useContext } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';

import firebase, { auth, handleAuthError } from '../api/firebase';
import ElectionsNav from '../components/ElectionsNav';
import Loading from '../components/Loading';

const Profile = () => {
  const [currentPass, setCurrentPass] = useState('');
  const [pass, setPass] = useState('');

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');


  function handleSubmit(e) {
    e.preventDefault();
    NProgress.start();

    auth.currentUser
      .reauthenticateWithCredential(
        firebase.auth.EmailAuthProvider.credential(
          auth.currentUser.email,
          currentPass
        )
      )
      .then(() => auth.currentUser.updatePassword(pass))
      .then(() => {
        setError('');
        setCurrentPass('');
        setPass('');
        setSuccess('Password updated successfully!');
        NProgress.done();
      })
      .catch(err => {
        console.log(err);
        NProgress.done();
        setError(handleAuthError(err.code));
      });
  }

  return (
    <main className="min-h-screen bg-pattern">
      <Head>
        <title>Profile</title>
      </Head>

      <header>
        <div className="w-full max-w-4xl mx-auto px-8 pt-6 pb-4 mb-6">
          <ElectionsNav />

          <div className="text-center text-white mt-10">
            <h1 className="text-6xl font-light">Your Profile</h1>
          </div>
        </div>
      </header>

      <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-12">
        <h1 className="text-xl mb-6 font-bold">Reset Password</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Current Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              value={currentPass}
              onChange={e => setCurrentPass(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              New Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <p className="text-green-500 text-xs italic mb-2">{success}</p>

          <p className="text-red-500 text-xs italic mb-2">{error}</p>

          <button className="shadow flex-shrink-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Submit
          </button>
        </form>
      </div>
    </main>
  );
};

export default Profile;
