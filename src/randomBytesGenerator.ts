import {
  isNode,
} from './isNode';
import {
  randomBytes,
} from 'crypto';

export const randomBytesGenerator = (size: number) => {
  if (isNode()) {
    return new Uint8Array(randomBytes(size));
  } else {
    /* We are in-browser. Using the node crypto library here would increase
     * bundle size enormously. */
    // @ts-ignore
    const crypto = (window.crypto /* istanbul ignore next */ || window.msCrypto);
    const quota = 65536;
    const arr = new Uint8Array(size);
    for (let ii = 0; ii < size; ii += quota) {
      crypto.getRandomValues(arr.subarray(ii, ii + Math.min(size - ii, quota)));
    }

    return arr;
  }
};

export default randomBytesGenerator;
