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
        startDate: null,
        endDate: null,
        location: {
          tbd: false,
          name: '',
          address: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            zip: '',
          },
          lat: '',
          lng: '',
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
      return moment.unix(this.doc.data().startDate);
    }

    if (this.updated.startDate) {
      return this.updated.startDate;
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
    this.updated.startDate = start;
  }

  get end() {
    if (this.doc) {
      return moment.unix(this.doc.data().endDate);
    }

    if (this.updated.endDate) {
      return this.updated.endDate;
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
    this.updated.endDate = end;
  }

  get locationTBD() {
    if (this.doc) {
      return this.doc.data().location.tbd;
    }

    return this.updated.location.tbd;
  }

  set locationTBD(locationTBD) {
    this.updated.location.tbd = locationTBD;
  }

  get locationName() {
    if (this.doc) {
      // TODO: check for old format and convert
      return this.doc.data().location.name;
    }

    if (this.updated.location.name && !this.locationTBD) {
      return this.updated.location.name;
    }

    return '';
  }

  set locationName(locationName) {
    if (!this.tbd) {
      this.updated.location.name = locationName;
    } else {
      throw new Error("Location Name can't be set when location is TBD.");
    }
  }

  get address() {
    if (this.doc) {
      return this.doc.data().location.address;
    }

    if (this.updated.address && !this.tbd) {
      return this.updated.location.address;
    }

    return {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: '',
    };
  }

  set address(address) {
    // TODO: verify that address isn't missing any fields
    const addressKeys = new Set(['line1', 'line2', 'city', 'state', 'zip']);

    Object.keys(address).forEach((key) => {
      if (!addressKeys.has(key)) {
        throw new Error(`Invalid address field ${key}`);
      }
    });

    // addressKeys.keys().forEach((key) => {
    //   if (!address[key]) {
    //     throw new Error(`Missing address field ${key}`);
    //   }
    // });

    console.log(this);
    if (!this.tbd) {
      this.updated.location.address = address;
    } else {
      throw new Error("Location Address can't be set when location is TBD.");
    }
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

  submit() {
    if (this.updated.location.tbd) {
      this.locationName = '';
      this.address = {
        line1: '',
        line2: '',
        city: '',
        state: '',
        zip: '',
      };
    }

    super.submit();
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
