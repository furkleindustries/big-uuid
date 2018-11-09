import {
  getHundredsOfNanosecondsSinceGregorianReform,
} from '../src/getHundredsOfNanosecondsSinceGregorianReform';

describe('getHundredsOfNanosecondsSinceGregorianReform unit tests.', () => {
  it('Produces a number.', () => {
    const val = getHundredsOfNanosecondsSinceGregorianReform();
    expect(Boolean(
      typeof val === 'number' &&
      !Number.isNaN(val)
    ));
  });

  it('Produces a number greater than when I wrote this test.', () => {
    const val = getHundredsOfNanosecondsSinceGregorianReform();
    expect(val).toBeGreaterThan(137610204862390);
  });
});
