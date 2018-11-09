import {
  convertBinStrToUint8Array,
} from '../src/convertBinStrToUint8Array';

describe('convertBinStrToUint8Array unit tests.', () => {
  it('Adds each byte to a Uint8Array.', () => {
    expect(convertBinStrToUint8Array('10001000')).toEqual(new Uint8Array([ 136, ]));
  });

  it('Handles multi-byte input.', () => {
    expect(convertBinStrToUint8Array('1000000000000001')).toEqual(new Uint8Array([ 128, 1 ]));
  });
});
