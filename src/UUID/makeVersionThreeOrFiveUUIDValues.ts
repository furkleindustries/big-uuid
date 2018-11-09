import {
  getHashFromNamespaceIdAndName,
} from '../getHashFromNamespaceIdAndName';
import {
  IUUIDComponentValues,
} from './IUUIDComponentValues';
import {
  IUUIDOptions,
} from './UUIDOptions/IUUIDOptions';
import {
  strings,
} from '../strings';
import {
  UUIDVersions,
} from '../Enums/UUIDVersions';

export const makeVersionThreeOrFiveUUIDValues = (options: IUUIDOptions): IUUIDComponentValues => {
  if (!options.namespaceId) {
    throw new Error(strings.NAMESPACE_ID_MISSING);
  } else if (!options.name) {
    throw new Error(strings.NAME_MISSING);
  }

  const hash = getHashFromNamespaceIdAndName(
    options.version as UUIDVersions.Three | UUIDVersions.Five,
    options.namespaceId,
    options.name,
  );

  /* Clock sequence is highly dependent on other values and their 
   * availability, so it should be generated first. */
  const clockSequence = options.clockSequenceGetter(
    options.version,
    hash,
  );

  const nodeIdentifier = options.nodeIdentifierGetter(
    options.version,
    hash,
  );

  const timestamp = options.timestampGetter(
    options.version,
    hash,
  );

  return {
    clockSequence,
    nodeIdentifier,
    timestamp,
  };
};

export default makeVersionThreeOrFiveUUIDValues;
