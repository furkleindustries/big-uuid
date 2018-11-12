import {
  makeVersionThreeOrFiveUUIDValues,
} from '../../src/UUID/makeVersionThreeOrFiveUUIDValues';
import {
  strings,
} from '../../src/strings';
import {
  UUIDVersions,
} from '../../src/Enums/UUIDVersions';

import {
  getHashFromNamespaceIdAndName,
} from '../../src/getHashFromNamespaceIdAndName';
jest.mock('../../src/getHashFromNamespaceIdAndName');

describe('makeVersionThreeOrFiveUUIDValues unit tests.', () => {
  beforeEach(() => {
    (getHashFromNamespaceIdAndName as any).mockClear();
    (getHashFromNamespaceIdAndName as any).mockReturnValue('whatever');
  });

  it('Throws if namespaceId is not included.', () => {
    const func = () => makeVersionThreeOrFiveUUIDValues(null as any);
    expect(func).toThrow(strings.NAMESPACE_ID_MISSING);
  });

  it('Throws if name is not included.', () => {
    const func = () => makeVersionThreeOrFiveUUIDValues({
      namespaceId: 'foobar',
    } as any);

    expect(func).toThrow(strings.NAME_MISSING);
  });

  it('Passes the version, namespaceId, and name to getHashFromNamespaceIdAndName.', () => {
    const csg = jest.fn();
    const ng = jest.fn();
    const tsg = jest.fn();

    const opts = {
      namespaceId: 'foo',
      name: 'bar',
      version: UUIDVersions.Three,
      clockSequenceGetter: csg,
      nodeIdentifierGetter: ng,
      timestampGetter: tsg,
    };

    makeVersionThreeOrFiveUUIDValues(opts);
    expect((getHashFromNamespaceIdAndName as any).mock.calls).toEqual([
      [
        UUIDVersions.Three,
        'foo',
        'bar',
      ],
    ]);
  });

  it('Passes the version to options.clockSequenceGetter for version 3.', () => {
    const csg = jest.fn();
    const ng = jest.fn();
    const tsg = jest.fn();

    const opts = {
      namespaceId: 'foo',
      name: 'bar',
      version: UUIDVersions.Three,
      clockSequenceGetter: csg,
      nodeIdentifierGetter: ng,
      timestampGetter: tsg,
    };

    makeVersionThreeOrFiveUUIDValues(opts);
    expect(csg.mock.calls).toEqual([
      [
        UUIDVersions.Three,
        'whatever',
      ],
    ]);
  });

  it('Passes the version to options.clockSequenceGetter for version 5.', () => {
    const csg = jest.fn();
    const ng = jest.fn();
    const tsg = jest.fn();

    const opts = {
      namespaceId: 'foo',
      name: 'bar',
      version: UUIDVersions.Five,
      clockSequenceGetter: csg,
      nodeIdentifierGetter: ng,
      timestampGetter: tsg,
    };

    makeVersionThreeOrFiveUUIDValues(opts);
    expect(csg.mock.calls).toEqual([
      [
        UUIDVersions.Five,
        'whatever',
      ],
    ]);
  });

  it('Passes the version to options.nodeIdentifierGetter for version 3.', () => {
    const csg = jest.fn();
    const ng = jest.fn();
    const tsg = jest.fn();

    const opts = {
      namespaceId: 'foo',
      name: 'bar',
      version: UUIDVersions.Three,
      clockSequenceGetter: csg,
      nodeIdentifierGetter: ng,
      timestampGetter: tsg,
    };

    makeVersionThreeOrFiveUUIDValues(opts);
    expect(ng.mock.calls).toEqual([
      [
        UUIDVersions.Three,
        'whatever',
      ],
    ]);
  });

  it('Passes the version to options.nodeIdentifierGetter for version 5.', () => {
    const csg = jest.fn();
    const ng = jest.fn();
    const tsg = jest.fn();

    const opts = {
      namespaceId: 'foo',
      name: 'bar',
      version: UUIDVersions.Five,
      clockSequenceGetter: csg,
      nodeIdentifierGetter: ng,
      timestampGetter: tsg,
    };

    makeVersionThreeOrFiveUUIDValues(opts);
    expect(ng.mock.calls).toEqual([
      [
        UUIDVersions.Five,
        'whatever',
      ],
    ]);
  });

  it('Passes the version to options.timestampGetter for version 3.', () => {
    const csg = jest.fn();
    const ng = jest.fn();
    const tsg = jest.fn();
    
    const opts = {
      namespaceId: 'foo',
      name: 'bar',
      version: UUIDVersions.Three,
      clockSequenceGetter: csg,
      nodeIdentifierGetter: ng,
      timestampGetter: tsg,
    };

    makeVersionThreeOrFiveUUIDValues(opts);
    expect(tsg.mock.calls).toEqual([
      [
        UUIDVersions.Three,
        'whatever',
      ],
    ]);
  });

  it('Passes the version to options.timestampGetter for version 5.', () => {
    const csg = jest.fn();
    const ng = jest.fn();
    const tsg = jest.fn();
    
    const opts = {
      namespaceId: 'foo',
      name: 'bar',
      version: UUIDVersions.Five,
      clockSequenceGetter: csg,
      nodeIdentifierGetter: ng,
      timestampGetter: tsg,
    };

    makeVersionThreeOrFiveUUIDValues(opts);
    expect(tsg.mock.calls).toEqual([
      [
        UUIDVersions.Five,
        'whatever',
      ],
    ]);
  });
});
