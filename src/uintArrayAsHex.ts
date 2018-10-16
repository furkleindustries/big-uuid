export const uintArrayAsHex = (array: Uint8Array | Uint16Array | Uint32Array): string => (
  /* There's weird error where Typescript thinks the Uint16Array has no reduce
   * method but the other two do as well, hence the type alias. */
  (array as Uint8Array).reduce<string>((str, val) => {
    return str + val.toString(16);
  }, '')
)

export default uintArrayAsHex;