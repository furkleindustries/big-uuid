import {
  strings,
} from './strings';
import {
  TNamespaceId,
} from './TypeAliases/TNamespaceId';
import {
  TUUIDVersion,
} from './TypeAliases/TUUIDVersion';
import {
  UUIDVersions,
} from './Enums/UUIDVersions';

const SHA1 = require('crypto-js/sha1');
const MD5 = require('crypto-js/md5');
const hex = require('crypto-js/enc-hex');

export const getHashFromNamespaceIdAndName = (
  version: TUUIDVersion,
  namespaceId: TNamespaceId,
  name: string,
): string => {
  if (!namespaceId) {
    throw new Error(strings.NAMESPACE_ID_MISSING);
  } else if (!name) {
    throw new Error(strings.NAME_MISSING);
  }

  const toHash = namespaceId + name;
  let hash;
  if (version.toString() === UUIDVersions.Three) {
    hash = MD5(toHash);
  } else {
    hash = SHA1(toHash);
  }

  return hex.stringify(hash);
}
