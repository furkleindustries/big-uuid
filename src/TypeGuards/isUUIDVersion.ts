import {
  TUUIDVersion,
} from '../TypeAliases/TUUIDVersion';
import {
  UUIDVersions,
} from '../Enums/UUIDVersions';

export const isUUIDVersion = (version: any): version is TUUIDVersion => (
  Object.values(UUIDVersions).indexOf(version.toString()) !== -1
);

export default isUUIDVersion;
