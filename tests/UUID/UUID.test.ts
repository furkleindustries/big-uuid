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
  getHashFromNamespaceIdAndName,
} from '../../src/getHashFromNamespaceIdAndName';
jest.mock('../../src/getHashFromNamespaceIdAndName');
import {
  isNode,
} from '../../src/isNode';
jest.mock('../../src/isNode');
import {
  isUUIDVersion,
} from '../../src/TypeGuards/isUUIDVersion';
jest.mock('../../src/TypeGuards/isUUIDVersion');
import {
  uintArrayAsNumber,
} from '../../src/uintArrayAsNumber';
jest.mock('../../src/uintArrayAsNumber');
import {
  UUIDOptions,
} from '../../src/UUID/UUIDOptions/UUIDOptions';
jest.mock('../../src/UUID/UUIDOptions/UUIDOptions');
import {
  writeNewResults,
} from '../../src/writeNewResults';
jest.mock('../../src/writeNewResults');

describe('UUID tests.', () => {
  const mockUUIDOptions = {
    clockSequenceGetter: jest.fn(),
    nodeIdentifierGetter: jest.fn(),
    timestampGetter: jest.fn(),
    version: UUIDVersions.Four,
  };

  beforeEach(() => {
    (getHashFromNamespaceIdAndName as any).mockClear();
    (getHashFromNamespaceIdAndName as any).mockReturnValue('hash');
    (isNode as any).mockClear();
    (isNode as any).mockReturnValue(true);
    (isUUIDVersion as any).mockClear();
    (isUUIDVersion as any).mockReturnValue(true);
    (uintArrayAsNumber as any).mockClear();
    (uintArrayAsNumber as any).mockReturnValue(12);
    (UUIDOptions as any).mockClear();
    (UUIDOptions as any).mockImplementation(() => mockUUIDOptions);
    mockUUIDOptions.clockSequenceGetter.mockClear();
    mockUUIDOptions.nodeIdentifierGetter.mockClear();
    mockUUIDOptions.timestampGetter.mockClear();
    (writeNewResults as any).mockClear();
  });

  it('Creates an instance of UUIDOptions as the base state.', () => {
    new UUID();
    expect(UUIDOptions).toHaveBeenCalledTimes(1);
  });

  it('Merges argOptions.version if it is truthy.', () => {
    const uuid = new UUID({ version: UUIDVersions.Nil, });
    expect(uuid.version).toBe(UUIDVersions.Nil);
  });

  it('Throws if argOpts.version is truthy and does not meet the isUUIDVersion type guard.', () => {
    (isUUIDVersion as any).mockReturnValue(false);
    const func = () => new UUID({ version: 'foobar' as any, });
    expect(func).toThrow(strings.UUID_VERSION_INVALID);
  });

  it('Throws if isNode returns false and the version is 1.', () => {
    (isNode as any).mockReturnValue(false);
    const func = () => new UUID({ version: UUIDVersions.One, });
    expect(func).toThrow(strings.VERSION_1_IN_BROWSER);
  });

  it('Throws if the version is 3 and the namespaceId argument is not truthy.', () => {
    const func = () => new UUID({
      version: UUIDVersions.Three,
      namespaceId: false as any,
    });

    expect(func).toThrow(strings.NAMESPACE_ID_MISSING);
  });

  it('Throws if the version is 5 and the namespaceId argument is not truthy.', () => {
    const func = () => new UUID({
      version: UUIDVersions.Five,
      namespaceId: false as any,
    });

    expect(func).toThrow(strings.NAMESPACE_ID_MISSING);
  });

  it('Throws if the version is 3 and the name argument is not truthy.', () => {
    const func = () => new UUID({
      version: UUIDVersions.Three,
      namespaceId: 'whatever',
      name: false as any,
    });

    expect(func).toThrow(strings.NAME_MISSING);
  });

  it('Throws if the version is 5 and the namespaceId argument is not truthy.', () => {
    const func = () => new UUID({
      version: UUIDVersions.Five,
      namespaceId: 'whatever',
      name: false as any,
    });

    expect(func).toThrow(strings.NAME_MISSING);
  });

  it('Calls argOptions.clockSequenceGetter with version if it is a function and the version is 1.', () => {
    const func = jest.fn();
    new UUID({
      version: UUIDVersions.One,
      clockSequenceGetter: func,
    });

    expect(func.mock.calls).toEqual([
      [ UUIDVersions.One, ],
    ]);
  });

  it('Calls argOptions.clockSequenceGetter with version if it is a function and the version is 4.', () => {
    const func = jest.fn();
    new UUID({
      version: UUIDVersions.Four,
      clockSequenceGetter: func,
    });

    expect(func.mock.calls).toEqual([
      [ UUIDVersions.Four, ],
    ]);
  });

  it('Calls argOptions.nodeIdentifierGetter with version if it is a function and the version is 1.', () => {
    const func = jest.fn();
    new UUID({
      version: UUIDVersions.One,
      nodeIdentifierGetter: func,
    });

    expect(func.mock.calls).toEqual([
      [ UUIDVersions.One, ],
    ]);
  });

  it('Calls argOptions.nodeIdentifierGetter with version if it is a function and the version is 4.', () => {
    const func = jest.fn();
    new UUID({
      version: UUIDVersions.Four,
      nodeIdentifierGetter: func,
    });

    expect(func.mock.calls).toEqual([
      [ UUIDVersions.Four, ],
    ]);
  });

  it('Calls argOptions.timestampGetter with version if it is a function and the version is 1.', () => {
    const func = jest.fn();
    new UUID({
      version: UUIDVersions.One,
      timestampGetter: func,
    });

    expect(func.mock.calls).toEqual([
      [ UUIDVersions.One, ],
    ]);
  });

  it('Calls argOptions.timestampGetter with version if it is a function and the version is 4.', () => {
    const func = jest.fn();
    new UUID({
      version: UUIDVersions.Four,
      timestampGetter: func,
    });

    expect(func.mock.calls).toEqual([
      [ UUIDVersions.Four, ],
    ]);
  });

  /* TODO: add writeNewResults and clock sequence edge case tests. */

  it('Calls getHashFromNamespaceId with argOptions.namespaceId and argOptions.name if it is truthy and the version is 3.', () => {
    new UUID({
      version: UUIDVersions.Three,
      namespaceId: 'test1',
      name: 'test2',
    });

    expect((getHashFromNamespaceIdAndName as any).mock.calls).toEqual([
      [
        UUIDVersions.Three,
        'test1',
        'test2',
      ]
    ]);
  });

  it('Calls getHashFromNamespaceId with argOptions.namespaceId and argOptions.name if it is truthy and the version is 5.', () => {
    new UUID({
      version: UUIDVersions.Three,
      namespaceId: 'test1',
      name: 'test2',
    });

    expect((getHashFromNamespaceIdAndName as any).mock.calls).toEqual([
      [
        UUIDVersions.Three,
        'test1',
        'test2',
      ]
    ]);
  });

  it('Calls clockSequenceGetter with version and hash if the version is 3.', () => {
    new UUID({
      version: UUIDVersions.Three,
      name: 'test1',
      namespaceId: 'test2',
    });

    expect(mockUUIDOptions.clockSequenceGetter.mock.calls).toEqual([
      [
        UUIDVersions.Three,
        'hash',
      ],
    ]);
  });

  it('Calls clockSequenceGetter with version and hash if the version is 5.', () => {
    new UUID({
      version: UUIDVersions.Five,
      name: 'test1',
      namespaceId: 'test2',
    });

    expect(mockUUIDOptions.clockSequenceGetter.mock.calls).toEqual([
      [
        UUIDVersions.Five,
        'hash',
      ],
    ]);
  });

  it('Calls nodeIdentifierGetter with version and hash if the version is 3.', () => {
    new UUID({
      version: UUIDVersions.Three,
      name: 'test1',
      namespaceId: 'test2',
    });

    expect(mockUUIDOptions.nodeIdentifierGetter.mock.calls).toEqual([
      [
        UUIDVersions.Three,
        'hash',
      ],
    ]);
  });

  it('Calls nodeIdentifierGetter with version and hash if the version is 5.', () => {
    new UUID({
      version: UUIDVersions.Five,
      name: 'test1',
      namespaceId: 'test2',
    });

    expect(mockUUIDOptions.nodeIdentifierGetter.mock.calls).toEqual([
      [
        UUIDVersions.Five,
        'hash',
      ],
    ]);
  });

  it('Calls timestampGetter with version and hash if the version is 3.', () => {
    new UUID({
      version: UUIDVersions.Three,
      name: 'test1',
      namespaceId: 'test2',
    });

    expect(mockUUIDOptions.timestampGetter.mock.calls).toEqual([
      [
        UUIDVersions.Three,
        'hash',
      ],
    ]);
  });

  it('Calls timestampGetter with version and hash if the version is 5.', () => {
    new UUID({
      version: UUIDVersions.Five,
      name: 'test1',
      namespaceId: 'test2',
    });

    expect(mockUUIDOptions.timestampGetter.mock.calls).toEqual([
      [
        UUIDVersions.Five,
        'hash',
      ],
    ]);
  });

  it('Throws if UUID.parse is called and there are not five dash-delimited portions of the argument string.', () => {
    const func = () => UUID.parse('fdsfkdlfljdsfjds');
    expect(func).toThrow(strings.UUID_STRING_INVALID);
  });
});
