const lib = require(process.env.FILE);
const Organisationsnummer = process.env.FILE?.includes('cjs')
  ? lib
  : lib.default;

it('should validate valid organization numbers', () => {
  const numbers = ['556016-0680', '556103-4249', '5561034249', '559244-0001'];

  numbers.forEach((number) =>
    expect(Organisationsnummer.valid(number)).toBeTruthy()
  );
});

it('should validate invalid organization numbers', () => {
  const numbers = ['556016-0681', '556103-4250', '5561034250'];

  numbers.forEach((number) =>
    expect(Organisationsnummer.valid(number)).toBeFalsy()
  );
});

it('should format organization numbers without separator', () => {
  const numbers = {
    '559244-0001': '5592440001',
    '556016-0680': '5560160680',
    '556103-4249': '5561034249',
    '5561034249': '5561034249',
  };

  Object.entries(numbers).forEach(([input, output]) =>
    expect(Organisationsnummer.parse(input).format(false)).toBe(output)
  );
});

it('should format organization numbers with separator', () => {
  const numbers = {
    '559244-0001': '559244-0001',
    '556016-0680': '556016-0680',
    '556103-4249': '556103-4249',
    '5561034249': '556103-4249',
  };

  Object.entries(numbers).forEach(([input, output]) =>
    expect(Organisationsnummer.parse(input).format()).toBe(output)
  );
});

it('should get type from organization numbers', () => {
  const numbers = {
    '559244-0001': 'Aktiebolag',
    '556016-0680': 'Aktiebolag',
    '556103-4249': 'Aktiebolag',
    '5561034249': 'Aktiebolag',
  };

  Object.entries(numbers).forEach(([input, output]) =>
    expect(Organisationsnummer.parse(input).type()).toBe(output)
  );
});

it('should get vat number for organization numbers', () => {
  const numbers = {
    '559244-0001': 'SE559244000101',
    '556016-0680': 'SE556016068001',
    '556103-4249': 'SE556103424901',
    '5561034249': 'SE556103424901',
  };

  Object.entries(numbers).forEach(([input, output]) =>
    expect(Organisationsnummer.parse(input).vatNumber()).toBe(output)
  );
});

it('should work with personal identity numbers', () => {
  const type = 'Enskild firma';
  const numbers = { '121212121212': '121212-1212' };

  Object.entries(numbers).forEach(([input, output]) => {
    expect(Organisationsnummer.valid(output)).toBeTruthy();
    expect(Organisationsnummer.valid(input)).toBeTruthy();
    const org = Organisationsnummer.parse(input);
    expect(org.format(false)).toBe(output.replace('-', ''));
    expect(org.format(true)).toBe(output);
    expect(org.type()).toBe(type);
    expect(org.isPersonnummer()).toBeTruthy();
    expect(org.personnummer().constructor.name).toBe('Personnummer');
  });
});

it('should get vat number for personal identity numbers', () => {
  const numbers = {
    '121212121212': 'SE121212121201',
    '12121212-1212': 'SE121212121201',
  };

  Object.entries(numbers).forEach(([input, output]) =>
    expect(Organisationsnummer.parse(input).vatNumber()).toBe(output)
  );
});
