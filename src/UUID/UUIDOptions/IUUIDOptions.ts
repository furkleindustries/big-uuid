import {
  TNamespaceId,
} from '../../TypeAliases/TNamespaceId';
import {
  UUIDVersions,
} from '../../Enums/UUIDVersions';

export interface IUUIDOptions {
  version: UUIDVersions;
  namespaceId?: TNamespaceId,
  name?: string,
  nodeIdentifierGetter: (version: UUIDVersions, namespaceId?: TNamespaceId, name?: string) => Uint8Array;
  timestampGetter: (version: UUIDVersions, namespaceId?: TNamespaceId, name?: string) => Uint8Array;
  clockSequenceGetter: (version: UUIDVersions, namespaceId?: TNamespaceId, name?: string) => Uint8Array;
};

export default IUUIDOptions;
