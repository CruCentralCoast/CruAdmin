import * as React from 'react';
import './Events.css';
import 'react-table/react-table.css'
import { db } from '../../firebaseSetup.js';
import ReactTable from 'react-table';
import * as moment from 'moment';

class Events extends React.Component <any, any> {
  constructor (props: any) {
    super(props);
    this.state = {
      data: [],
    };

    db.collection('events').get().then(function(this: Events, querySnapshot: any) {
      // TODO: add movement filter
      let data: object[]= [];
      querySnapshot.forEach((doc: any) => {
        let info = doc.data();
        let start = moment.unix(info.startDate.seconds);
        let end = moment.unix(info.endDate.seconds);
        data.push({
          id: doc.id,
          name: info.name,
          start: start.format('MMMM Do, YYYY h:m a'),
          end: end.format('MMMM Do, YYYY h:m a'),
          location: info.location, 
        });
      });
      this.setState({data: data});
    }.bind(this));
  }

  public render() {

    const columns: object[] = [
      {
        Header: 'Name',
        accessor: 'name'
      }, 
      {
        Header: 'Start',
        accessor: 'start'
      }, 
      {
        Header: 'End',
        accessor: 'end'
      }, 
      {
        Header: 'Location',
        accessor: 'location'
      }
    ];

    return (
      <ReactTable
        data={this.state.data}
        columns={columns}
      />
    );
  }
}

export default Events;
