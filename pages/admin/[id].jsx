import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import DataContext from '../../api/DataProvider';
import { useElectionResult } from '../../api/useResults';
import AdminLayout from '../../layouts/AdminLayout';

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const { elections } = useContext(DataContext);
  const { name } = elections.find(election => election.id === id);

  const [results, positionsOnHold] = useElectionResult(id);

  return (
    <AdminLayout
      title={name}
      menuItems={
        <Link href="/admin">
          <a className="text-white bg-purple-600 cursor-pointer hover:bg-purple-500 text-sm font-bold py-2 px-4 rounded focus:outline-none">
            All Elections
          </a>
        </Link>
      }
    >
      {positionsOnHold.length > 0 ? (
        <h1>Resolve Hold</h1>
      ) : (
        <h1>Show Results</h1>
      )}
    </AdminLayout>
  );
};

export default Page;
