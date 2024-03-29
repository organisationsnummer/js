# organisationsnummer [![Build Status](https://img.shields.io/github/actions/workflow/status/organisationsnummer/js/nodejs.yml?branch=master)](https://github.com/organisationsnummer/js/actions) [![NPM Downloads](https://img.shields.io/npm/dm/organisationsnummer.svg)](https://www.npmjs.com/package/organisationsnummer)

Validate Swedish organization numbers. Follows version 1.1 of the [specification](https://github.com/organisationsnummer/meta#package-specification-v11).

Install the module with npm:

```
npm install --save organisationsnummer
```

## Example

```javascript
import Organisationsnummer from 'organisationsnummer';

Organisationsnummer.valid('202100-5489');
//=> true
```

See [test.ts](test.ts) for more examples.

## License

MIT
