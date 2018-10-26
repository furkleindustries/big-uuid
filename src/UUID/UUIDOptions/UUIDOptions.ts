import {
  clockSequenceGetter,
} from '../../clockSequenceGetter';
import {
  isUUIDVersion,
} from '../../TypeGuards/isUUIDVersion';
import {
  IUUIDOptions,
} from './IUUIDOptions';
import {
  nodeIdentifierGetter,
} from '../../nodeIdentifierGetter';
import {
  strings,
} from '../../strings';
import {
  timestampGetter,
} from '../../timestampGetter';
import {
  TNamespaceId,
} from '../../TypeAliases/TNamespaceId';
import {
  TUUIDVersion,
} from '../../TypeAliases/TUUIDVersion';
import {
  UUIDVersions,
} from '../../Enums/UUIDVersions';

export class UUIDOptions implements IUUIDOptions {
  version: TUUIDVersion = UUIDVersions.Four;
  namespaceId?: TNamespaceId;
  name?: string;
  clockSequenceGetter = clockSequenceGetter;
  nodeIdentifierGetter = nodeIdentifierGetter;
  timestampGetter = timestampGetter;

  constructor(_args: Partial<IUUIDOptions> = {}) {
    const args = _args || {};
    if (args.version) {
      if (!isUUIDVersion(args.version)) {
        throw new Error(strings.UUID_VERSION_INVALID);
      }

      this.version = args.version;
    }

    if (typeof args.clockSequenceGetter === 'function') {
      this.clockSequenceGetter = args.clockSequenceGetter;
    }

    if (typeof args.nodeIdentifierGetter === 'function') {
      this.nodeIdentifierGetter = args.nodeIdentifierGetter; 
    }

    if (typeof args.timestampGetter === 'function') {
      this.timestampGetter = args.timestampGetter;
    }
    
    if (/^[35]$/.test(this.version.toString())) {
      if (args.namespaceId) {
        this.namespaceId = args.namespaceId;
      } else {
        throw new Error(strings.NAMESPACE_ID_MISSING);
      }
  
      if (args.name) {
        this.name = args.name;
      } else {
        throw new Error(strings.NAME_MISSING);
      }
    }
  }
}

export default UUIDOptions;
