import {
  getHashFromNamespaceIdAndName,
} from '../src/getHashFromNamespaceIdAndName';
import {
  strings,
} from '../src/strings';
import {
  UUIDVersions,
} from '../src/Enums/UUIDVersions';

const MD5 = require('crypto-js/md5');
jest.mock('crypto-js/md5');
const SHA1 = require('crypto-js/sha1');
jest.mock('crypto-js/sha1');
const hex = require('crypto-js/enc-hex');
jest.mock('crypto-js/enc-hex');

describe('getHashFromNamespaceIdAndName unit tests.', () => {
  beforeEach(() => {
    (MD5 as any).mockClear();
    (SHA1 as any).mockClear();
    ((hex as any).stringify as any).mockClear();
  });

  it('Throws if the namespaceId argument is falsy.', () => {
    const func = () => (
      getHashFromNamespaceIdAndName(
        UUIDVersions.Three,
        false as any,
        false as any
      )
    );

    expect(func).toThrow(strings.NAMESPACE_ID_MISSING);
  });

  it('Throws if the name argument is falsy.', () => {
    const func = () => (
      getHashFromNamespaceIdAndName(
        UUIDVersions.Five,
        'foo',
        false as any,
      )
    );

    expect(func).toThrow(strings.NAME_MISSING);
  });

  it('Combines the namespace ID and name and passes them to the hashing algorithm for version 3.', () => {
      getHashFromNamespaceIdAndName(
        UUIDVersions.Three,
        'namespaceId',
        'name',
      );

      expect((MD5 as any).mock.calls).toEqual([
        [ 'namespaceIdname' ],
      ]);
  });

  it('Combines the namespace ID and name and passes them to the hashing algorithm for version 3.', () => {
      getHashFromNamespaceIdAndName(
        UUIDVersions.Five,
        'namespaceId',
        'name',
      );

      expect((SHA1 as any).mock.calls).toEqual([
        [ 'namespaceIdname' ],
      ]);
  });

  it('Passes the product from the hasher to hex.stringify.', () => {
    (SHA1 as any).mockReturnValue('testval');
    
    getHashFromNamespaceIdAndName(
      UUIDVersions.Five,
      'namespaceId',
      'name',
    );

    expect((hex.stringify as any).mock.calls).toEqual([
      [ 'testval' ],
    ]);
  });
});
