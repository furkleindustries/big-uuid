import {
  fromArray, BigInteger,
} from 'big-integer';

export const uintArrayAsNumber = (uintArray: Uint8Array | Uint16Array | Uint32Array): BigInteger => (
  fromArray(Array.from(uintArray), 256)
);

export default uintArrayAsNumber;
