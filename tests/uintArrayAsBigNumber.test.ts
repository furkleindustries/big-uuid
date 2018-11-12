import {
  uintArrayAsBigNumber,
} from '../src/uintArrayAsBigNumber'

import {
  fromArray,
} from 'big-integer';
jest.mock('big-integer');

describe('uintArrayAsBigNumber unit tests.', () => {
  beforeEach(() => {
    (fromArray as any).mockClear();
  });

  it('Calls big-integer.fromArray with the array argument and a base of 256 to create the big number.', () => {
    const arr = new Uint8Array([ 1, 2, 3, ]);
    uintArrayAsBigNumber(arr);
    expect((fromArray as any).mock.calls).toEqual([
      [ Array.from(arr), 256, ],
    ]);
  });

  it('Returns the result of big-integer.fromArray.', () => {
    const ret = [ 56, 57, 58, ];
    (fromArray as any).mockReturnValue(ret);
    expect(uintArrayAsBigNumber([] as any)).toBe(ret);
  });
});
