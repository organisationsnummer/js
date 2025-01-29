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
   * @param {string} org
   */
  private parse(org: string) {
    if (org.length < 10 || org.length > 13) {
      throw new OrganisationsnummerError();
    }

    try {
      const reg = /^(\d{2}){0,1}(\d{2})(\d{2})(\d{2})([-+]?)?(\d{3})(\d)$/g;
      const match = reg.exec(org);

      if (!match) {
        throw new OrganisationsnummerError();
      }

      let number = org.replace('-', '').replace('+', '');

      // May only be prefixed with 16.
      if (match[1]) {
        if (+match[1] !== 16) {
          throw new OrganisationsnummerError();
        } else {
          number = number.slice(2);
        }
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
        this._personnummer = Personnummer.parse(org);
      } catch (_err) {
        throw err;
      }
    }
  }

  /**
   * Organisationsnummer constructor.
   *
   * @param {string} org
   */
  constructor(org: string) {
    this.parse(org);
  }

  /**
   * Parse organisationsnummer.
   *
   * @param {string} org
   *
   * @return {Organisationsnummer}
   */
  static parse(org: string): Organisationsnummer {
    return new Organisationsnummer(org);
  }

  /**
   * Validate a Swedish organization number.
   *
   * @param {string} org
   *
   * @return {boolean}
   */
  static valid(org: string): boolean {
    try {
      this.parse(org);
      return true;
    } catch (_err) {
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
    if (this.isPersonnummer()) {
      return this._personnummer
        .format(!separator)
        .substring(!separator ? 2 : 0);
    }

    return separator
      ? this.number.slice(0, 6) + '-' + this.number.slice(6)
      : this.number;
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
    const types: Record<number, string> = {
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

  /**
   * Get vat number for a organization number.
   *
   * @return string
   */
  public vatNumber(): string {
    return `SE${this.format(false)}01`;
  }
}

export const parse = Organisationsnummer.parse;
export const valid = Organisationsnummer.valid;

export default Organisationsnummer;
