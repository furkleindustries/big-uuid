import {
  TUUIDVersion,
} from '../TypeAliases/TUUIDVersion';

export const isUUIDVersion = (version: any): version is TUUIDVersion => (
  /^(nil)|[1345]$/i.test(version.toString())
);

export default isUUIDVersion;