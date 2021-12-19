/**
 * The luhn algorithm
 *
 * @param  {string} str
 *
 * @return {boolean}
 */
export const luhn = (str: string): boolean => {
  let sum = 0;

  str += '';

  for (let i = 0, l = str.length; i < l; i++) {
    let v = parseInt(str[i]);
    v *= 2 - (i % 2);
    if (v > 9) {
      v -= 9;
    }
    sum += v;
  }

  return sum % 10 === 0;
};
