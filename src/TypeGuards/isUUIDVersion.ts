import {
  UUIDVersions,
} from '../Enums/UUIDVersions';

export const isUUIDVersion = (version: any): version is UUIDVersions => (
  Object.values(UUIDVersions).indexOf(version) !== -1
);

export default isUUIDVersion;
