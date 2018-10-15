import {
  enc,
  SHA1,
  MD5,
} from 'crypto-js';
import {
  strings,
} from './strings';
import {
  TNamespaceId,
} from './TypeAliases/TNamespaceId';
import {
  TUUIDVersion,
} from './TypeAliases/TUUIDVersion';

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

  /* Put the namespace ID into "network byte order" (big-endian) */
  const bigEndianNamespaceId = namespaceId.split('-').map((segment) => {
    const len = segment.length;
    return parseInt(
      parseInt(segment, 16)
        .toString(2)
        .split('')
        .reverse()
        .join(''),
      2
    ).toString(16).padEnd(len, '0');
  }).join('-');

  const toHash = bigEndianNamespaceId + name;
  let hash;
  if (version.toString() === '3') {
    hash = MD5(toHash);
  } else {
    hash = SHA1(toHash);
  }

  return enc.Hex.stringify(hash);
}