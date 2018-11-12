import {
  strings,
} from '../src/strings';
import {
  writeNewResults,
} from '../src/writeNewResults';

import {
  writeFileSync,
} from 'fs';
jest.mock('fs');
import {
  isValidLastResults,
} from '../src/TypeGuards/isValidLastResults';
jest.mock('../src/TypeGuards/isValidLastResults');
import {
  homedir,
} from 'os';
jest.mock('os');
import {
  join,
} from 'path';
jest.mock('path');

describe('writeNewResults unit tests.', () => {
  beforeEach(() => {
    (writeFileSync as any).mockClear();
    (isValidLastResults as any).mockClear();
    (isValidLastResults as any).mockReturnValue(true);
    (homedir as any).mockClear();
    (join as any).mockImplementation((...aa: any[]) => aa.join('/'));
  });

  it('Throws if the isValidLastResults type guard fails on the argument.', () => {
    (isValidLastResults as any).mockReturnValue(false);
    const func = () => writeNewResults(null as any);
    expect(func).toThrow(strings.UUID_LAST_RESULTS_INVALID);
  });

  it('Calls homedir to find the location of the uuid file..', () => {
    const last = {
      clockSequence: [ 1, 1, ],
      nodeIdentifier: [ 2, 2, 2, 2, 2, 2, ],
      timestamp: [ 3, 3, 3, 3, 3, 3, 3, 3, ],
    };

    writeNewResults(last as any);
    expect(homedir).toBeCalledTimes(1);
  });

  it('Writes the last results in JSON to the uuid file, in utf8.', () => {
    const last = {
      clockSequence: [ 1, 1, ],
      nodeIdentifier: [ 2, 2, 2, 2, 2, 2, ],
      timestamp: [ 3, 3, 3, 3, 3, 3, 3, 3, ],
    };

    writeNewResults(last as any);
    expect((writeFileSync as any).mock.calls).toEqual([
      [
        /* In actuality this will have the result of homedir() before it. */
        '/uuid',
        '{"clockSequence":[1,1],"nodeIdentifier":[2,2,2,2,2,2],"timestamp":[3,3,3,3,3,3,3,3]}',
        {
          encoding: 'utf8',
        },
      ],
    ])
  });

  it('Throws if writeFileSync does.', () => {
    const last = {
      clockSequence: [ 1, 1, ],
      nodeIdentifier: [ 2, 2, 2, 2, 2, 2, ],
      timestamp: [ 3, 3, 3, 3, 3, 3, 3, 3, ],
    };

    (writeFileSync as any).mockImplementationOnce(() => { throw new Error('Could not write results.'); });
    const func = () => writeNewResults(last as any);
    expect(func).toThrow('Could not write results.');
  });
});
