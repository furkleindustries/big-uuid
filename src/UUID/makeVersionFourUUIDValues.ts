import {
  IUUIDComponentValues,
} from './IUUIDComponentValues';
import {
  IUUIDOptions,
} from './UUIDOptions/IUUIDOptions';

export const makeVersionFourUUIDValues = (options: IUUIDOptions): IUUIDComponentValues => ({
  timestamp: options.timestampGetter(options.version),
  nodeIdentifier: options.nodeIdentifierGetter(options.version),
  clockSequence: options.clockSequenceGetter(options.version),
});

export default makeVersionFourUUIDValues;
