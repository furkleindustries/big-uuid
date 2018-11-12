[![Build Status](https://travis-ci.org/furkleindustries/big-uuid.svg?branch=master)](https://travis-ci.org/furkleindustries/big-uuid)
[![Code coverage](https://codecov.io/gh/furkleindustries/big-uuid/branch/master/graph/badge.svg)](https://codecov.io/gh/furkleindustries/big-uuid/)

# big-uuid

## Summary

An RFC 4122 conformant UUID generator creating v1, v3, v4, and v5 UUIDs. Depends on the `crypto-js` package for its usage of MD5 (v3) and SHA (v5) hashing, the `big-integer` package to prevent precision errors, and nothing else.

## Usage

In node, first install the package:
`npm install --save big-uuid`

Then require the package:

```javascript
const uuid = require('big-uuid');

const v4 = new uuid.UUID();
console.log(v4.id);
// 005e31bc-82a9-4ad8-ce3f-33dce8f03488

const v1 = new uuid.UUID({
  version: 1,
  // Optionally provide your own clockSequenceGetter,
  // nodeIdentifierGetter, and/or timestampGetter.
});

const v3 = new uuid.UUID({
  version: 3,
  /* One of the UUIDs from the standard or one of your making. */
  namespaceId: uuid.NamespaceIds.URL,
  name: 'foobar',
});

const v5 = new uuid.UUID({
  version: 3,
  /* One of the UUIDs from the standard or one of your making. */
  namespaceId: uuid.NamespaceIds.X500,
  name: 'test',
});
```

In the browser, build the package (with `npm run build`) or install the package from npm and navigate to `node_modules/big-uuid`, then copy the `dist/browser/index.js` file and point the src of a script block to that file.