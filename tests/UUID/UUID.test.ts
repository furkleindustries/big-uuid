import {
  strings,
} from '../../src/strings';
import {
  UUID,
} from '../../src/UUID/UUID';
import {
  UUIDVersions,
} from '../../src/Enums/UUIDVersions';

import {
  isNode,
} from '../../src/isNode';
jest.mock('../../src/isNode');
import {
  isUUIDVersion,
} from '../../src/TypeGuards/isUUIDVersion';
jest.mock('../../src/TypeGuards/isUUIDVersion');
import {
  makeVersionOneUUIDValues,
} from '../../src/UUID/makeVersionOneUUIDValues';
jest.mock('../../src/UUID/makeVersionOneUUIDValues');
import {
  makeVersionThreeOrFiveUUIDValues,
} from '../../src/UUID/makeVersionThreeOrFiveUUIDValues';
jest.mock('../../src/UUID/makeVersionThreeOrFiveUUIDValues');
import {
  makeVersionFourUUIDValues,
} from '../../src/UUID/makeVersionFourUUIDValues';
jest.mock('../../src/UUID/makeVersionFourUUIDValues');
import {
  makeVersionNilUUIDValues,
} from '../../src/UUID/makeVersionNilUUIDValues';
jest.mock('../../src/UUID/makeVersionNilUUIDValues');
import {
  mergeUUIDOptions,
} from '../../src/UUID/UUIDOptions/mergeUUIDOptions';
jest.mock('../../src/UUID/UUIDOptions/mergeUUIDOptions');
import {
  uintArrayAsHex,
} from '../../src/uintArrayAsHex';
jest.mock('../../src/uintArrayAsHex');
import {
  UUIDOptions,
} from '../../src/UUID/UUIDOptions/UUIDOptions';
jest.mock('../../src/UUID/UUIDOptions/UUIDOptions');
import {
  writeNewResults,
} from '../../src/writeNewResults';
jest.mock('../../src/writeNewResults');

