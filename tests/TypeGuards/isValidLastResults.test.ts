import {
  isValidLastResults,
} from '../../src/TypeGuards/isValidLastResults';

describe('isValidLastResults tests.', () => {
  it('Returns false if the argument is not of type object.', () => {
    expect(isValidLastResults('')).toBe(false);
  });

  it('Returns false if the argument is falsy.', () => {
    expect(isValidLastResults(null)).toBe(false);
  });

  it('Returns false if maybe.clockSequence is not an array.', () => {
    const arg = {
      clockSequence: false,
    };

    expect(isValidLastResults(arg)).toBe(false);
  });

  it('Returns false if maybe.clockSequence does not have two elements.', () => {
    const arg = {
      clockSequence: [],
    };

    expect(isValidLastResults(arg)).toBe(false);
  });

  it('Returns false if maybe.nodeIdentifier is not an array.', () => {
    const arg = {
      clockSequence: [ 1, 2, ],
      nodeIdentifier: false,
    };

    expect(isValidLastResults(arg)).toBe(false);
  });

  it('Returns false if maybe.nodeIdentifier does not have eight elements.', () => {
    const arg = {
      clockSequence: [ 1, 2, ],
      nodeIdentifier: [],
    };

    expect(isValidLastResults(arg)).toBe(false);
  });

  it('Returns false if maybe.nodeIdentifier is not an array.', () => {
    const arg = {
      clockSequence: [ 1, 2, ],
      nodeIdentifier: false,
    };

    expect(isValidLastResults(arg)).toBe(false);
  });

  it('Returns false if maybe.timestamp is not an array.', () => {
    const arg = {
      clockSequence: [ 1, 2, ],
      nodeIdentifier: [ 1, 2, 3, 4, 5, 6, 7, 8, ],
      timestamp: false,
    };

    expect(isValidLastResults(arg)).toBe(false);
  });

  it('Returns false if maybe.timestamp does not have 6 elements.', () => {
    const arg = {
      clockSequence: [ 1, 2, ],
      nodeIdentifier: [ 1, 2, 3, 4, 5, 6, 7, 8, ],
      timestamp: [],
    };

    expect(isValidLastResults(arg)).toBe(false);
  });

  it('Returns true if the argument is properly constructed.', () => {
    const arg = {
      clockSequence: [ 1, 2, ],
      nodeIdentifier: [ 1, 2, 3, 4, 5, 6, 7, 8, ],
      timestamp: [ 1, 2, 3, 4, 5, 6, ],
    };

    expect(isValidLastResults(arg)).toBe(true);
  });
});
