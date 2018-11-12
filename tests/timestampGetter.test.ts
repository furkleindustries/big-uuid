import {
  strings,
} from '../src/strings';
import {
  timestampGetter,
} from '../src/timestampGetter';
import {
  UUIDVersions,
} from '../src/Enums/UUIDVersions';

import {
  convertBinStrToUint8Array,
} from '../src/convertBinStrToUint8Array';
jest.mock('../src/convertBinStrToUint8Array');
import {
  getHundredsOfNanosecondsSinceGregorianReform,
} from '../src/getHundredsOfNanosecondsSinceGregorianReform';
jest.mock('../src/getHundredsOfNanosecondsSinceGregorianReform');
import {
  isUUIDVersion,
} from '../src/TypeGuards/isUUIDVersion';
jest.mock('../src/TypeGuards/isUUIDVersion');
import {
  randomBytesGenerator,
} from '../src/randomBytesGenerator';
jest.mock('../src/randomBytesGenerator');

describe('timestampGetter unit tests.', () => {
  beforeEach(() => {
    (convertBinStrToUint8Array as any).mockClear();
    (convertBinStrToUint8Array as any).mockReturnValue([ 1, 2, 3, 4, 5, 6, ]);
    (getHundredsOfNanosecondsSinceGregorianReform as any).mockClear();
    (getHundredsOfNanosecondsSinceGregorianReform as any).mockReturnValue(200);
    (isUUIDVersion as any).mockClear();
    (isUUIDVersion as any).mockReturnValue(true);
    (randomBytesGenerator as any).mockClear();
    (randomBytesGenerator as any).mockReturnValue([ 8, 7, 6, 5, 4, 3, 2, 1, ]);
  });

  it('Throws if isUUIDVersion returns false.', () => {
    (isUUIDVersion as any).mockReturnValue(false);
    const func = () => timestampGetter(null as any);
    expect(func).toThrow(strings.UUID_VERSION_INVALID);
  });

  it('Calls getHundredsOfNanosecondsSinceGregorianReform is version is 1.', () => {
    timestampGetter(UUIDVersions.One);
    expect(getHundredsOfNanosecondsSinceGregorianReform).toBeCalledTimes(1);
  });

  it('If the version is 1, calls convertBinStrToUint8Array to convert the binary stringified result of getHundredsOfNanosecondsSinceGregorianReform.', () => {
    (getHundredsOfNanosecondsSinceGregorianReform as any).mockReturnValue(321);

    timestampGetter(UUIDVersions.One);
    expect((convertBinStrToUint8Array as any).mock.calls).toEqual([
      [
        '101000001',
      ],
    ]);
  });

  it('If the version is 1, returns an 8-byte front-padded array with the contents of the converted array.', () => {
    (convertBinStrToUint8Array as any).mockReturnValue([ 2, 4, 6, 8, 10, 12, ]);

    expect(timestampGetter(UUIDVersions.One)).toEqual(new Uint8Array([
      0, 0, 2, 4, 6, 8, 10, 12,
    ]));
  });

  it('Throws if the version is 3 and no hash argument is provided.', () => {
    const func = () => timestampGetter(UUIDVersions.Three);
    expect(func).toThrow(strings.HASH_ARGUMENT_MISSING);
  });

  it('Throws if the version is 5 and no hash argument is provided.', () => {
    const func = () => timestampGetter(UUIDVersions.Five);
    expect(func).toThrow(strings.HASH_ARGUMENT_MISSING);
  });

  it('If the version is 3, slices the hash into low, mid, and high sections and converts it to an array.', () => {
    timestampGetter(
      UUIDVersions.Three,
      '0123456789abcdef',
    );

    expect((convertBinStrToUint8Array as any).mock.calls).toEqual([
      [
        /* time_high */
        '1100110111101111' +
        /* time_mid */
        '1000100110101011' +
        /* time_low */
        '00000001001000110100010101100111',
      ],
    ]);
  });

  it('If the version is 5, slices the hash into low, mid, and high sections and converts it to an array.', () => {
    timestampGetter(
      UUIDVersions.Five,
      '0123456789abcdef',
    );

    expect((convertBinStrToUint8Array as any).mock.calls).toEqual([
      [
        /* time_high */
        '1100110111101111' +
        /* time_mid */
        '1000100110101011' +
        /* time_low */
        '00000001001000110100010101100111',
      ],
    ]);
  });

  it('Calls randomBytesGenerator for size 8 if the version is 4.', () => {
    timestampGetter(UUIDVersions.Four);
    expect((randomBytesGenerator as any).mock.calls).toEqual([ [ 8, ], ]);
  });

  it('Returns all zeroes if the version is nil.', () => {
    expect(timestampGetter(UUIDVersions.Nil)).toEqual(new Uint8Array([
      0, 0, 0, 0, 0, 0, 0, 0,
    ]));
  });

  it('Clamps the result to 60 bits if the version is 1.', () => {
    (convertBinStrToUint8Array as any).mockReturnValue([
      256, 1, 2, 3, 4, 5, 6, 7,
    ]);

    expect(timestampGetter(UUIDVersions.One)).toEqual(new Uint8Array([
      32, 1, 2, 3, 4, 5, 6, 7,
    ]));
  });

  it('Clamps the result to 60 bits if the version is 3.', () => {
    (convertBinStrToUint8Array as any).mockReturnValue([
      256, 1, 2, 3, 4, 5, 6, 7,
    ]);

    const val = timestampGetter(UUIDVersions.Three, '12345678901234567890');

    expect(val).toEqual(new Uint8Array([
      32, 1, 2, 3, 4, 5, 6, 7,
    ]));
  });

  it('Clamps the result to 60 bits if the version is 3.', () => {
    (randomBytesGenerator as any).mockReturnValue([
      256, 1, 2, 3, 4, 5, 6, 7,
    ]);

    const val = timestampGetter(UUIDVersions.Four);

    expect(val).toEqual(new Uint8Array([
      32, 1, 2, 3, 4, 5, 6, 7,
    ]));
  });

  it('Clamps the result to 60 bits if the version is 5.', () => {
    (convertBinStrToUint8Array as any).mockReturnValue([
      256, 1, 2, 3, 4, 5, 6, 7,
    ]);

    const val = timestampGetter(UUIDVersions.Five, '12345678901234567890');

    expect(val).toEqual(new Uint8Array([
      32, 1, 2, 3, 4, 5, 6, 7,
    ]));
  });

  it('Fills the most significant bits with 0 if they are missing and the version is 1.', () => {
    (convertBinStrToUint8Array as any).mockReturnValue([
      1, 2, 3, 4,
    ]);

    expect(timestampGetter(UUIDVersions.One)).toEqual(new Uint8Array([
      0, 0, 0, 0, 1, 2, 3, 4,
    ]));
  });

  it('Fills the most significant bits with 0 if they are missing and the version is 3.', () => {
    (convertBinStrToUint8Array as any).mockReturnValue([
      2, 3, 4, 5,
    ]);

    const val = timestampGetter(UUIDVersions.Five, '12345678901234567890');

    expect(val).toEqual(new Uint8Array([
      0, 0, 0, 0, 2, 3, 4, 5,
    ]));
  });

  it('Fills the most significant bits with 0 if they are missing and the version is 4.', () => {
    (randomBytesGenerator as any).mockReturnValue([
      3, 4, 5, 6,
    ]);

    const val = timestampGetter(UUIDVersions.Four);

    expect(val).toEqual(new Uint8Array([
      0, 0, 0, 0, 3, 4, 5, 6,
    ]));
  });

  it('Fills the most significant bits with 0 if they are missing and the version is 5.', () => {
    (convertBinStrToUint8Array as any).mockReturnValue([
      4, 5, 6, 7, 8,
    ]);

    const val = timestampGetter(UUIDVersions.Five, '12345678901234567890');

    expect(val).toEqual(new Uint8Array([
      0, 0, 0, 4, 5, 6, 7, 8,
    ]));
  });
});
