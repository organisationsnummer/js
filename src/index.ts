import { luhn } from './utils';
import { OrganisationsnummerError } from './errors';

class Organisationsnummer {
  /**
   * The organization numer.
   *
   * @var {string}
   */
  private orgNum = '';

  /**
   * Parse organisationsnummer.
   *
   * @param {string} input
   */
  private parse(input: string) {
    const number = input.replace('-', '');

    const reg = /^(\d{2}){0,1}(\d{2})(\d{2})(\d{2})([-]?)?((?!000)\d{3})(\d)$/g;
    const match = reg.exec(number);

    if (!match) {
      throw new OrganisationsnummerError();
    }

    // May only be prefixed with 16.
    if (match[1] && +match[1] !== 16) {
      throw new OrganisationsnummerError();
    }

    // Third digit bust be more than 20.
    if (+match[3] < 20) {
      throw new OrganisationsnummerError();
    }

    // May not start with leading 0.
    if (+match[2] < 10) {
      throw new OrganisationsnummerError();
    }

    if (!luhn(number)) {
      throw new OrganisationsnummerError();
    }

    this.orgNum = number;
  }

  /**
   * Organisationsnummer constructor.
   *
   * @param {string} ssn
   */
  constructor(input: string) {
    this.parse(input);
  }

  /**
   * Parse organisationsnummer.
   *
   * @param {string} input
   *
   * @return {Organisationsnummer}
   */
  static parse(input: string): Organisationsnummer {
    return new Organisationsnummer(input);
  }

  /**
   * Validate a Swedish organization number.
   *
   * @param {string} input
   *
   * @return {boolean}
   */
  static valid(input: string): boolean {
    try {
      this.parse(input);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Format Swedish organization number with or without separator.
   *
   * @return {boolean}
   */
  public format(long = false): string {
    return long
      ? this.orgNum.slice(0, 6) + '-' + this.orgNum.slice(6)
      : this.orgNum;
  }

  /**
   * Get the organization type.
   *
   * @return string
   */
  public getType(): string {
    const types = {
      0: '',
      1: 'Dödsbon',
      2: 'Stat, landsting, kommuner och församlingar',
      3: 'Utländska företag som bedriver näringsverksamhet eller äger fastigheter i Sverige',
      4: '',
      5: 'Aktiebolag',
      6: 'Enkelt bolag',
      7: 'Ekonomiska föreningar',
      8: 'Ideella föreningar och stiftelser',
      9: 'Handelsbolag, kommanditbolag och enkla bolag',
    };

    return types[+this.orgNum[0]];
  }
}

export default Organisationsnummer;
