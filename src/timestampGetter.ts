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
  TUUIDVersion,
} from './TypeAliases/TUUIDVersion';
import {
  UUIDVersions,
} from './Enums/UUIDVersions';

export function timestampGetter(
  version: TUUIDVersion,
  hash?: string,
): Uint8Array
{
  if (!isUUIDVersion(version)) {
    throw new Error(strings.UUID_VERSION_INVALID);
  }
  
  let timestamp: Uint8Array;
  if (version.toString() === UUIDVersions.One) {
    const currentTimestamp = getHundredsOfNanosecondsSinceGregorianReform();
    const timestampStr = currentTimestamp.toString(2).padStart(60, '0');
    const inputArr = [];
    for (let ii = 60; ii > 0; ii -= 8) {
      const byte = timestampStr.slice(ii - 8, ii).padStart(8, '0');
      inputArr.unshift(parseInt(byte, 2));
    }

    timestamp = new Uint8Array(inputArr);  
  } else if (/^[35]$/.test(version.toString())) {
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
    const timestampBinStr = parseInt(timestampStr, 16).toString(2).padStart(60, '0');
    timestamp = convertBinStrToUint8Array(timestampBinStr);
  } else {
    /* version is 4 */
    timestamp = randomBytesGenerator(8);
    /* Only take the most significant 4 bits of the last byte as the timestamp
     * is only 60 bits. */
    timestamp[7] = parseInt(timestamp[7].toString(2).slice(0, 4), 2);
  }

  return timestamp;
}

export default timestampGetter;
