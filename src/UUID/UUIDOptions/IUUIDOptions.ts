import {
  TNamespaceId,
} from '../../TypeAliases/TNamespaceId';
import {
  TUUIDVersion,
} from '../../TypeAliases/TUUIDVersion';

export interface IUUIDOptions {
  version: TUUIDVersion;
  namespaceId?: TNamespaceId,
  name?: string,
  nodeIdentifierGetter: (version: TUUIDVersion, namespaceId?: TNamespaceId, name?: string) => Uint8Array;
  timestampGetter:      (version: TUUIDVersion, namespaceId?: TNamespaceId, name?: string) => Uint8Array;
  clockSequenceGetter:  (version: TUUIDVersion, namespaceId?: TNamespaceId, name?: string) => Uint8Array;
};

export default IUUIDOptions;