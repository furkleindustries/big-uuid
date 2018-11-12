import {
  mergeUUIDOptions,
} from '../../../src/UUID/UUIDOptions/mergeUUIDOptions';

import {
  isUUIDVersion,
} from '../../../src/TypeGuards/isUUIDVersion';
import UUIDVersions from '../../../src/Enums/UUIDVersions';
jest.mock('../../../src/TypeGuards/isUUIDVersion');

describe('mergeUUIDOptions tests.', () => {
  beforeEach(() => {
    (isUUIDVersion as any).mockClear();
    (isUUIDVersion as any).mockReturnValue(true);
  });

  it('Does not merge anything if no toMerge argument is provided.', () => {
    expect(mergeUUIDOptions({ foo: 'bar', } as any, null as any)).toEqual({ foo: 'bar', });
  });

  it('Merges nothing if toMerge is empty.', () => {
    (isUUIDVersion as any).mockReturnValue(false);
    expect(mergeUUIDOptions({ foo: 'bar', } as any, {} as any)).toEqual({ foo: 'bar', });
  });

  it('Merges the version if isUUIDVersion is true on toMerge.version.', () => {
    const merged = mergeUUIDOptions({} as any, { version: 'foo', } as any);
    expect(merged.version).toBe('foo');
  });

  it('Merges clockSequenceGetter if it is a function.', () => {
    const fn = jest.fn();
    const merged = mergeUUIDOptions({} as any, { clockSequenceGetter: fn, } as any);
    expect(merged.clockSequenceGetter).toBe(fn);
  });

  it('Merges nodeIdentifierGetter if it is a function.', () => {
    const fn = jest.fn();
    const merged = mergeUUIDOptions({} as any, { nodeIdentifierGetter: fn, } as any);
    expect(merged.nodeIdentifierGetter).toBe(fn);
  });

  it('Merges timestampGetter if it is a function.', () => {
    const fn = jest.fn();
    const merged = mergeUUIDOptions({} as any, { timestampGetter: fn, } as any);
    expect(merged.timestampGetter).toBe(fn);
  });

  it('Merges namespaceId if it exists and version is 3.', () => {
    const toMerge = {
      version: UUIDVersions.Three,
      namespaceId: 'foobar',
    };

    expect(mergeUUIDOptions({} as any, toMerge)).toEqual(toMerge)
  });

  it('Merges namespaceId if it exists and version is 5.', () => {
    const toMerge = {
      version: UUIDVersions.Five,
      namespaceId: 'quux',
    };

    expect(mergeUUIDOptions({} as any, toMerge)).toEqual(toMerge)
  });

  it('Merges name if it exists and version is 3.', () => {
    const toMerge = {
      version: UUIDVersions.Three,
      name: 'bux',
    };

    expect(mergeUUIDOptions({} as any, toMerge)).toEqual(toMerge)
  });

  it('Merges name if it exists and version is 5.', () => {
    const toMerge = {
      version: UUIDVersions.Five,
      name: 'buzz',
    };

    expect(mergeUUIDOptions({} as any, toMerge)).toEqual(toMerge)
  });
});
