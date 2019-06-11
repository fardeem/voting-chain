import React, { Component, createContext } from 'react';

import { db, auth } from './firebase';

const DataContext = createContext({
  elections: [],
  users: [],
  currentUser: {}
});

export class DataProvider extends Component {
  state = {
    elections: [],
    users: [],
    currentUser: {}
  };

  electionUnsubscriber = function() {};
  userUnsubscriber = function() {};

  componentDidMount = () => {
    this.electionUnsubscriber = db
      .collection('elections')
      .onSnapshot(querySnapshot => {
        const elections = [];

        querySnapshot.forEach(doc => {
          elections.push(formatElectionDoc({ id: doc.id, ...doc.data() }));
        });

        this.setState({ elections });
      });

    this.userUnsubscriber = db.collection('users').onSnapshot(querySnapshot => {
      const users = [];

      querySnapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));

      this.setState({ users });

      this.setState({
        currentUser: {
          ...users.find(user => user.id === auth.currentUser.uid)
        }
      });
    });
  };

  componentWillUnmount = () => {
    this.electionUnsubscriber();
    this.userUnsubscriber();
  };

  render() {
    const { elections, users, currentUser } = this.state;
    return (
      <DataContext.Provider value={{ elections, users, currentUser }}>
        {this.props.children}
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
