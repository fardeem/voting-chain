/**
 * This is a really a complicated React Class so bear with me
 * as I explain to my future self how this works.
 *
 * You might want some coffee ☕️
 *
 * This component is responsible for fetching and storing all
 * the data from firebase. Acts as a global store.
 *
 * On load, it checks if a user is logged in
 *  - (yes): Fetches the list of all users and elections
 *  - (no): Does nothing, literally
 *
 * If would have been pretty simple if this was it, but we have
 * to think about loading.
 *
 * The state stores three things for loading
 *  - authLoaded
 *  - usersLoaded
 *  - electionsLoaded
 *
 * If
 *  - (user not logged in) all of them are set to true
 *  - (user logged in) only authLoaded is set to true
 *
 * When the component is finished data fetching, it sets the
 * corresponding states to true.
 *
 * The component only shows its child components when all
 * loading variables becomes true. Else, it show's a loading screen.
 */

import React, { createContext, useState, useEffect } from 'react';

import { db, auth } from './firebase';
import Loading from '../components/Loading';

const DataContext = createContext({
  elections: [],
  users: [],
  currentUser: {}
});

export const DataProvider = ({ children }) => {
  const [elections, setElections] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [authLoaded, setAuthLoaded] = useState(false);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [electionsLoaded, setElectionsLoaded] = useState(false);

  let electionUnsubscriber = function() {},
    usersUnsubscriber = function() {},
    currentUserUnsubscriber = function() {};

  function subscribeToElections() {
    function calcStatus(start: Date, end: Date): String {
      const now = new Date();

      if (now < start) return 'nominating';
      else if (now > start && now < end) return 'voting';
      else return 'done';
    }

    electionUnsubscriber = db
      .collection('elections')
      .onSnapshot(querySnapshot => {
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

  function subscribeToUsers(currentUserId: String) {
    usersUnsubscriber = db.collection('users').onSnapshot(querySnapshot => {
      const users = [];

      querySnapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));

      setUsers(users);
      setCurrentUser(users.find(user => user.id === currentUserId));
      setUsersLoaded(true);
    });
  }

  useEffect(() => {
    currentUserUnsubscriber = auth.onAuthStateChanged(user => {
      if (user) {
        setElectionsLoaded(false);
        setUsersLoaded(false);

        subscribeToElections();
        subscribeToUsers(user.uid);
      } else {
        setCurrentUser(null);
        setUsers([]);
        setElections([]);
        setElectionsLoaded(true);
        setUsersLoaded(true);
      }

      setAuthLoaded(true);
    });

    return () => {
      electionUnsubscriber();
      usersUnsubscriber();
      currentUserUnsubscriber();
    };
  }, []);

  return (
    <DataContext.Provider value={{ elections, users, currentUser }}>
      {authLoaded && usersLoaded && electionsLoaded ? children : <Loading />}
    </DataContext.Provider>
  );
};

export default DataContext;
