import moment from 'moment';
import FSDoc from './FSDoc';

class EventModel extends FSDoc {
  constructor(firebaseEventDoc) {
    super(firebaseEventDoc, 'events');
    if (this.doc === null) {
      this.updated = {
        name: '',
        description: '',
        imageUrl: '',
        start: null,
        end: null,
        locationName: '',
        address: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          zip: '',
        },
        movements: null,
        url: '',
      };
    }
  }

  get name() {
    if (this.doc) {
      return this.doc.data().name;
    }

    if (this.updated.name) {
      return this.updated.name;
    }

    return '';
  }

  set name(name) {
    this.updated.name = name;
  }

  get description() {
    if (this.doc) {
      return this.doc.data().description;
    }

    if (this.updated.description) {
      return this.updated.description;
    }

    return '';
  }

  set description(description) {
    this.updated.description = description;
  }

  get imageUrl() {
    if (this.doc) {
      return this.doc.data().imageLink;
    }

    if (this.updated.imageLink) {
      return this.updated.imageLink;
    }

    return '';
  }

  set imageUrl(imageUrl) {
    this.updated.imageLink = imageUrl;
  }

  get start() {
    if (this.doc) {
      return moment.unix(this.doc.data().startDate.seconds);
    }

    if (this.updated.start) {
      return this.updated.start;
    }

    return null;
  }

  /**
   * Sets the start datetime of the event
   *
   * @param {Moment} start The start datetime
   *
   * @throws start must be a moment object
   * @throws start must be before end
   */
  set start(start) {
    if (!moment.isMoment(start)) {
      throw new Error('start must be a moment object');
    }
    if (this.end && start.isSameOrAfter(this.end)) {
      throw new Error('start must be before end');
    }
    this.updated.start = start;
  }

  get end() {
    if (this.doc) {
      return moment.unix(this.doc.data().endDate.seconds);
    }

    if (this.updated.end) {
      return this.updated.end;
    }

    return null;
  }

  /**
   * Sets the end datetime of the event
   *
   * @param {Moment} end The end datetime
   *
   * @throws end must be a moment object
   * @throws end must be in the future
   * @throws end must be after start
   */
  set end(end) {
    const now = moment();
    if (!moment.isMoment(end)) {
      throw new Error('end must be a moment object');
    }
    if (now.isSameOrAfter(end)) {
      throw new Error('end must be in the future');
    }
    if (this.start && end.isSameOrBefore(this.start)) {
      throw new Error('end must be after start');
    }
    this.updated.end = end;
  }

  get locationName() {
    if (this.doc) {
      return this.doc.data().location;
    }

    if (this.updated.location) {
      return this.updated.location;
    }

    return '';
  }

  set locationName(locationName) {
    this.updated.location = locationName;
  }

  get address() {
    if (this.doc) {
      return this.doc.data().address;
    }

    if (this.updated.address) {
      return this.updated.address;
    }

    return '';
  }

  set address(address) {
    // TODO: verify that address isn't missing any fields
    const addressKeys = {
      line1: true,
      line2: true,
      city: true,
      state: true,
      zip: true,
    };

    Object.keys(address).forEach((key) => {
      if (!addressKeys[key]) {
        throw new Error(`Invalid address field ${key}`);
      }
    });

    this.updated.address = address;
  }

  get movements() {
    if (this.doc) {
      return this.doc.data().movements;
    }

    if (this.updated.movements) {
      return this.updated.movements;
    }

    return null;
  }

  set movements(movements) {
    // TODO: verify that movements is an array of valid movement references
    this.updated.movements = movements;
  }

  get url() {
    if (this.doc) {
      return this.doc.data().url;
    }

    if (this.updated.url) {
      return this.updated.url;
    }

    return '';
  }

  set url(url) {
    this.updated.url = url;
  }

  fetch() {
    // TODO: update fetch to refresh the doc and clear updated
  }

  delete() {
    // TODO: delete the doc
  }

  validate() {
    // TODO: check that start and end aren't null
  }
}

export default EventModel;
