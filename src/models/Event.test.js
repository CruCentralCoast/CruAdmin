import moment from 'moment';
import firebase from '@firebase/testing';
import Event from './Event';
import { db } from '../firebase/firebaseSetup';

let testEvent;

describe('Testing New testEvent', () => {
  // Initialize firebase emulator for Events
  beforeAll(() => db.collection('events').add({}));

  // Individual test setup
  beforeEach(() => {
    testEvent = new Event();
  });

  // Testing Event Name
  test('Test setting and getting name', () => {
    expect(testEvent.name).toBe('');
    testEvent.name = 'test';
    expect(testEvent.name).toBe('test');
  });

  // Testing Event Description
  test('Test setting and getting description', () => {
    expect(testEvent.description).toBe('');
    testEvent.description = 'test';
    expect(testEvent.description).toBe('test');
  });

  // Testing Event ImageURL
  test('Test setting and getting imageUrl', () => {
    expect(testEvent.imageUrl).toBe('');
    testEvent.imageUrl = 'test';
    expect(testEvent.imageUrl).toBe('test');
  });

  // Testing Event Start
  test('getting empty start', () => {
    expect(testEvent.start).toBeNull();
  });

  test('Test setting non Moment start', () => {
    expect(() => { testEvent.start = 'test'; }).toThrow('start must be a moment object');
  });

  test('Test setting start after end', () => {
    testEvent.end = moment().add(1, 'minutes'); // end must be in the future
    const start = moment().add(2, 'hours');
    expect(() => { testEvent.start = start; }).toThrow('start must be before end');
  });

  test('Test setting valid start', () => {
    testEvent.start = moment();
    testEvent.end = moment().add(2, 'hours');
    expect(testEvent.start.isBefore(testEvent.end)).toBeTruthy();
  });

  // Testing Event End
  test('getting empty end', () => {
    expect(testEvent.end).toBeNull();
  });

  test('Test setting non Moment end', () => {
    expect(() => { testEvent.end = 'test'; }).toThrow('end must be a moment object');
  });

  test('Test for end not in future', () => {
    expect(() => { testEvent.end = moment(); }).toThrow('end must be in the future');
  });

  test('Test setting end before start', () => {
    testEvent.start = moment().add(2, 'hours');
    const end = moment().add(1, 'minutes');
    expect(() => { testEvent.end = end; }).toThrow('end must be after start');
  });

  // Test Event Location TBD
  test('Test setting and getting location TBD', () => {
    expect(testEvent.locationTBD).toBe(false);
    testEvent.locationTBD = true;
    expect(testEvent.locationTBD).toBe(true);
  });

  test('Test updating location TBD', () => {
    testEvent.locationName = 'test';
    testEvent.locationTBD = true;
    expect(testEvent.locationTBD).toBe(true);
    expect(testEvent.locationName).toBe('');
  });

  // Test Event Location Name
  test('Test setting and getting locationName', () => {
    expect(testEvent.locationName).toBe('');
    testEvent.locationName = 'test';
    expect(testEvent.locationName).toBe('test');
  });

  // TODO: Test Event Address

  // TODO: Test Event Movements


  // Test Event URL
  test('Test setting and getting url', () => {
    expect(testEvent.url).toBe('');
    testEvent.url = 'test';
    expect(testEvent.url).toBe('test');
  });
});

describe('Testing Event from Firebase', () => {
  // Initialize firebase emulator for Events
  beforeAll(
    // TODO: clear events
    () => db.collection('events').add({
      name: 'Test Event',
      description: 'This describes an event for testing',
      imageUrl: '',
      startDate: moment('2013-02-08 09:30:26.123').unix(),
      endDate: moment('2013-02-08 10:30:26.123').unix(),
      location: {
        tbd: false,
        name: 'Cal Poly',
        address: {
          line1: '1 Grand Ave',
          line2: 'bld. 14',
          city: 'San Luis Obispo',
          state: 'CA',
          zip: '93405',
        },
        lat: '',
        lng: '',
      },
      movements: null,
      url: 'test.dev',
    }),
  );

  // Test load from doc
  test('Test loading from doc', () => db.collection('events').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      testEvent = new Event(doc);

      const start = moment('2013-02-08 09:30:26.123');
      const end = moment('2013-02-08 10:30:26.123');

      expect(testEvent.name).toBe('Test Event');
      expect(testEvent.description).toBe('This describes an event for testing');
      expect(testEvent.start.unix()).toBe(start.unix());
      expect(testEvent.end.unix()).toBe(end.unix());
      expect(testEvent.locationTBD).toBe(false);
      expect(testEvent.locationName).toBe('Cal Poly');
      expect(testEvent.address).toEqual({
        line1: '1 Grand Ave',
        line2: 'bld. 14',
        city: 'San Luis Obispo',
        state: 'CA',
        zip: '93405',
      });
      expect(testEvent.url).toBe('test.dev');
    });
  }));
});
