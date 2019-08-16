import React, { createContext, useState, useEffect } from 'react';

import { db, auth } from './firebase';
import Loading from '../components/Loading';

export interface Election {
  id: string;
  name: string;
  status: 'NOMINATING' | 'VOTING' | 'DONE';
  end: Date;
  start: Date;
  nominations: {
    [key: string]: string[];
  };
  positions: {
    [key: string]: string;
  };
}

export interface User {
  id: string;
  name: string;
  publicKey: string;
  role?: string;
}

interface CurrentUser extends User {
  privateKey: string;
}

interface Context {
  elections: Election[];
  users: User[];
  currentUser: any;
}

const DataContext = createContext<Partial<Context>>({
  elections: [],
  users: [],
  currentUser: null
});

export const DataProvider = ({ children }) => {
  const [elections, setElections] = useState<Array<Election>>([]);
  const [users, setUsers] = useState<Array<User>>([]);
  const [currentUser, setCurrentUser] = useState<Partial<CurrentUser>>({});
  const [authLoaded, setAuthLoaded] = useState(false);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [electionsLoaded, setElectionsLoaded] = useState(false);

  function subscribeToElections() {
    function calcStatus(start: Date, end: Date): String {
      const now = new Date();

      if (now < start) return 'NOMINATING';
      else if (now > start && now < end) return 'VOTING';
      else return 'DONE';
    }

    return db.collection('elections').onSnapshot(querySnapshot => {
      const elections = [];

      querySnapshot.forEach(doc => {
        const { start, end, ...rest } = doc.data();
        const startTime = start.toDate();
        const endTime = end.toDate();

        elections.push({
          id: doc.id,
          start: startTime,
          end: endTime,
          ...rest,
          status: calcStatus(startTime, endTime)
        });
      });

      setElections(elections);
      setElectionsLoaded(true);
    });
  }

  function subscribeToUsers() {
    return db.collection('users').onSnapshot(querySnapshot => {
      const users = [];

      querySnapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
      setUsers(users);
      setUsersLoaded(true);
    });
  }

  useEffect(() => {
    const electionsUnsubscriber = subscribeToElections();
    const usersUnsubscriber = subscribeToUsers();

    const currentUserUnsubscriber = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser({ id: user.uid });
      } else {
        setCurrentUser(null);
        setAuthLoaded(true);
      }
    });

    return () => {
      electionsUnsubscriber();
      usersUnsubscriber();
      currentUserUnsubscriber();
    };
  }, []);

  useEffect(() => {
    if (!currentUser || users.length === 0 || currentUser.privateKey) return;

    db.collection('privateKeys')
      .doc(currentUser.id)
      .get()
      .then(doc => {
        setCurrentUser({
          ...users.find(user => user.id === currentUser.id),
          privateKey: doc.data().key
        });
        setAuthLoaded(true);
      });
  }, [users, currentUser]);

  return (
    <DataContext.Provider value={{ elections, users, currentUser }}>
      {authLoaded && usersLoaded && electionsLoaded ? children : <Loading />}
    </DataContext.Provider>
  );
};

export default DataContext;
