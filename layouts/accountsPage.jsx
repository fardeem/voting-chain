import React from 'react';

const AccountsPage = ({ children }) => (
  <main className="bg-pattern pt-20 pb-4 min-h-screen">
    <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8">
      {children}
    </div>
  </main>
);

export default AccountsPage;
