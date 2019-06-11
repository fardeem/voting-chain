import React, { useContext } from 'react';
import Link from 'next/link';
import Router from 'next/router';

import { auth } from '../api/firebase';
import DataContext from '../api/DataProvider';

const ElectionsNav = () => {
  const { currentUser } = useContext(DataContext);
  return (
    <div className="flex justify-between">
      <nav>
        <Link href="/elections">
          <a className="text-gray-300 hover:text-white text-sm uppercase font-bold tracking-wider">
            All Elections
          </a>
        </Link>
      </nav>

      <div className="accounts flex items-center">
        <p className=" text-gray-100 mr-4 tracking-wide">
          {currentUser.name ? currentUser.name : null}
        </p>
        <button
          onClick={() => {
            auth.signOut();
            Router.push('/');
          }}
          className="bg-pink-500 cursor-pointer hover:bg-pink-600 text-sm font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ElectionsNav;
