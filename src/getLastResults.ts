import {
  readFileSync,
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
  TUUIDLastResults,
} from './TypeAliases/TUUIDLastResults';

let lastResults: TUUIDLastResults | null = null;

export const getLastResults = () => {
  if (lastResults) {
    return lastResults;
  }

  let tempLastResults;
  try {
    const fileStr = readFileSync(join(homedir(), 'ifid'), 'utf8');
    tempLastResults = JSON.parse(fileStr) as TUUIDLastResults;
  } catch (e) { /* Do nothing. */ }

  if (isValidLastResults(tempLastResults)) {
    lastResults = tempLastResults;
    return lastResults;
  } else {
    return {} as TUUIDLastResults;
  }
};

export default getLastResults;
