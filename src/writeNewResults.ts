import {
  writeFileSync,
} from 'fs';
import {
  isValidLastResults,
} from './TypeGuards/isValidLastResults';
import {
  homedir,
} from 'os';
import {
  join,
} from 'path';
import {
  strings,
} from './strings';
import {
  TUUIDLastResults,
} from './TypeAliases/TUUIDLastResults';

export const writeNewResults = (lastResults: TUUIDLastResults) => {
  if (!isValidLastResults(lastResults)) {
    throw new Error(strings.UUID_LAST_RESULTS_INVALID);
  }

  const formattedLastResults = {
    clockSequence: Array.prototype.slice.call(lastResults.clockSequence),
    nodeIdentifier: Array.prototype.slice.call(lastResults.nodeIdentifier),
    timestamp: Array.prototype.slice.call(lastResults.timestamp),
  };

  try {
    writeFileSync(
      join(homedir(), 'uuid'),
      JSON.stringify(formattedLastResults),
      {
        encoding: 'utf8',
      },
    );
  } catch (e) {
    throw new Error('Could not write results.');
  }
}

export default writeNewResults;
