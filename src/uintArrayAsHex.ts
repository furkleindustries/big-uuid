export const uintArrayAsHex = (array: Uint8Array): string => (
  /* There's weird error where Typescript thinks the Uint16Array has no reduce
   * method but the other two do as well, hence the type alias. */
  array.reduce<string>((str, val) => str + val.toString(16), '')
);

export default uintArrayAsHex;
