import React, { useContext } from 'react';
import Link from 'next/link';
import Router from 'next/router';

import { auth } from '../api/firebase';
import DataContext from '../api/DataProvider';

const ElectionsNav = () => {
  const { currentUser } = useContext(DataContext);
  return (
    <div className="flex justify-between">
      <nav className="flex items-center">
        <Link href="/elections">
          <a className="text-gray-300 hover:text-white text-sm uppercase font-bold tracking-wider">
            All Elections
          </a>
        </Link>
      </nav>

      <div className="accounts flex items-center">
        <Link href="/profile">
          <a className="mr-4 text-gray-300 hover:text-white text-sm font-bold tracking-wider">
            {currentUser.name ? currentUser.name : null}
          </a>
        </Link>

        <button
          onClick={() => auth.signOut()}
          className="text-white bg-purple-600 cursor-pointer hover:bg-purple-500 text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ElectionsNav;
