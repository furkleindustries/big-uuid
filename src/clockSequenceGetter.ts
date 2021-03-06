import {
  convertBinStrToUint8Array,
} from './convertBinStrToUint8Array';
import {
  isUUIDVersion,
} from './TypeGuards/isUUIDVersion';
import {
  getLastResults,
} from './getLastResults';
import {
  randomBytesGenerator,
} from './randomBytesGenerator';
import {
  strings,
} from './strings';
import {
  uintArrayAsBigNumber,
} from './uintArrayAsBigNumber';
import {
  UUIDVersions,
} from './Enums/UUIDVersions';

export const clockSequenceGetter = (
  version: UUIDVersions,
  hash?: string,
): Uint8Array =>
{
  if (!isUUIDVersion(version)) {
    throw new Error(strings.UUID_VERSION_INVALID);
  }

  let clockSequence: Uint8Array;
  if (version === UUIDVersions.One || version === UUIDVersions.Four) {
    const getRandomSeq = () => {
      /* If the clock sequence cannot be found, or a non-V1 ID is being 
       * generated, generate a random new clock sequence. */
      const clockSequenceNum = uintArrayAsBigNumber(randomBytesGenerator(2));
      const clockSequenceBin = clockSequenceNum.toString(2).slice(0, 14);
      return new Uint8Array([
        parseInt(clockSequenceBin.slice(0, 6), 2),
        parseInt(clockSequenceBin.slice(6), 2),
      ]);
    };

    const lastResults = version === UUIDVersions.One ? getLastResults() : null;
    if (lastResults &&
        lastResults.clockSequence &&
        'BYTES_PER_ELEMENT' in lastResults.clockSequence)
    {
      return lastResults.clockSequence;
    } else {
      clockSequence = getRandomSeq();
    }
  } else if (version === UUIDVersions.Three || version === UUIDVersions.Five) {
    if (!hash) {
      throw new Error(strings.HASH_ARGUMENT_MISSING);
    }

    let clockSequenceStr = '';
    
    /* clock_seq_hi */
    clockSequenceStr += hash.slice(16, 18);
    /* clock_seq_low */
    clockSequenceStr += hash.slice(18, 20);
    const clockSequenceBinStr = parseInt(clockSequenceStr, 16).toString(2).padStart(14, '0');
    clockSequence = convertBinStrToUint8Array(clockSequenceBinStr);
  } else {
    /* Version is nil. */
    clockSequence = new Uint8Array([ 0, 0, ]);
  }

  return clockSequence;
}

export default clockSequenceGetter;
