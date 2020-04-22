import * as moment from 'moment';
import { db } from '../firebase/firebaseSetup';

/**
 * FSDoc is the base class for all models representing Firestore Documents
 */
class FSDoc {
  constructor(firebaseDoc, collection) {
    if (!collection || collection.length <= 0) {
      console.log("Error was thrown in FSDOC");
      throw new Error('collection must be a string of at least length 1');
      // TODO: see about checking if it is a valid collection
    }
    this.collection = collection;
    this.doc = null;
    this.updated = {};
    if (firebaseDoc) {
      this.doc = firebaseDoc;
    }
  }

  /**
   * Validates this.updated before submission
   *
   * @throws NotImplementedError
   */
  validate() { // eslint-disable-line class-methods-use-this
    throw new Error('You have to implement the method validate!');
  }

  submit() {
    // Validate is expected to throw an error if it fails
    this.validate();
    console.log("FSDOC submission");
    const data = {};
    Object.keys(this.updated).forEach((key) => {
      const value = this.updated[key];
      // TODO: create Address class
      if (moment.isMoment(value)) {
        data[key] = value.format('X');
      } else {
        data[key] = value;
      }
    });

    if (!this.doc) {
      const promise = db.collection(this.collection).add(data)
        .then((docRef) => {
          docRef.get().then((doc) => {
            this.doc = doc;
          });
        });
      this.updated = {};
      return promise;
    }
    const promise = this.doc.update(data)
      .then(() => {
        this.doc = this.doc.ref.get().then((doc) => {
          this.doc = doc;
        });
      });
    this.updated = {};

    return promise;
  }
}

export default FSDoc;
