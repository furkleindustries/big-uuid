import {
  uintArrayAsHex,
} from './uintArrayAsHex';

export const uintArrayAsNumber = (uintArray: Uint8Array | Uint16Array | Uint32Array): number => (
  parseInt(uintArrayAsHex(uintArray), 16)
);

export default uintArrayAsNumber;