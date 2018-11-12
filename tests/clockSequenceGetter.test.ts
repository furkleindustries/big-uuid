import {
  clockSequenceGetter,
} from '../src/clockSequenceGetter';
import {
  strings,
} from '../src/strings';
import {
  UUIDVersions,
} from '../src/Enums/UUIDVersions';

import {
  convertBinStrToUint8Array,
} from '../src/convertBinStrToUint8Array';
jest.mock('../src/convertBinStrToUint8Array');
import {
  isUUIDVersion,
} from '../src/TypeGuards/isUUIDVersion';
jest.mock('../src/TypeGuards/isUUIDVersion');
import {
  getLastResults,
} from '../src/getLastResults';
jest.mock('../src/getLastResults');
import {
  randomBytesGenerator,
} from '../src/randomBytesGenerator';
jest.mock('../src/randomBytesGenerator');
import {
  uintArrayAsBigNumber,
} from '../src/uintArrayAsBigNumber';
jest.mock('../src/uintArrayAsBigNumber');

describe('clockSequenceGetter tests.', () => {
  beforeEach(() => {
    (convertBinStrToUint8Array as any).mockClear();
    (convertBinStrToUint8Array as any).mockReturnValue(new Uint8Array([ 1, 2, 3, ]));
    (isUUIDVersion as any).mockClear();
    (isUUIDVersion as any).mockReturnValue(true);
    (getLastResults as any).mockClear();
    (getLastResults as any).mockReturnValue(null);
    (randomBytesGenerator as any).mockClear();
    (randomBytesGenerator as any).mockReturnValue(new Uint8Array([ 2, 4, ]));
    (uintArrayAsBigNumber as any).mockClear();
    (uintArrayAsBigNumber as any).mockImplementation(() => 256);
  });

  it('Throws if the version argument does not meet the isUUIDVersion type guard.', () => {
    (isUUIDVersion as any).mockReturnValue(false);
    const func = () => clockSequenceGetter('foo' as any);
    expect(func).toThrow(strings.UUID_VERSION_INVALID);
  });

  it('Gets the clock sequence from the last results if it exists and the version is 1.', () => {
    const obj = {
      BYTES_PER_ELEMENT: 1,
    };

    (getLastResults as any).mockReturnValue({
      clockSequence: obj,
    });

    expect(clockSequenceGetter(UUIDVersions.One)).toBe(obj);
  });

  it('Gets a random clock sequence if the version is 1 and there is no clock sequence last result.', () => {
    (getLastResults as any).mockReturnValue();

    expect(clockSequenceGetter(UUIDVersions.One)).toEqual(new Uint8Array([ 32, 0, ]));
  });

  it('Gets a random clock sequence if the version is 4.', () => {
    (getLastResults as any).mockReturnValue();

    expect(clockSequenceGetter(UUIDVersions.Four)).toEqual(new Uint8Array([ 32, 0, ]));
  });

  it('Throws if the version is 3 and no hash is provided.', () => {
    const func = () => clockSequenceGetter(UUIDVersions.Three);
    expect(func).toThrow(strings.HASH_ARGUMENT_MISSING);
  });

  it('Throws if the version is 5 and no hash is provided.', () => {
    const func = () => clockSequenceGetter(UUIDVersions.Five);
    expect(func).toThrow(strings.HASH_ARGUMENT_MISSING);
  });

  it('Takes the 16, 20 slice from the hash for the clock sequence str.', () => {
    (convertBinStrToUint8Array as any).mockImplementation((aa: any) => aa);
    /* 16, 20 slice is 0x0123. */
    const cs = clockSequenceGetter(UUIDVersions.Three, '0123456789abcdef01234567890');
    /* 0x123 is 0b100100011. This is padded to 14 bits in length. */
    expect(cs).toEqual('00000100100011');
  });

  it('Returns [ 0, 0, ] if the version is nil.', () => {
    expect(clockSequenceGetter(UUIDVersions.Nil)).toEqual(new Uint8Array([ 0, 0, ]));
  });
});
