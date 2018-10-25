import {
  isUUIDOptions,
} from '../../src/TypeGuards/isUUIDOptions';

import {
  isUUIDVersion,
} from '../../src/TypeGuards/isUUIDVersion';
jest.mock('../../src/TypeGuards/isUUIDVersion');

describe('isUUIDOptions tests.', () => {
  beforeEach(() => {
    (isUUIDVersion as any).mockReturnValue(true);
  });

  it('Returns false if the argument is not of type object.', () => {
    expect(isUUIDOptions('')).toBe(false);
  });

  it('Returns false if the argument is falsy.', () => {
    expect(isUUIDOptions(null)).toBe(false);
  });

  it('Returns false if maybe.version does not meet the isUUIDVersion type guard.', () => {
    (isUUIDVersion as any).mockReturnValue(false);
    expect(isUUIDOptions({})).toBe(false);
  });

  it('Returns false if the type of maybe.clockSequenceGetter is not function.', () => {
    const arg = {
      clockSequenceGetter: false,
    };

    expect(isUUIDOptions(arg)).toBe(false);
  });

  it('Returns false if the type of maybe.nodeIdentifierGetter is not function.', () => {
    const arg = {
      clockSequenceGetter: () => {},
      nodeIdentifierGetter: false,
    };

    expect(isUUIDOptions(arg)).toBe(false);
  });

  it('Returns false if the type of maybe.timestampGetter is not function.', () => {
    const arg = {
      clockSequenceGetter: () => {},
      nodeIdentifierGetter: () => {},
      timestampGetter: false,
    };

    expect(isUUIDOptions(arg)).toBe(false);
  });

  it('Returns true if the argument is properly constructed.', () => {
    const arg = {
      clockSequenceGetter: () => {},
      nodeIdentifierGetter: () => {},
      timestampGetter: () => {},
    };

    expect(isUUIDOptions(arg)).toBe(true);
  });
});
