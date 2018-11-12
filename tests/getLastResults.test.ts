import {
  getLastResults,
} from '../src/getLastResults';

import {
  readFileSync,
} from 'fs';
jest.mock('fs');
import {
  isValidLastResults,
} from '../src/TypeGuards/isValidLastResults';
jest.mock('../src/TypeGuards/isValidLastResults');

describe('getLastResults unit tests.', () => {
  beforeEach(() => {
    (readFileSync as any).mockClear();
    (readFileSync as any).mockReturnValue();
    (isValidLastResults as any).mockClear();
    (isValidLastResults as any).mockReturnValue(true);
  })
  
  it('Reads from a file called "uuid".', () => {
    getLastResults();
    expect(/uuid$/.test((readFileSync as any).mock.calls[0][0])).toBe(true);
  });

  it('Returns an empty object if isValidLastResults returns false.', () => {
    (isValidLastResults as any).mockReturnValue(false);
    expect(getLastResults()).toEqual({});
  });

  it('Returns the object serialized to the uuid file if isValidLastResults returns true.', () => {
    (readFileSync as any).mockReturnValue('{ "foo": "bar" }');
    expect(getLastResults()).toEqual({
      foo: 'bar',
    });
  });

  it('Returns the lastResults value if it has already been generated.', () => {
    expect(getLastResults()).toEqual({
      foo: 'bar',
    });
  });
});
