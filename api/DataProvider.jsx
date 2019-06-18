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

import React, { Component, createContext } from 'react';

import { db, auth } from './firebase';
import Loading from '../components/Loading';

const DataContext = createContext({
  elections: [],
  users: [],
  currentUser: {}
});

export class DataProvider extends Component {
  state = {
    elections: [],
    users: [],
    currentUser: {},
    authLoaded: false,
    usersLoaded: false,
    electionsLoaded: false
  };

  electionUnsubscriber = function() {};
  userUnsubscriber = function() {};
  currentUserUnsubscriber = function() {};

  subscribeToElections = () => {
    this.electionUnsubscriber = db
      .collection('elections')
      .onSnapshot(querySnapshot => {
        const elections = [];

        querySnapshot.forEach(doc => {
          elections.push(formatElectionDoc({ id: doc.id, ...doc.data() }));
        });

        this.setState({ elections, electionsLoaded: true });
      });
  };

  subscribeToUsers = () => {
    this.userUnsubscriber = db.collection('users').onSnapshot(querySnapshot => {
      const users = [];

      querySnapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));

      const { currentUser } = this.state;
      if (currentUser) {
        this.setState({
          currentUser: users.find(user => user.id === currentUser.id)
        });
      }

      this.setState({ users, usersLoaded: true });
    });
  };

  componentDidMount = () => {
    this.currentUserUnsubscriber = auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          currentUser: { id: user.uid },
          electionsLoaded: false,
          usersLoaded: false
        });
        this.subscribeToElections();
        this.subscribeToUsers();
      } else {
        this.setState({
          currentUser: null,
          users: [],
          elections: [],
          electionsLoaded: true,
          usersLoaded: true
        });
      }

      this.setState({ authLoaded: true });
    });
  };

  componentWillUnmount = () => {
    this.electionUnsubscriber();
    this.userUnsubscriber();
    this.currentUserUnsubscriber();
  };

  render() {
    const {
      elections,
      users,
      currentUser,
      authLoaded,
      usersLoaded,
      electionsLoaded
    } = this.state;

    return (
      <DataContext.Provider value={{ elections, users, currentUser }}>
        {authLoaded && usersLoaded && electionsLoaded ? (
          this.props.children
        ) : (
          <Loading />
        )}
      </DataContext.Provider>
    );
  }
}

/**
 * @param {{ [x: string]: any; id?: string; start?: any; end?: any; }} doc
 */
function formatElectionDoc(doc) {
  const { start, end, ...rest } = doc;

  const startTime = start.toDate();
  const endTime = end.toDate();
  const now = new Date();

  let status;

  if (now < startTime) status = 'nominating';
  else if (now > startTime && now < endTime) status = 'voting';
  else status = 'done';

  return {
    start: startTime,
    end: endTime,
    ...rest,
    status
  };
}

export default DataContext;
