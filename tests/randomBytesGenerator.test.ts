import {
  randomBytesGenerator,
} from '../src/randomBytesGenerator';

import {
  isNode,
} from '../src/isNode';
jest.mock('../src/isNode');
import {
  randomBytes,
} from 'crypto';
jest.mock('crypto');

describe('randomBytesGenerator unit tests.', () => {
  beforeEach(() => {
    (isNode as any).mockReturnValue(true);
    (randomBytes as any).mockReturnValue([ 1, 2, 3, 4, ]);
  });

  it('Calls randomBytes if isNode returns true.', () => {
    const size = 10;
    randomBytesGenerator(size);
    expect((randomBytes as any).mock.calls).toEqual([
      [ size, ],
    ]);
  });

  it('Calls window.crypto.getRandomValues if isNode returns false.', () => {
    const oldCrypto = (global as any).window.crypto;
    const getRandomValues = jest.fn();
    (global as any).window.crypto = {
      getRandomValues,
    };

    (isNode as any).mockReturnValue(false);

    randomBytesGenerator(10);
    expect(getRandomValues).toBeCalledTimes(1);

    (global as any).window.crypto = oldCrypto;
  });
});
