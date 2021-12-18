import Organisationsnummer from './src/index';

it('should validate valid organization numers', () => {
  const numbers = ['556016-0680', '556103-4249', '5561034249'];

  numbers.forEach((number) =>
    expect(Organisationsnummer.valid(number)).toBeTruthy()
  );
});

it('should validate invalid organization numers', () => {
  const numbers = ['556016-0681', '556103-4250', '5561034250'];

  numbers.forEach((number) =>
    expect(Organisationsnummer.valid(number)).toBeFalsy()
  );
});

it('should format organization numers without separator', () => {
  const numbers = {
    '556016-0680': '5560160680',
    '556103-4249': '5561034249',
    '5561034249': '5561034249',
  };

  Object.entries(numbers).forEach(([input, output]) =>
    expect(new Organisationsnummer(input).format()).toBe(output)
  );
});

it('should format organization numers with separator', () => {
  const numbers = {
    '556016-0680': '556016-0680',
    '556103-4249': '556103-4249',
    '5561034249': '556103-4249',
  };

  Object.entries(numbers).forEach(([input, output]) =>
    expect(new Organisationsnummer(input).format(true)).toBe(output)
  );
});
