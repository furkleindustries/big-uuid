import {
  strings,
} from './strings';
import {
  TNamespaceId,
} from './TypeAliases/TNamespaceId';
import {
  UUIDVersions,
} from './Enums/UUIDVersions';

const MD5 = require('crypto-js/md5');
const SHA1 = require('crypto-js/sha1');
const hex = require('crypto-js/enc-hex');

export const getHashFromNamespaceIdAndName = (
  version: UUIDVersions.Three | UUIDVersions.Five,
  namespaceId: TNamespaceId,
  name: string,
): string => {
  if (!namespaceId) {
    throw new Error(strings.NAMESPACE_ID_MISSING);
  } else if (!name) {
    throw new Error(strings.NAME_MISSING);
  }

  const toHash = namespaceId + name;
  const hash = version === UUIDVersions.Three ? MD5(toHash) : SHA1(toHash);
  return hex.stringify(hash);
}

export default getHashFromNamespaceIdAndName;
