import organisationsnummer from './src';

it('should validate valid organization numbers', () => {
  const numbers = ['556016-0680', '556103-4249', '5561034249'];

  numbers.forEach((number) =>
    expect(organisationsnummer.valid(number)).toBeTruthy()
  );
});

it('should validate invalid organization numbers', () => {
  const numbers = ['556016-0681', '556103-4250', '5561034250'];

  numbers.forEach((number) =>
    expect(organisationsnummer.valid(number)).toBeFalsy()
  );
});

it('should format organization numbers without separator', () => {
  const numbers = {
    '556016-0680': '5560160680',
    '556103-4249': '5561034249',
    '5561034249': '5561034249',
  };

  Object.entries(numbers).forEach(([input, output]) =>
    expect(organisationsnummer.parse(input).format()).toBe(output)
  );
});

it('should format organization numbers with separator', () => {
  const numbers = {
    '556016-0680': '556016-0680',
    '556103-4249': '556103-4249',
    '5561034249': '556103-4249',
  };

  Object.entries(numbers).forEach(([input, output]) =>
    expect(organisationsnummer.parse(input).format(true)).toBe(output)
  );
});

it('should get type from organization numbers', () => {
  const numbers = {
    '556016-0680': 'Aktiebolag',
    '556103-4249': 'Aktiebolag',
    '5561034249': 'Aktiebolag',
  };

  Object.entries(numbers).forEach(([input, output]) =>
    expect(organisationsnummer.parse(input).getType()).toBe(output)
  );
});
