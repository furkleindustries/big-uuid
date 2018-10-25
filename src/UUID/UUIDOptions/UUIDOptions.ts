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

export class UUIDOptions implements IUUIDOptions {
  version: TUUIDVersion = '4';
  namespaceId?: TNamespaceId;
  name?: string;
  clockSequenceGetter = clockSequenceGetter;
  nodeIdentifierGetter = nodeIdentifierGetter;
  timestampGetter = timestampGetter;

  constructor(_args: { [key: string]: any } = {}) {
    const args = _args || {};
    if (args.version) {
      if (!isUUIDVersion(args.version)) {
        throw new Error(strings.UUID_VERSION_INVALID);
      }

      this.version = args.version;
    }

    if (args.clockSequenceGetter) {
      this.clockSequenceGetter = args.clockSequenceGetter;
    }

    if (args.nodeIdentifierGetter) {
      this.nodeIdentifierGetter = args.nodeIdentifierGetter; 
    }

    if (args.timestampGetter) {
      this.timestampGetter = args.timestampGetter;
    }

    if (args.namespaceId) {
      this.namespaceId = args.namespaceId;
    }

    if (args.name) {
      this.namespaceId = args.namespaceId;
    }

    if (/^[35]$/.test(this.version.toString())) {
      if (!this.namespaceId) {
        throw new Error(strings.NAMESPACE_ID_MISSING);
      } else if (!this.name) {
        throw new Error(strings.NAME_MISSING);
      }
    }
  }
}

export default UUIDOptions;