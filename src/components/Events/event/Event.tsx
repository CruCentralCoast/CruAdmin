import * as React from 'react';
import './Event.css';
//@ts-ignore
import { db } from '../../../firebaseSetup.js';
import { Modal, Button } from 'react-bootstrap';

class Event extends React.Component <any, any> {
  constructor (props: any) {
    super(props);
    this.state = {
      name: null,
      description: null,
      image: null,
      locationName: null,
      address: {
        line1: null,
        line2: null,
        city: null,
        state: null,
        zip: null,
      },
      movements: [],
      startDate: null,
      endDate: null,
      url: null,
    };
    this.handleClose = this.handleClose.bind(this);
  }

  private fetchData() {
    db.collection('events').doc(this.props.id).get().then(function(this: Event, doc: any) {
      if (doc.exists) {
        let data = doc.data();
        let address = data.address;
        this.setState({
          name: data.name,
          description: data.description,
          image: data.image,
          locationName: data.location,
          address: address,
          movements: [],
          startDate: data.startDate,
          endDate: data.endDate,
          url: data.url,
        })
      }
    }.bind(this));
  }

  public componentDidUpdate(prevProps: any) {
    // Typical usage (don't forget to compare props):
    if (this.props.id !== prevProps.id) {
      this.fetchData();
    }
  }

  private handleClose() {
    this.props.onModalChange();
  }

  public render() {
    return (
      <Modal size='lg' show={this.props.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>

        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={this.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Event;
