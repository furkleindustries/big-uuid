import {
  TUUIDVersion,
} from '../../TypeAliases/TUUIDVersion';
import {
  TNamespaceId,
} from '../../TypeAliases/TNamespaceId';

export interface IUUIDOptions {
  version: TUUIDVersion;
  name?: string;
  namespaceId?: TNamespaceId;
  nodeIdentifierGetter: (version: TUUIDVersion, namespaceId?: TNamespaceId, name?: string) => Uint8Array;
  timestampGetter:      (version: TUUIDVersion, namespaceId?: TNamespaceId, name?: string) => Uint8Array;
  clockSequenceGetter:  (version: TUUIDVersion, namespaceId?: TNamespaceId, name?: string) => Uint8Array;
};

export default IUUIDOptions;