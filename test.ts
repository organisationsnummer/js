const lib = require(process.env.FILE);
const Organisationsnummer = lib.default ? lib.default : lib;

it('should validate valid organization numbers', () => {
  const numbers = ['556016-0680', '556103-4249', '5561034249'];

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
    '556016-0680': 'Aktiebolag',
    '556103-4249': 'Aktiebolag',
    '5561034249': 'Aktiebolag',
  };

  Object.entries(numbers).forEach(([input, output]) =>
    expect(Organisationsnummer.parse(input).getType()).toBe(output)
  );
});

it('should work with personnummer', () => {
  const type = 'Enskild firma';
  const numbers = { '121212121212': '121212-1212' };

  Object.entries(numbers).forEach(([input, output]) => {
    expect(Organisationsnummer.valid(output)).toBeTruthy();
    expect(Organisationsnummer.valid(input)).toBeTruthy();
    expect(Organisationsnummer.parse(input).format(false)).toBe(
      output.replace('-', '')
    );
    expect(Organisationsnummer.parse(input).format(true)).toBe(output);
    expect(Organisationsnummer.parse(input).getType()).toBe(type);
  });
});
