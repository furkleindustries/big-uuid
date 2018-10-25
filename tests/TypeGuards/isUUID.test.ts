import {
  isUUID
} from '../../src/TypeGuards/isUUID';

describe('isUUID tests.', () => {
  it('Returns false if the argument is not of type object.', () => {
    expect(isUUID('')).toBe(false);
  });

  it('Returns false if the argument is falsy.', () => {
    expect(isUUID(null)).toBe(false);
  });

  it('Returns false if maybe.version is falsy.', () => {
    expect(isUUID({ version: false, })).toBe(false);
  });

  it('Returns false if maybe.timestamp is falsy.', () => {
    const arg = isUUID({
      version: '1',
      timestamp: false,
    });

    expect(arg).toBe(false);
  });

  it('Returns false if maybe.timestamp is falsy.', () => {
    const arg = isUUID({
      version: '1',
      timestamp: false,
    });

    expect(arg).toBe(false);
  });

  it('Returns false if maybe.timeLow is falsy.', () => {
    const arg = isUUID({
      version: '1',
      timestamp: 23040,
      timeLow: false,
    });

    expect(arg).toBe(false);
  });

  it('Returns false if maybe.timeLow is falsy.', () => {
    const arg = isUUID({
      version: '1',
      timestamp: true,
      timeLow: false,
    });

    expect(arg).toBe(false);
  });

  it('Returns false if maybe.timeMid is falsy.', () => {
    const arg = isUUID({
      version: '1',
      timestamp: true,
      timeLow: true,
      timeMid: false,
    });

    expect(arg).toBe(false);
  });

  it('Returns false if maybe.timeHigh is falsy.', () => {
    const arg = isUUID({
      version: '1',
      timestamp: true,
      timeLow: true,
      timeMid: true,
      timeHigh: false,
    });

    expect(arg).toBe(false);
  });

  it('Returns false if maybe.timeHighAndVersion is falsy.', () => {
    const arg = isUUID({
      version: '1',
      timestamp: true,
      timeLow: true,
      timeMid: true,
      timeHigh: true,
      timeHighAndVersion: false,
    });

    expect(arg).toBe(false);
  });

  it('Returns false if maybe.clockSequence is falsy.', () => {
    const arg = isUUID({
      version: '1',
      timestamp: true,
      timeLow: true,
      timeMid: true,
      timeHigh: true,
      timeHighAndVersion: true,
      clockSequence: false,
    });

    expect(arg).toBe(false);
  });

  it('Returns false if maybe.clockSequenceHighAndReserved is falsy.', () => {
    const arg = isUUID({
      version: '1',
      timestamp: true,
      timeLow: true,
      timeMid: true,
      timeHigh: true,
      timeHighAndVersion: true,
      clockSequence: true,
      clockSequenceHighAndReserved: false,
    });

    expect(arg).toBe(false);
  });

  it('Returns false if maybe.clockSequenceLow is falsy.', () => {
    const arg = isUUID({
      version: '1',
      timestamp: true,
      timeLow: true,
      timeMid: true,
      timeHigh: true,
      timeHighAndVersion: true,
      clockSequence: true,
      clockSequenceHighAndReserved: true,
      clockSequenceLow: false,
    });

    expect(arg).toBe(false);
  });

  it('Returns false if maybe.nodeIdentifier is falsy.', () => {
    const arg = isUUID({
      version: '1',
      timestamp: true,
      timeLow: true,
      timeMid: true,
      timeHigh: true,
      timeHighAndVersion: true,
      clockSequence: true,
      clockSequenceHighAndReserved: true,
      clockSequenceLow: true,
      nodeIdentifier: false,
    });

    expect(arg).toBe(false);
  });

  it('Returns false if maybe.toString is not a function.', () => {
    const arg = isUUID({
      version: '1',
      timestamp: true,
      timeLow: true,
      timeMid: true,
      timeHigh: true,
      timeHighAndVersion: true,
      clockSequence: true,
      clockSequenceHighAndReserved: true,
      clockSequenceLow: true,
      nodeIdentifier: true,
      toString: null,
    });

    expect(arg).toBe(false);
  });

  it('Returns false if maybe.toString is not a function.', () => {
    const arg = isUUID({
      version: '1',
      timestamp: true,
      timeLow: true,
      timeMid: true,
      timeHigh: true,
      timeHighAndVersion: true,
      clockSequence: true,
      clockSequenceHighAndReserved: true,
      clockSequenceLow: true,
      nodeIdentifier: true,
      toString: null,
    });

    expect(arg).toBe(false);
  });

  it('Returns true if the argument is properly constructed.', () => {
    const arg = isUUID({
      version: '1',
      timestamp: true,
      timeLow: true,
      timeMid: true,
      timeHigh: true,
      timeHighAndVersion: true,
      clockSequence: true,
      clockSequenceHighAndReserved: true,
      clockSequenceLow: true,
      nodeIdentifier: true,
      toString: () => {},
    });

    expect(arg).toBe(true);
  });
});
