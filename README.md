# json-package-finder

## Usage

```js
const JsonPackageFinder = require('json-package-finder');
const fs = require('fs');

let packageJson = fs.readFileSync(`${__dirname}/package.json`);

let finder = JsonPackageFinder.make({
  json: JSON.parse(packageJson);
});

let babelDeps = finder.find('babel-plugin-*'); // find all babel plugins
```
