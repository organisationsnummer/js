import { describe, it, expect } from 'vitest';
import { luhn } from './utils';

describe('luhn', () => {
  it('should return false for an empty string', () => {
    expect(luhn('')).toBeFalsy();
  });

  it('should return false for a non-numeric string', () => {
    expect(luhn('abcd')).toBeFalsy();
  });

  it('should return false for a string with non-numeric characters', () => {
    expect(luhn('1234abcd')).toBeFalsy();
  });

  it('should return true for a valid number', () => {
    expect(luhn('1212121212')).toBeTruthy();
  });

  it('should return true for a long valid number', () => {
    expect(luhn('1234567812345670')).toBeTruthy();
  });
});
