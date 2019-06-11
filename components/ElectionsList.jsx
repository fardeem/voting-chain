import React from 'react';
import Link from 'next/link';

const EmptySection = () => (
  <div className="empty font-extrabold text-3xl select-none text-gray-300">
    Nothing To
    <br /> See Here
  </div>
);

const ElectionsList = () => (
  <div className="flex mb-4">
    <div className="w-1/3 mr-4">
      <h1 className="text-sm font-bold border-pink-500 border-b-2 pb-1 mb-6 uppercase tracking-wide">
        Voting
      </h1>

      <ul>
        <li className="mb-4">
          <Link href="/elections?id=123">
            <a className="text-md hover:text-pink-600">
              Toronto Raptors Roster
            </a>
          </Link>

          <p className="italic text-sm font-serif text-gray-600">
            Voting closes in 1 day, 53 minutes
          </p>
        </li>
        <li className="mb-4">
          <h2 className="text-md">Golden State Warriors Roster</h2>
          <p className="italic text-sm font-serif text-gray-600">
            Voting closes in 1 day, 53 minutes
          </p>
        </li>
      </ul>
    </div>
    <div className="w-1/3 mr-4">
      <h1 className="text-sm font-bold border-pink-500 border-b-2 pb-1 mb-6 uppercase tracking-wide">
        Nominating
      </h1>
      <EmptySection />
    </div>

    <div className="w-1/3">
      <h1 className="text-sm font-bold border-pink-500 border-b-2 pb-1 mb-6 uppercase tracking-wide">
        Past Election
      </h1>
      <EmptySection />
    </div>
  </div>
);

export default ElectionsList;
