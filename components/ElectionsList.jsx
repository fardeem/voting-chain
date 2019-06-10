import React from 'react';
import Link from 'next/link';

const ElectionsList = () => (
  <div className="flex mb-4">
    <div className="w-1/2 pr-4">
      <h1 className="text-sm font-bold border-pink-500 border-b-2 pb-1 mb-6 uppercase tracking-wide">
        Voting
      </h1>

      <ul>
        <li className="mb-4">
          <Link href="/elections?id=123">
            <a className="text-xl hover:text-pink-600">
              Toronto Raptors Roster
            </a>
          </Link>

          <p className="italic font-serif text-gray-600">
            Voting closes in 1 day, 53 minutes
          </p>
        </li>
        <li className="mb-4">
          <h2 className="text-xl">Golden State Warriors Roster</h2>
          <p className="italic font-serif text-gray-600">
            Voting closes in 1 day, 53 minutes
          </p>
        </li>
      </ul>
    </div>
    <div className="w-1/2 text-right">
      <h1 className="text-sm font-bold border-pink-500 border-b-2 pb-1 uppercase tracking-wide">
        Nominating
      </h1>

      <div className="empty font-extrabold text-5xl select-none text-gray-300 mt-8">
        Nothing To
        <br /> See Here
      </div>
    </div>
  </div>
);

export default ElectionsList;
