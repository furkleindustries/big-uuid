import {
  IUUID,
} from '../UUID/IUUID';

export const isUUID = (maybe: any): maybe is IUUID => (
  Boolean(
    typeof maybe === 'object' &&
    maybe &&
    maybe.version &&
    maybe.timestamp &&
    maybe.timeLow &&
    maybe.timeMid &&
    maybe.timeHigh &&
    maybe.timeHighAndVersion &&
    maybe.clockSequence &&
    maybe.clockSequenceHighAndReserved &&
    maybe.clockSequenceLow &&
    maybe.nodeIdentifier &&
    typeof maybe.toString === 'function'
  )
);

export default isUUID;
