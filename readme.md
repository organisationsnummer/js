# organisationsnummer [![Build Status](https://img.shields.io/github/actions/workflow/status/organisationsnummer/js/nodejs.yml?branch=main)](https://github.com/organisationsnummer/js/actions) [![NPM Downloads](https://img.shields.io/npm/dm/organisationsnummer.svg)](https://www.npmjs.com/package/organisationsnummer)

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

## In memoriam

Fredrik "Frozzare" Forsmo (1991-2026) was the initiator, co-founder and a core contributor of the organisationsnummer project. This library carries his work. He is missed.

## License

MIT
