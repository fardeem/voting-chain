/**
 * This page shows all the elections.
 * If a election id is passed in, it shows the nomination/voting page accordingly
 */

import React from 'react';
import Router from 'next/router';

import { auth } from '../api/firebase';

export default () => (
  <div>
    <button
      className="bg-blue-400 text-white p-4"
      onClick={() => {
        auth.signOut();
        Router.push('/');
      }}
    >
      Sign Out
    </button>
  </div>
);
