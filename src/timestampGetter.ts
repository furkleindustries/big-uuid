import bigInt from 'big-integer';
import {
  convertBinStrToUint8Array,
} from './convertBinStrToUint8Array';
import {
  getHundredsOfNanosecondsSinceGregorianReform,
} from './getHundredsOfNanosecondsSinceGregorianReform';
import {
  isUUIDVersion,
} from './TypeGuards/isUUIDVersion';
import {
  randomBytesGenerator,
} from './randomBytesGenerator';
import {
  strings,
} from './strings';
import {
  UUIDVersions,
} from './Enums/UUIDVersions';

export const timestampGetter = (
  version: UUIDVersions,
  hash?: string,
): Uint8Array =>
{
  if (!isUUIDVersion(version)) {
    throw new Error(strings.UUID_VERSION_INVALID);
  }

  let timestamp: Uint8Array;
  if (version === UUIDVersions.One) {
    const currentTimestamp = getHundredsOfNanosecondsSinceGregorianReform();
    const timestampStr = currentTimestamp.toString(2);
    timestamp = convertBinStrToUint8Array(timestampStr);
  } else if (version === UUIDVersions.Three || version === UUIDVersions.Five) {
    /* Version is 3 or 5. */
    if (!hash) {
      throw new Error(strings.HASH_ARGUMENT_MISSING);
    }

    let timestampStr = '';
    /* time_low */
    timestampStr = hash.slice(0, 8);
    /* time_mid */
    timestampStr = hash.slice(8, 12) + timestampStr;
    /* time_hi */
    timestampStr = hash.slice(12, 16) + timestampStr;
    const timestampBinStr = bigInt(timestampStr, 16).toString(2);
    timestamp = convertBinStrToUint8Array(timestampBinStr);
  } else if (version === UUIDVersions.Four) {
    timestamp = randomBytesGenerator(8);
  } else {
    /* Version is nil. */
    timestamp = new Uint8Array([ 0, 0, 0, 0, 0, 0, 0, 0, ]);
  }

  /* Clamp the result to 60 bits. */
  timestamp[0] = Math.min(32, timestamp[0]);
  timestamp = new Uint8Array(
    /* Fill missing most-significant with 0s. */
    '0'.repeat(8 - timestamp.length)
      .split('')
      .map(parseInt)
      .concat(Array.prototype.slice.call(timestamp))
  );

  return timestamp;
}

export default timestampGetter;
