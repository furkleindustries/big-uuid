import {
  isNode,
} from './isNode';
import {
  randomBytes,
} from 'crypto';

export const randomBytesGenerator: (size: number) => Uint8Array = (() => {
  return (size: number) => {
    if (isNode()) {
      return new Uint8Array(randomBytes(size))
    } else {
      // Browsers
      // @ts-ignore
      const crypto = (crypto || msCrypto);
      const QUOTA = 65536;
      const arr = new Uint8Array(size);
      for (var i = 0; i < size; i += QUOTA) {
        crypto.getRandomValues(arr.subarray(i, i + Math.min(size - i, QUOTA)));
      }

      return arr;
    }
  }
})();

export default randomBytesGenerator;