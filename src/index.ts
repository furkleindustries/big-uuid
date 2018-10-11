/* An RFC 4112 UUID generator for generating IFIDs, or Interactive Fiction
 * Identifiers. */

export * from './Enums/NamespaceIds';

export * from './UUID/UUIDOptions/IUUIDOptions';
export * from './UUID/UUIDOptions/UUIDOptions';
export * from './UUID/IUUID';
export * from './UUID/UUID';

export * from './clockSequenceGetter';
export * from './getHashFromNamespaceIdAndName';
export * from './getHundredsOfNanosecondsSinceGregorianReform';
export * from './nodeIdentifierGetter';
export * from './numberAsLittleEndianHexStr';
export * from './timestampGetter';
export * from './uintArrayAsNumber';

export * from './TypeAliases/TNamespaceId';
export * from './TypeAliases/TUUIDVersion';