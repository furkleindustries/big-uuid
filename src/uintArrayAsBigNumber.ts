import {
  BigInteger,
  fromArray,
} from 'big-integer';

export const uintArrayAsBigNumber = (uintArray: Uint8Array): BigInteger => (
  fromArray(Array.prototype.slice.call(uintArray), 256)
);

export default uintArrayAsBigNumber;
