import {
  isUUIDVersion,
} from '../../TypeGuards/isUUIDVersion';
import {
  IUUIDOptions,
} from './IUUIDOptions';
import {
  UUIDVersions,
} from '../../Enums/UUIDVersions';

export const mergeUUIDOptions = (base: IUUIDOptions, toMerge: Partial<IUUIDOptions>) => {
  const options = Object.assign({}, base);

  if (toMerge && typeof toMerge === 'object') {
    /* istanbul ignore else */
    if (isUUIDVersion(toMerge.version)) {
      options.version = toMerge.version;
    }

    if (typeof toMerge.clockSequenceGetter === 'function') {
      options.clockSequenceGetter = toMerge.clockSequenceGetter;
    }
    
    if (typeof toMerge.nodeIdentifierGetter === 'function') {
      options.nodeIdentifierGetter = toMerge.nodeIdentifierGetter;
    }

    if (typeof toMerge.timestampGetter === 'function') {
      options.timestampGetter = toMerge.timestampGetter;
    }

    if (options.version === UUIDVersions.Three ||
        options.version === UUIDVersions.Five)
    {
      if (toMerge.namespaceId) {
        options.namespaceId = toMerge.namespaceId;
      }

      if (toMerge.name) {
        options.name = toMerge.name;
      }
    }
  }

  return options;
}

export default mergeUUIDOptions;
