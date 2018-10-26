import {
  TUUIDLastResults,
} from '../TypeAliases/TUUIDLastResults';

export const isValidLastResults = (maybe: any): maybe is TUUIDLastResults => (
  Boolean(
    typeof maybe === 'object' &&
    maybe &&
    Array.isArray(maybe.clockSequence) &&
    maybe.clockSequence.length === 2 &&
    Array.isArray(maybe.nodeIdentifier) &&
    maybe.nodeIdentifier.length === 8 &&
    Array.isArray(maybe.timestamp) &&
    maybe.timestamp.length === 6
  )
);

export default isValidLastResults;
