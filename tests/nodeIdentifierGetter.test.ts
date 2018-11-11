import {
  nodeIdentifierGetter,
} from '../src/nodeIdentifierGetter';
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
  getLastResults,
} from '../src/getLastResults';
jest.mock('../src/getLastResults');
import {
  getMAC,
} from '../src/getMAC';
jest.mock('../src/getMAC');
import {
  randomBytesGenerator,
} from '../src/randomBytesGenerator';
jest.mock('../src/randomBytesGenerator');

describe('nodeIdentifierGetter unit tests.', () => {
  beforeEach(() => {
    (convertBinStrToUint8Array as any).mockClear();
    (convertBinStrToUint8Array as any).mockImplementation((aa: any) => aa);
    (randomBytesGenerator as any).mockClear();
    (randomBytesGenerator as any).mockReturnValue([ 1, 2, 3, 4, 5, 6, 7, 8, ]);
  });

  it('Grabs identifier from the last results if the version is 1 and they are available and the entry is valid.', () => {
    const ni = new Uint8Array([ 1, 2, 3, 4, ]);
    (getLastResults as any).mockReturnValue({ nodeIdentifier: ni, });
    expect(nodeIdentifierGetter(UUIDVersions.One)).toBe(ni);
  });

  it('Calls getMAC if the last results are not available.', () => {
    const ni = new Uint8Array([ 1, 2, 3, 4, ]);
    (getMAC as any).mockReturnValue(ni);
    (getLastResults as any).mockReturnValue(null);
    expect(nodeIdentifierGetter(UUIDVersions.One)).toBe(ni);
  });

  it('Throws if the version is 3 and no hash is provided.', () => {
    const func = () => nodeIdentifierGetter(UUIDVersions.Three);
    expect(func).toThrow(strings.HASH_ARGUMENT_MISSING);
  });

  it('Throws if the version is 5 and no hash is provided.', () => {
    const func = () => nodeIdentifierGetter(UUIDVersions.Five);
    expect(func).toThrow(strings.HASH_ARGUMENT_MISSING);
  });

  it('When using version 3, takes the 20, 32 slice of the hash, converts it to binary, and sets the least significant bit in the first byte to 1.', () => {
    const hash = '00000000000000000000000000000000';
    nodeIdentifierGetter(UUIDVersions.Three, hash);
    expect((convertBinStrToUint8Array as any).mock.calls).toEqual([
      [ '000000010000000000000000000000000000000000000000', ],
    ])
  });

  it('When using version 5, takes the 20, 32 slice of the hash, converts it to binary, and sets the least significant bit in the first byte to 1.', () => {
    const hash = '00000000000000000000000000000000';
    nodeIdentifierGetter(UUIDVersions.Five, hash);
    expect((convertBinStrToUint8Array as any).mock.calls).toEqual([
      [ '000000010000000000000000000000000000000000000000', ],
    ])
  });

  it('Assigns the nodeIdentifier 6 bytes from the randomBytesGenerator function.', () => {
    nodeIdentifierGetter(UUIDVersions.Four);
    expect((randomBytesGenerator as any).mock.calls).toEqual([ [ 6, ], ]);
  });

  it('Throws if the version is not 1, 3, 4, or 5.', () => {
    const func = () => nodeIdentifierGetter(null as any);
    expect(func).toThrow(strings.UUID_VERSION_INVALID);
  });
});
