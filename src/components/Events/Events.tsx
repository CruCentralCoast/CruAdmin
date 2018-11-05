import * as React from 'react';
import './Events.css';
import 'react-table/react-table.css'
import Event from './event/Event'
import { db } from '../../firebaseSetup.js';
import ReactTable from 'react-table';
import { Button } from 'react-bootstrap';
import * as moment from 'moment';

class Events extends React.Component <any, any> {
  constructor (props: any) {
    super(props);
    this.state = {
      data: [],
      showEvent: false,
      eventID: "",
    };

    db.collection('events').get().then(function(this: Events, querySnapshot: any) {
      // TODO: add movement filter
      let data: object[]= [];
      querySnapshot.forEach((doc: any) => {
        let info = doc.data();
        data.push({
          id: doc.id,
          name: info.name,
          start: info.startDate.seconds,
          end: info.endDate.seconds,
          location: info.location,
        });
      });
      this.setState({data: data});
    }.bind(this));
  }

  private showEvent(id: string) {
    this.setState({
      showEvent: true,
      eventID: id,
    });
  }

  public render() {

    const columns: object[] = [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Start',
        accessor: 'start',
        Cell: (row: any) => {
          return moment.unix(row.value).format('MMMM Do, YYYY h:mm a')
        },
      },
      {
        Header: 'End',
        accessor: 'end',
        Cell: (row: any) => {
          return moment.unix(row.value).format('MMMM Do, YYYY h:mm a')
        },
      },
      {
        Header: 'Location',
        accessor: 'location',
      },
      {
        Header: 'Edit',
        accessor: 'id',
        Cell: (row: any) => (
          <Button onClick={() => this.showEvent(row.value)}>Edit</Button>
        )
      },
    ];

    return [
      <ReactTable
        data={this.state.data}
        columns={columns}
      />,
      <Event
        show={this.state.showEvent}
        id={this.state.eventID}
        onModalChange={() => this.setState({showEvent: false})}
      />
    ];
  }
}

export default Events;
