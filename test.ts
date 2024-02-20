import { it, expect } from 'vitest';
import { request } from 'undici';

const Organisationsnummer = process.env.FILE?.includes('cjs')
  ? require(process.env.FILE)
  : (await import(process.env.FILE)).default;

const _testList = {};

const testList = (file = 'list'): Promise<any> => {
  if (Array.isArray(_testList[file]) && _testList[file].length) {
    return new Promise((resolve) => {
      resolve(_testList[file].length);
    });
  }

  const res = request(
    `https://raw.githubusercontent.com/organisationsnummer/meta/main/testdata/${file}.json`,
    {},
  ).then((p) => p.body.json());

  _testList[file] = res;

  return res;
};

it('should validate valid organization numbers', async () => {
  const list = await testList();

  list
    .filter((item) => item.valid)
    .forEach((item) => {
      expect(Organisationsnummer.valid(item.input)).toBeTruthy();
    });
});

it('should validate invalid organization numbers', async () => {
  const list = await testList();

  list
    .filter((item) => !item.valid)
    .forEach((item) => expect(Organisationsnummer.valid(item)).toBeFalsy());
});

it('should format organization numbers without separator', async () => {
  const list = await testList();

  list
    .filter((item) => item.valid)
    .forEach((item) =>
      expect(Organisationsnummer.parse(item.input).format(false)).toBe(
        item.short_format,
      ),
    );
});

it('should format organization numbers with separator', async () => {
  const list = await testList();

  list
    .filter((item) => item.valid)
    .forEach((item) =>
      expect(Organisationsnummer.parse(item.input).format()).toBe(
        item.long_format,
      ),
    );
});

it('should get type from organization numbers', async () => {
  const list = await testList();

  list
    .filter((item) => item.valid)
    .forEach((item) =>
      expect(Organisationsnummer.parse(item.input).type()).toBe(item.type),
    );
});

it('should get vat number for organization numbers', async () => {
  const list = await testList();

  list
    .filter((item) => item.valid)
    .forEach((item) =>
      expect(Organisationsnummer.parse(item.input).vatNumber()).toBe(
        item.vat_number,
      ),
    );
});

it('should work with personal identity numbers', async () => {
  const list = await testList();

  list
    .filter((item) => item.valid)
    .filter((item) => item.type === 'Enskild firma')
    .forEach((item) => {
      expect(Organisationsnummer.valid(item.long_format)).toBeTruthy();
      expect(Organisationsnummer.valid(item.input)).toBeTruthy();
      const org = Organisationsnummer.parse(item.input);
      expect(org.format(false)).toBe(item.short_format);
      expect(org.format(true)).toBe(item.long_format);
      expect(org.type()).toBe(item.type);
      expect(org.isPersonnummer()).toBeTruthy();
      expect(org.personnummer().constructor.name).toBe('Personnummer');
      expect(org.vatNumber()).toBe(item.vat_number);
    });
});
