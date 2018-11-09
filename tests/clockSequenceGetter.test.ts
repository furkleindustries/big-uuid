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

describe('clockSequenceGetter tests.', () => {
  beforeEach(() => {
    (convertBinStrToUint8Array as any).mockReturnValue(new Uint8Array([ 1, 2, 3, ]));
    (isUUIDVersion as any).mockReturnValue(true);

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
    
  });
});
