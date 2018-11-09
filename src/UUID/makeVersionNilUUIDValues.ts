import {
  IUUIDComponentValues,
} from './IUUIDComponentValues';

export const makeVersionNilUUIDValues = (): IUUIDComponentValues => ({
  clockSequence: new Uint8Array([ 0, 0, ]),
  nodeIdentifier: new Uint8Array([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ]),
  timestamp: new Uint8Array([ 0, 0, 0, 0, 0, 0, 0, 0, ]),
});

export default makeVersionNilUUIDValues;
