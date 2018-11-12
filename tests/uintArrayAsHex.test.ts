import {
  uintArrayAsHex,
} from '../src/uintArrayAsHex';

describe('uintArrayAsHex unit tests.', () => {
  it('Reduces a typed array into a hex string.', () => {
    const arr = new Uint8Array([ 20, 25, 30, 35, 40, 45, ]);
    expect(uintArrayAsHex(arr)).toBe(
      '14' +
      '19' +
      '1e' +
      '23' +
      '28' +
      '2d'
    );
  });
});
