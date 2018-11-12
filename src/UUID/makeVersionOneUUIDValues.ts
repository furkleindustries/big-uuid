import {
  getLastResults,
} from '../getLastResults';
import {
  IUUIDComponentValues,
} from './IUUIDComponentValues';
import {
  IUUIDOptions,
} from './UUIDOptions/IUUIDOptions';
import {
  uintArrayAsBigNumber,
} from '../uintArrayAsBigNumber';
import {
  UUIDVersions,
} from '../Enums/UUIDVersions';

export const makeVersionOneUUIDValues = (options: IUUIDOptions): IUUIDComponentValues & { shouldWrite: boolean, } => {
  const nodeIdentifier = options.nodeIdentifierGetter(options.version);
  const timestamp = options.timestampGetter(options.version);
  const lastResults = getLastResults();
  let clockSequence = (() => {
    if (lastResults &&
        uintArrayAsBigNumber(lastResults.nodeIdentifier).neq(uintArrayAsBigNumber(nodeIdentifier)))
    {
      /* Create a random clock sequence if the node identifier has changed. */ 
      return options.clockSequenceGetter(UUIDVersions.Four);
    } else {
      return options.clockSequenceGetter(options.version);
    }
  })();

  /* Indicate that the new results should be written to the external file if
   * any have changed or could not be found. */
  let shouldWrite = false;
  if (!lastResults) {
    shouldWrite = true;
  } else {
    const oldTimestamp = lastResults.timestamp;
    const oldClockSequence = lastResults.clockSequence;
    /* Check if the last recorded timestamp is after the current time. */
    if ((oldTimestamp && 'BYTES_PER_ELEMENT' in oldTimestamp) &&
        (oldClockSequence && 'BYTES_PER_ELEMENT' in oldClockSequence))
    {
      const oldTimeInt = uintArrayAsBigNumber(oldTimestamp);
      const newTimeInt = uintArrayAsBigNumber(timestamp);
      /* istanbul ignore else */
      if (oldTimeInt.geq(newTimeInt)) {
        /* Increment the clock sequence given that the timestamp is invalid. */
        clockSequence[1] += 1;
        if (clockSequence[1] === 0) {
          /* Increment the upper byte if the lower byte wrapped around. */
          clockSequence[0] += 1;
        }

        shouldWrite = true;
      }
    }

    if (
      uintArrayAsBigNumber(clockSequence).neq(uintArrayAsBigNumber(lastResults.clockSequence)) ||
      uintArrayAsBigNumber(nodeIdentifier).neq(uintArrayAsBigNumber(lastResults.nodeIdentifier)))
    {
      shouldWrite = true;
    }
  }

  return {
    clockSequence,
    nodeIdentifier,
    shouldWrite,
    timestamp,
  };
};

export default makeVersionOneUUIDValues;
