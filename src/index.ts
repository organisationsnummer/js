import Personnummer from 'personnummer';
import { luhn } from './utils';
import { OrganisationsnummerError } from './errors';

class Organisationsnummer {
  /**
   * The organization number.
   *
   * @var {string}
   */
  private number = '';

  /**
   * Instance of personnummer class.
   *
   * @var {Personnummer}
   */
  private _personnummer!: InstanceType<typeof Personnummer>;

  /**
   * Parse organisationsnummer.
   *
   * @param {string} input
   */
  private parse(input: string) {
    try {
      const reg =
        /^(\d{2}){0,1}(\d{2})(\d{2})(\d{2})([-+]?)?((?!000)\d{3})(\d)$/g;
      const match = reg.exec(input);

      if (!match) {
        throw new OrganisationsnummerError();
      }

      const number = input.replace('-', '');

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

      this.number = number;
    } catch (err) {
      try {
        this._personnummer = Personnummer.parse(input);
      } catch (_) {
        throw err;
      }
    }
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
   * @param {boolean} separator
   *
   * @return {string}
   */
  public format(separator = true): string {
    let number = this.number;

    if (this.isPersonnummer()) {
      number = this._personnummer.format(true).slice(2, 12);
    }

    return separator ? number.slice(0, 6) + '-' + number.slice(6) : number;
  }

  /**
   * Get Personnummer instance.
   *
   * @return {Personnummer}
   */
  public personnummer(): Personnummer | null {
    return this._personnummer || null;
  }

  /**
   * Determine if personnummer or not.
   *
   * @return {boolean}
   */
  public isPersonnummer(): boolean {
    return !!this._personnummer;
  }

  /**
   * Get the organization type.
   *
   * @return string
   */
  public type(): string {
    if (this.isPersonnummer()) {
      return 'Enskild firma';
    }

    const unkown = 'Okänt';
    const types = {
      1: 'Dödsbon',
      2: 'Stat, landsting, kommun eller församling',
      3: 'Utländska företag som bedriver näringsverksamhet eller äger fastigheter i Sverige',
      5: 'Aktiebolag',
      6: 'Enkelt bolag',
      7: 'Ekonomisk förening eller bostadsrättsförening',
      8: 'Ideella förening och stiftelse',
      9: 'Handelsbolag, kommanditbolag och enkelt bolag',
    };

    return types[+this.number[0]] || unkown;
  }
}

export default Organisationsnummer;
