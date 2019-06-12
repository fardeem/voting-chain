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
    index: 0
  };

  electionUnsubscriber = function() {};
  userUnsubscriber = function() {};
  currentUserUnsubscriber = function() {};

  componentDidMount = () => {
    this.electionUnsubscriber = db
      .collection('elections')
      .onSnapshot(querySnapshot => {
        const elections = [];

        querySnapshot.forEach(doc => {
          elections.push(formatElectionDoc({ id: doc.id, ...doc.data() }));
        });

        this.setState({ elections, index: this.state.index + 1 });
      });

    this.userUnsubscriber = db.collection('users').onSnapshot(querySnapshot => {
      const users = [];

      querySnapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));

      this.setState({ users, index: this.state.index + 1 });

      this.currentUserUnsubscriber = auth.onAuthStateChanged(user => {
        if (user) {
          this.setState({
            currentUser: {
              ...users.find(user => user.id === auth.currentUser.uid)
            }
          });
        } else {
          this.setState({ currentUser: null });
        }

        this.setState({ index: this.state.index + 1 });
      });
    });
  };

  componentWillUnmount = () => {
    this.electionUnsubscriber();
    this.userUnsubscriber();
    this.currentUserUnsubscriber();
  };

  render() {
    const { elections, users, currentUser, index } = this.state;
    return (
      <DataContext.Provider value={{ elections, users, currentUser }}>
        {index >= 3 ? this.props.children : <Loading />}
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