describe('UUID unit tests.', () => {
  const mockUUIDOptions = Object.freeze({
    version: UUIDVersions.Four,
  });

  const baseMakeValues = {
    clockSequence: [ 0, 1, ],
    nodeIdentifier: [ 0, 1, 2, 3, 4, 5, ],
    timestamp: [ 0, 1, 2, 3, 4, 5, 6, 7, ],
  };

  beforeEach(() => {
    (isNode as any).mockClear();
    (isNode as any).mockReturnValue(true);
    (isUUIDVersion as any).mockClear();
    (isUUIDVersion as any).mockReturnValue(true);
    (makeVersionOneUUIDValues as any).mockClear();
    (makeVersionOneUUIDValues as any).mockReturnValue(baseMakeValues);
    (makeVersionThreeOrFiveUUIDValues as any).mockClear();
    (makeVersionThreeOrFiveUUIDValues as any).mockReturnValue(baseMakeValues);
    (makeVersionFourUUIDValues as any).mockClear();
    (makeVersionFourUUIDValues as any).mockReturnValue(baseMakeValues);
    (makeVersionNilUUIDValues as any).mockClear();
    (makeVersionNilUUIDValues as any).mockReturnValue(baseMakeValues);
    (mergeUUIDOptions as any).mockClear();
    (mergeUUIDOptions as any).mockReturnValue(mockUUIDOptions);
    (uintArrayAsHex as any).mockClear();
    (uintArrayAsHex as any).mockReturnValue('testbar');
    (UUIDOptions as any).mockClear();
    (UUIDOptions as any).mockImplementation(() => mockUUIDOptions);
    (writeNewResults as any).mockClear();
  });

  it('Creates a group of base options.', () => {
    new UUID();
    expect((UUIDOptions as any).mock.calls).toEqual([ [], ]);
  });

  it('Merges the argument options with the base options, if the argument options are provided.', () => {
    const opts = {
      version: UUIDVersions.Nil,
    };

    new UUID(opts);
    expect((mergeUUIDOptions as any).mock.calls).toEqual([
      [
        new UUIDOptions(),
        opts,
      ],
    ]);
  });

  it('Throws an error if the merged version option does not meet the isUUIDVersion type guard.', () => {
    (isUUIDVersion as any).mockReturnValue(false);
    
    const func = () => new UUID();
    expect(func).toThrow(strings.UUID_VERSION_INVALID);
  });

  it('Throws an error if the version is 1 and isNode returns false.', () => {
    (isNode as any).mockReturnValue(false);
    (UUIDOptions as any).mockImplementationOnce(() => ({ version: UUIDVersions.One, }));

    const func = () => new UUID();
    expect(func).toThrow(strings.VERSION_1_IN_BROWSER);
  });

  it('Passes the options to makeVersionOneUUIDValues if the version is 1.', () => {
    const opts = { version: UUIDVersions.One, };

    (UUIDOptions as any).mockImplementationOnce(() => opts);

    new UUID();
    expect((makeVersionOneUUIDValues as any).mock.calls).toEqual([
      [ opts, ],
    ]);
  });

  it('Passes the UUID to writeNewResults if shouldWrite is returned from makeVersionOneUUIDValues.', () => {
    const opts = { version: UUIDVersions.One, };

    (UUIDOptions as any).mockImplementationOnce(() => opts);
    (makeVersionOneUUIDValues as any).mockReturnValue(Object.assign(
      {},
      baseMakeValues,
      { shouldWrite: true, },
    ));

    const uuid = new UUID();
    expect((writeNewResults as any).mock.calls).toEqual([
      [
        uuid,
      ],
    ]);
  });

  it('Passes the options to makeVersionThreeOrFiveUUIDValues if the version is 3.', () => {
    const opts = { version: UUIDVersions.Three, };

    (UUIDOptions as any).mockImplementationOnce(() => opts);

    new UUID();
    expect((makeVersionThreeOrFiveUUIDValues as any).mock.calls).toEqual([
      [ opts, ],
    ]);
  });

  it('Passes the options to makeVersionThreeOrFiveUUIDValues if the version is 5.', () => {
    const opts = { version: UUIDVersions.Five, };

    (UUIDOptions as any).mockImplementationOnce(() => opts);

    new UUID();
    expect((makeVersionThreeOrFiveUUIDValues as any).mock.calls).toEqual([
      [ opts, ],
    ]);
  });

  it('Passes the options to makeVersionFourUUIDValues if the version is 4.', () => {
    const opts = { version: UUIDVersions.Four, };

    (UUIDOptions as any).mockImplementationOnce(() => opts);

    new UUID();
    expect((makeVersionFourUUIDValues as any).mock.calls).toEqual([
      [ opts, ],
    ]);
  });

  it('Passes the options to makeVersionNilUUIDValues if the version is 4.', () => {
    const opts = { version: UUIDVersions.Nil, };

    (UUIDOptions as any).mockImplementationOnce(() => opts);

    new UUID();

    /* No call signature for nil as it needs no arguments. */
    expect((makeVersionNilUUIDValues as any).mock.calls).toEqual([
      [
        {
          version: UUIDVersions.Nil,
        },
      ],
    ]);
  });

  it('The version getter returns the __version property.', () => {
    const uuid = new UUID();
    (uuid as any).__version = 'test1';
    expect(uuid.version).toBe('test1');
  });

  it('The timestamp getter returns the __timestamp property.', () => {
    const uuid = new UUID();
    (uuid as any).__timestamp = 'test2';
    expect(uuid.timestamp).toBe('test2');
  });

  it('The timeLow getter returns the 4, 8 slice of timestamp.', () => {
    const uuid = new UUID();
    (uuid as any).__timestamp = [ 0, 1, 2, 3, 4, 5, 6, 7, ];
    expect(uuid.timeLow).toEqual([ 4, 5, 6, 7, ]);
  });

  it('The timeMid getter returns the 2, 4 slice of timestamp.', () => {
    const uuid = new UUID();
    (uuid as any).__timestamp = [ 0, 1, 2, 3, 4, 5, 6, 7, ];
    expect(uuid.timeMid).toEqual([ 2, 3, ]);
  });

  it('The timeHigh getter returns the 0, 2 slice of timestamp.', () => {
    const uuid = new UUID();
    (uuid as any).__timestamp = [ 0, 1, 2, 3, 4, 5, 6, 7, ];
    expect(uuid.timeHigh).toEqual([ 0, 1, ]);
  });

  it('The clockSequence getter returns the __clockSequence property.', () => {
    const uuid = new UUID();
    (uuid as any).__clockSequence = 'test3';
    expect(uuid.clockSequence).toBe('test3');
  });

  it('The clockSequenceLow getter returns the 0, 1 slice of timestamp.', () => {
    const uuid = new UUID();
    (uuid as any).__clockSequence = [ 0, 1, ];
    expect(uuid.clockSequenceLow).toEqual([ 1, ]);
  });

  it('The clockSequenceLow getter returns the 0, 1 slice of timestamp.', () => {
    const uuid = new UUID();
    (uuid as any).__clockSequence = [ 0, 1, ];
    expect(uuid.clockSequenceHigh).toEqual([ 0, ]);
  });

  it('The reserved getter returns [ 2 ].', () => {
    const uuid = new UUID();
    expect(uuid.reserved).toEqual(new Uint8Array([ 2, ]));
  });

  it('The clockSequenceHighAndReserved getter returns the 0, 1 slice of timestamp.', () => {
    const uuid = new UUID();
    (uuid as any).__clockSequence = [ 1, 2, ];
    expect(uuid.clockSequenceHighAndReserved).toEqual(new Uint8Array([ 6, ]));
  });

  it('The nodeIdentifier getter returns the __nodeIdentifier property.', () => {
    const uuid = new UUID();
    (uuid as any).__nodeIdentifier = 'test4';
    expect(uuid.nodeIdentifier).toEqual('test4');
  });

  it('Throws if UUID.parse is called and there are not five dash-delimited portions of the argument string.', () => {
    const func = () => UUID.parse('fdsfkdlfljdsfjds');
    expect(func).toThrow(strings.UUID_STRING_INVALID);
  });

  it('Produces an object with expected property names when a valid UUID string is parsed.', () => {
    const uuid = UUID.parse('bcdab3ec-e3bd-11e8-9f32-f2801f1b9fd1');
    expect(Boolean(
      uuid.version === UUIDVersions.One &&
      '__version' in uuid &&
      'version' in uuid &&
      '__timestamp' in uuid &&
      'timestamp' in uuid &&
      '__clockSequence' in uuid &&
      'clockSequence' in uuid &&
      '__nodeIdentifier' in uuid &&
      'nodeIdentifier' in uuid
    )).toBe(true);
  });

  it('Calls uintArrayAsHex to convert segments when toString is called.', () => {
    new UUID().toString();
    /* Six times for six segments. */
    expect(uintArrayAsHex).toBeCalledTimes(6);
  });
});
