import {
  makeVersionFourOrNilUUIDValues,
} from '../../src/UUID/makeVersionFourOrNilUUIDValues';
import {
  UUIDVersions,
} from '../../src/Enums/UUIDVersions';

describe('makeVersionFourOrNilUUIDValues unit tests.', () => {
  it('Passes the version to options.clockSequenceGetter for version 4.', () => {
    const csg = jest.fn();
    const ng = jest.fn();
    const tsg = jest.fn();

    const opts = {
      version: UUIDVersions.Four,
      clockSequenceGetter: csg,
      nodeIdentifierGetter: ng,
      timestampGetter: tsg,
    };

    makeVersionFourOrNilUUIDValues(opts);
    expect(csg.mock.calls).toEqual([
      [ UUIDVersions.Four, ],
    ]);
  });

  it('Passes the version to options.clockSequenceGetter for version nil.', () => {
    const csg = jest.fn();
    const ng = jest.fn();
    const tsg = jest.fn();

    const opts = {
      version: UUIDVersions.Nil,
      clockSequenceGetter: csg,
      nodeIdentifierGetter: ng,
      timestampGetter: tsg,
    };

    makeVersionFourOrNilUUIDValues(opts);
    expect(csg.mock.calls).toEqual([
      [ UUIDVersions.Nil, ],
    ]);
  });

  it('Passes the version to options.nodeIdentifierGetter for version 4.', () => {
    const csg = jest.fn();
    const ng = jest.fn();
    const tsg = jest.fn();

    const opts = {
      version: UUIDVersions.Four,
      clockSequenceGetter: csg,
      nodeIdentifierGetter: ng,
      timestampGetter: tsg,
    };

    makeVersionFourOrNilUUIDValues(opts);
    expect(ng.mock.calls).toEqual([
      [ UUIDVersions.Four, ],
    ]);
  });

  it('Passes the version to options.nodeIdentifierGetter for version nil.', () => {
    const csg = jest.fn();
    const ng = jest.fn();
    const tsg = jest.fn();

    const opts = {
      version: UUIDVersions.Nil,
      clockSequenceGetter: csg,
      nodeIdentifierGetter: ng,
      timestampGetter: tsg,
    };

    makeVersionFourOrNilUUIDValues(opts);
    expect(ng.mock.calls).toEqual([
      [ UUIDVersions.Nil, ],
    ]);
  });

  it('Passes the version to options.timestampGetter for version 4.', () => {
    const csg = jest.fn();
    const ng = jest.fn();
    const tsg = jest.fn();
    
    const opts = {
      version: UUIDVersions.Four,
      clockSequenceGetter: csg,
      nodeIdentifierGetter: ng,
      timestampGetter: tsg,
    };

    makeVersionFourOrNilUUIDValues(opts);
    expect(tsg.mock.calls).toEqual([
      [ UUIDVersions.Four, ],
    ]);
  });

  it('Passes the version to options.timestampGetter for version nil.', () => {
    const csg = jest.fn();
    const ng = jest.fn();
    const tsg = jest.fn();
    
    const opts = {
      version: UUIDVersions.Nil,
      clockSequenceGetter: csg,
      nodeIdentifierGetter: ng,
      timestampGetter: tsg,
    };

    makeVersionFourOrNilUUIDValues(opts);
    expect(tsg.mock.calls).toEqual([
      [ UUIDVersions.Nil, ],
    ]);
  });
});
