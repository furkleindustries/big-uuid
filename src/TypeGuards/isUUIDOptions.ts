import {
  isUUIDVersion,
} from './isUUIDVersion';
import {
  IUUIDOptions,
} from '../UUID/UUIDOptions/IUUIDOptions';

export const isUUIDOptions = (maybe: any): maybe is IUUIDOptions => (
  Boolean(
    typeof maybe === 'object' &&
    maybe &&
    isUUIDVersion(maybe.version) &&
    typeof maybe.clockSequenceGetter === 'function' &&
    typeof maybe.nodeIdentifierGetter === 'function' &&
    typeof maybe.timestampGetter === 'function'
  )
);

export default isUUIDOptions;
