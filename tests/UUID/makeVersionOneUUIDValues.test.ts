import {
  makeVersionOneUUIDValues,
} from '../../src/UUID/makeVersionOneUUIDValues';
import {
  UUIDVersions,
} from '../../src/Enums/UUIDVersions';

import {
  getLastResults,
} from '../../src/getLastResults';
jest.mock('../../src/getLastResults');
import {
  uintArrayAsBigNumber,
} from '../../src/uintArrayAsBigNumber';
jest.mock('../../src/uintArrayAsBigNumber');

describe('makeVersionOneUUIDValues unit tests.', () => {
  beforeEach(() => {
    (getLastResults as any).mockClear();
    (uintArrayAsBigNumber as any).mockClear();
  });

  it('Calls options.nodeIdentifierGetter with the version argument.', () => {
    const csg = jest.fn();
    const ng = jest.fn();
    const tig = jest.fn();

    makeVersionOneUUIDValues({
      version: UUIDVersions.One,
      clockSequenceGetter: csg,
      nodeIdentifierGetter: ng,
      timestampGetter: tig,
    });

    expect(ng.mock.calls).toEqual([
      [ UUIDVersions.One, ],
    ]);
  });

  it('Calls options.timestampGetter with the version argument.', () => {
    const csg = jest.fn();
    const ng = jest.fn();
    const tig = jest.fn();

    makeVersionOneUUIDValues({
      version: UUIDVersions.One,
      clockSequenceGetter: csg,
      nodeIdentifierGetter: ng,
      timestampGetter: tig,
    });

    expect(tig.mock.calls).toEqual([
      [ UUIDVersions.One, ],
    ]);
  });

  it('Calls options.clockSequenceGetter with the version argument if lastResults is falsy.', () => {
    const csg = jest.fn();
    const ng = jest.fn();
    const tig = jest.fn();

    makeVersionOneUUIDValues({
      version: UUIDVersions.One,
      clockSequenceGetter: csg,
      nodeIdentifierGetter: ng,
      timestampGetter: tig,
    });

    expect(csg.mock.calls).toEqual([
      [ UUIDVersions.One, ],
    ]);
  });

  it('Calls options.clockSequenceGetter with the version argument if lastResults exists and its nodeIdentifier is the same as the one generated from nodeIdentifierGetter.', () => {
    (getLastResults as any).mockReturnValue({
      nodeIdentifier: 2,
    });

    (uintArrayAsBigNumber as any).mockReturnValue({
      neq: () => false,
    });

    const csg = jest.fn();
    const ng = jest.fn();
    const tig = jest.fn();

    makeVersionOneUUIDValues({
      version: UUIDVersions.One,
      clockSequenceGetter: csg,
      nodeIdentifierGetter: ng,
      timestampGetter: tig,
    });

    expect(csg.mock.calls).toEqual([
      [ UUIDVersions.One, ],
    ]);
  });

  it('Calls options.clockSequenceGetter with the UUIDOptions.Four if lastResults exists but its nodeIdentifier differs from the one generated from nodeIdentifierGetter.', () => {
    (getLastResults as any).mockReturnValue({
      nodeIdentifier: 2,
    });

    (uintArrayAsBigNumber as any).mockReturnValue({
      neq: () => true,
    });

    const csg = jest.fn();
    const ng = jest.fn();
    const tig = jest.fn();

    makeVersionOneUUIDValues({
      version: UUIDVersions.One,
      clockSequenceGetter: csg,
      nodeIdentifierGetter: ng,
      timestampGetter: tig,
    });

    expect(csg.mock.calls).toEqual([
      [ UUIDVersions.Four, ],
    ]);
  });

  it('Returns shouldWrite: true if lastResults is falsy.', () => {
    const csg = jest.fn();
    const ng = jest.fn();
    const tig = jest.fn();

    const val = makeVersionOneUUIDValues({
      version: UUIDVersions.One,
      clockSequenceGetter: csg,
      nodeIdentifierGetter: ng,
      timestampGetter: tig,
    });

    expect(val.shouldWrite).toBe(true);
  });

  it('Increments the clock sequence if the old timestamp is greater than or equal to the new one.', () => {
    (getLastResults as any).mockReturnValue({
      clockSequence: new Uint8Array([ 0, 1, ]),
      nodeIdentifier: 2,
      timestamp: new Uint8Array([ 1, 2, 3, 4, 5, 6, 7, 8, ]),
    });

    (uintArrayAsBigNumber as any).mockReturnValue({
      neq: () => false,
      geq: () => true,
    });

    const csg = jest.fn(() => new Uint8Array([ 0, 1, ]));
    const ng = jest.fn();
    const tig = jest.fn(() => [ 1, 2, 3, 4, 5, 6, 7, 8, ]);

    const val = makeVersionOneUUIDValues({
      version: UUIDVersions.One,
      clockSequenceGetter: csg,
      nodeIdentifierGetter: ng,
      timestampGetter: tig,
    });

    expect(val.clockSequence).toEqual(new Uint8Array([
      0, 2,
    ]));
  });

  it('Increments the upper clock sequence byte if the lower byte wraps around.', () => {
    (getLastResults as any).mockReturnValue({
      clockSequence: new Uint8Array([ 0, 255, ]),
      nodeIdentifier: 2,
      timestamp: new Uint8Array([ 1, 2, 3, 4, 5, 6, 7, 8, ]),
    });

    (uintArrayAsBigNumber as any).mockReturnValue({
      neq: () => false,
      geq: () => true,
    });

    const csg = jest.fn(() => new Uint8Array([ 0, 255, ]));
    const ng = jest.fn();
    const tig = jest.fn(() => [ 1, 2, 3, 4, 5, 6, 7, 8, ]);

    const val = makeVersionOneUUIDValues({
      version: UUIDVersions.One,
      clockSequenceGetter: csg,
      nodeIdentifierGetter: ng,
      timestampGetter: tig,
    });

    expect(val.clockSequence).toEqual(new Uint8Array([
      1, 0,
    ]));
  });

  it('Returns shouldWrite: true if the clock sequence has changed from the last results.', () => {
    (getLastResults as any).mockReturnValue({});

    let counter = 0;
    (uintArrayAsBigNumber as any).mockReturnValue({
      neq: () => Boolean(counter += 1),
      geq: () => false,
    });

    const csg = jest.fn(() => new Uint8Array([ 0, 1, ]));
    const ng = jest.fn();
    const tig = jest.fn(() => [ 1, 2, 3, 4, 5, 6, 7, 8, ]);

    const val = makeVersionOneUUIDValues({
      version: UUIDVersions.One,
      clockSequenceGetter: csg,
      nodeIdentifierGetter: ng,
      timestampGetter: tig,
    });

    expect(val.shouldWrite).toBe(true);
  });

  it('Returns shouldWrite: true if the node identifier has changed from the last results.', () => {
    (getLastResults as any).mockReturnValue({});

    let counter = 0;
    (uintArrayAsBigNumber as any).mockReturnValue({
      neq: () => (counter += 1) === 2,
      geq: () => false,
    });

    const csg = jest.fn(() => new Uint8Array([ 0, 1, ]));
    const ng = jest.fn();
    const tig = jest.fn(() => [ 1, 2, 3, 4, 5, 6, 7, 8, ]);

    const val = makeVersionOneUUIDValues({
      version: UUIDVersions.One,
      clockSequenceGetter: csg,
      nodeIdentifierGetter: ng,
      timestampGetter: tig,
    });

    expect(val.shouldWrite).toBe(true);
  });
});
