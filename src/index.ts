/* An RFC 4112 UUID generator for generating IFIDs, or Interactive Fiction
 * Identifiers. */

export * from './UUID/UUID';
export * from './UUID/IUUID';
export * from './UUID/UUIDOptions/UUIDOptions';
export * from './UUID/UUIDOptions/IUUIDOptions';

export * from './Enums/NamespaceIds';

export * from './clockSequenceGetter';
export * from './getHashFromNamespaceIdAndName';
export * from './getHundredsOfNanosecondsSinceGregorianReform';
export * from './nodeIdentifierGetter';
export * from './timestampGetter';
export * from './uintArrayAsNumber';

export * from './TypeAliases/TNamespaceId';
export * from './TypeAliases/TUUIDVersion';

/* Export required crypto-js libraries to reduce bundle size in `ifid`.
 * This shouldn't be necessary but there's something weird about the way
 * crypto-js modularizes its libraries and Typescript doesn't like it. */
const SHA1 = require('crypto-js/sha1');
const SHA256 = require('crypto-js/sha256')
const MD5 = require('crypto-js/md5');
const hex = require('crypto-js/enc-hex');

export const cryptoJs = {
  hex,
  MD5,
  SHA1,
  SHA256,
};
