import { luhn } from './utils';
import { OrganisationsnummerError } from './errors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OptionsType = Record<string, any>;

class Organisationsnummer {
  private orgIdentifierNum = '';
  private groupNum = '';
  private orgNum1 = '';
  private orgNum3 = '';
  private orgNum4 = '';
  private orgValidation = '';
  private checkNum = '';

  /**
   * Parse organisationsnummer and set class properties.
   *
   * @param {string} input
   * @param {object} options
   */
  // eslint-disable-next-line
  private parse(input: string, options?: OptionsType) {
    const reg =
      /^(\d{2}){0,1}(\d{1})(\d{1})(\d{2})(\d{2})([-]{0,1})?(\d{3})(\d{1})$/g;
    const match = reg.exec(input);

    if (!match) {
      throw new OrganisationsnummerError();
    }

    this.orgIdentifierNum = match[1];
    this.groupNum = match[2];
    this.orgNum1 = match[3];
    this.orgValidation = match[4];
    this.orgNum3 = match[5];
    // const sep = match[6]
    this.orgNum4 = match[7];
    this.checkNum = match[8];

    if (
      +this.groupNum === 4 ||
      +this.orgValidation < 20 ||
      (this.orgIdentifierNum && +this.orgIdentifierNum !== 16)
    ) {
      throw new OrganisationsnummerError();
    }

    if (!this.valid()) {
      throw new OrganisationsnummerError();
    }
  }

  /**
   * Organisationsnummer constructor.
   *
   * @param {string} ssn
   * @param {object} options
   */
  constructor(input: string, options?: OptionsType) {
    this.parse(input, options);
  }

  /**
   * Parse organisationsnummer.
   *
   * @param {string} input
   * @param {object} options
   *
   * @return {Organisationsnummer}
   */
  static parse(input: string, options?: OptionsType): Organisationsnummer {
    return new Organisationsnummer(input, options);
  }

  /**
   * Validate a Swedish organisational number.
   *
   * @param {string} str
   * @param {object} options
   *
   * @return {boolean}
   */
  static valid(input: string, options?: OptionsType): boolean {
    try {
      this.parse(input, options);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Format Swedish organisational number with or without separator.
   *
   * @return {boolean}
   */
  public format(long = false): string {
    const orgNum =
      this.groupNum +
      this.orgNum1 +
      this.orgValidation +
      this.orgNum3 +
      this.orgNum4 +
      this.checkNum;

    return long ? orgNum.slice(0, 6) + '-' + orgNum.slice(6) : orgNum;
  }

  /**
   * Validate a Swedish organisational number.
   *
   * @return {boolean}
   */
  private valid(): boolean {
    return luhn(
      this.groupNum +
        this.orgNum1 +
        this.orgValidation +
        this.orgNum3 +
        this.orgNum4 +
        this.checkNum
    );
  }
}

export default Organisationsnummer;
