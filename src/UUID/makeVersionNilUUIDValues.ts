import {
  IUUIDComponentValues,
} from './IUUIDComponentValues';
import {
  IUUIDOptions,
} from './UUIDOptions/IUUIDOptions';

export const makeVersionNilUUIDValues = (options: IUUIDOptions): IUUIDComponentValues => ({
  clockSequence: options.clockSequenceGetter(options.version),
  nodeIdentifier: options.nodeIdentifierGetter(options.version),
  timestamp: options.timestampGetter(options.version),
});

export default makeVersionNilUUIDValues;
