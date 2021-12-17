class OrganisationsnummerError extends Error {}

type OptionsType = Record<string,any>;

const luhn = (str:string) => {
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
}

class Organisationsnummer {
  /**
   * Parse personnummer and set class properties.
   *
   * @param {string} ssn
   * @param {object} options
   */
  // eslint-disable-next-line
  public parse(ssn: string, options?: OptionsType) {
        const reg = /^(\d{2}){0,1}(\d{1})(\d{1})(\d{2})(\d{2})([-]{0,1})?(\d{3})(\d{1})$/g;
        const match = reg.exec(ssn);

        if (!match) {
        throw new OrganisationsnummerError();
        }

        const orgIdentifierNum = match[1];
        const groupNum = match[2];
        const orgNum1 = match[3];
        const orgValidation = match[4];
        const orgNum3 = match[5];
        // const sep = match[6]
        const orgNum4 = match[7];
        const checkNum = match[8];

        if (+groupNum === 4||+orgValidation < 20||orgIdentifierNum && +orgIdentifierNum !== 16) {
        throw new OrganisationsnummerError();
        }

        if (!luhn(groupNum + orgNum1 + orgValidation + orgNum3 + orgNum4 + checkNum)) {
            throw new OrganisationsnummerError();
        }

        return groupNum + orgNum1 + orgValidation + orgNum3 + orgNum4 + checkNum;
    }
}

export default Organisationsnummer;