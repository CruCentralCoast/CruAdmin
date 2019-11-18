import moment from 'moment';
import Event from './Event';
import { db } from '../firebase/firebaseSetup';

let testEvent;

describe('Testing New testEvent', () => {
  // Initialize firebase emulator for Events
  beforeAll(() => db.collection('event').add({
    name: 'Los Angeles',
    state: 'CA',
    country: 'USA',
  }));

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
