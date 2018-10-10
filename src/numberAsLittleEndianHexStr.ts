export const numberAsLittleEndianHexStr = (num: number): string => {
  const bin = num.toString(2).split('').reverse().join('');
  return parseInt(bin, 2).toString(16);
};

export default numberAsLittleEndianHexStr;