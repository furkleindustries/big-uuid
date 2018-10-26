import {
  strings,
} from '../../../src/strings';
import {
  UUIDOptions,
} from '../../../src/UUID/UUIDOptions/UUIDOptions';
import {
  UUIDVersions,
} from '../../../src/Enums/UUIDVersions';

import {
  clockSequenceGetter,
} from '../../../src/clockSequenceGetter';
jest.mock('../../../src/clockSequenceGetter');
import {
  isUUIDVersion,
} from '../../../src/TypeGuards/isUUIDVersion';
jest.mock('../../../src/TypeGuards/isUUIDVersion');
import {
  nodeIdentifierGetter,
} from '../../../src/nodeIdentifierGetter';
jest.mock('../../../src/nodeIdentifierGetter');
import {
  timestampGetter,
} from '../../../src/timestampGetter';
jest.mock('../../../src/timestampGetter');

describe('UUIDOptions tests.', () => {
  beforeEach(() => {
    (clockSequenceGetter as any).mockReturnValue([]);
    (isUUIDVersion as any).mockReturnValue(true);
    (nodeIdentifierGetter as any).mockReturnValue([]);
    (timestampGetter as any).mockReturnValue([]);
  });

  it('Works with falsy argument.', () => {
    expect(() => new UUIDOptions(false as any)).not.toThrow();
  });

  it('Defaults to UUIDVersions.Four if no version is provided.', () => {
    expect(new UUIDOptions().version).toBe(UUIDVersions.Four);
  });

  it('Defaults to clockSequenceGetter if args.clockSequenceGetter is not a function.', () => {
    expect(new UUIDOptions().clockSequenceGetter).toBe(clockSequenceGetter);
  });

  it('Defaults to nodeIdentifierGetter if args.nodeIdentifierGetter is not a function.', () => {
    expect(new UUIDOptions().nodeIdentifierGetter).toBe(nodeIdentifierGetter);
  });

  it('Defaults to timestampGetter if args.timestampGetter is not a function.', () => {
    expect(new UUIDOptions().timestampGetter).toBe(timestampGetter);
  });

  it('Throws if args.version is truthy but does not meet the isUUIDVersion type guard.', () => {
    (isUUIDVersion as any).mockReturnValue(false);
    const func = () => new UUIDOptions({ version: 'foo' as any, });
    expect(func).toThrow(strings.UUID_VERSION_INVALID);
  });

  it('Merges args.version if it meets isUUIDVersion.', () => {
    const opts = new UUIDOptions({ version: UUIDVersions.Nil, });
    expect(opts.version).toBe(UUIDVersions.Nil);
  });

  it('Merges args.clockSequenceGetter if it is a function.', () => {
    const mock = jest.fn();
    const opts = new UUIDOptions({ clockSequenceGetter: mock, });
    expect(opts.clockSequenceGetter).toBe(mock);
  });

  it('Merges args.nodeIdentifierGetter if it is a function.', () => {
    const mock = jest.fn();
    const opts = new UUIDOptions({ nodeIdentifierGetter: mock, });
    expect(opts.nodeIdentifierGetter).toBe(mock);
  });

  it('Merges args.timestampGetter if it is a function.', () => {
    const mock = jest.fn();
    const opts = new UUIDOptions({ timestampGetter: mock, });
    expect(opts.timestampGetter).toBe(mock);
  });

  it('Merges namespaceId if the version is v3.', () => {
    const opts = new UUIDOptions({
      version: UUIDVersions.Three,
      namespaceId: 'test',
      name: 'test2',
    });

    expect(opts.namespaceId).toBe('test');
  });

  it('Merges name if the version is v3.', () => {
    const opts = new UUIDOptions({
      version: UUIDVersions.Three,
      namespaceId: 'test',
      name: 'test2',
    });

    expect(opts.name).toBe('test2');
  });

  it('Merges namespaceId if the version is v5.', () => {
    const opts = new UUIDOptions({
      version: UUIDVersions.Five,
      namespaceId: 'test',
      name: 'test2',
    });

    expect(opts.namespaceId).toBe('test');
  });

  it('Merges name if the version is v5.', () => {
    const opts = new UUIDOptions({
      version: UUIDVersions.Five,
      namespaceId: 'test',
      name: 'test2',
    });

    expect(opts.name).toBe('test2');
  });

  it('Throws if the version is v3 and args.namespaceId is falsy.', () => {
    const func = () => new UUIDOptions({
      version: UUIDVersions.Three,
      namespaceId: false as any,
    });

    expect(func).toThrow(strings.NAMESPACE_ID_MISSING);
  });

  it('Throws if the version is v3 and args.name is falsy.', () => {
    const func = () => new UUIDOptions({
      version: UUIDVersions.Three,
      namespaceId: 'test',
      name: false as any,
    });

    expect(func).toThrow(strings.NAME_MISSING);
  });

  it('Throws if the version is v5 and args.namespaceId is falsy.', () => {
    const func = () => new UUIDOptions({
      version: UUIDVersions.Five,
      namespaceId: false as any,
    });

    expect(func).toThrow(strings.NAMESPACE_ID_MISSING);
  });

  it('Throws if the version is v5 and args.name is falsy.', () => {
    const func = () => new UUIDOptions({
      version: UUIDVersions.Five,
      namespaceId: 'test',
      name: false as any,
    });

    expect(func).toThrow(strings.NAME_MISSING);
  });
});
