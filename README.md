# Streamlet
Streamlet is a NodeJS-based stream-oriented database optimal for small scale projects that need a high speed method for storing data.

## Getting started
Add Streamlet to your project
```
npm install privatesuite/streamlet
```

Create a streamlet instance
```js
const streamlet = require('streamlet')
const db = new Streamlet('./db')
```

## Running tests
Streamlet uses [Mocha](https://github.com/mochajs/mocha) and [Chai](https://github.com/chaijs/chai) to run tests, If Mocha is installed simpily run `mocha` from the root directory.

## Authors
- [Aurame](https://github.com/SuperAuguste) - Initial work
- [Puffycheeses](https://github.com/Puffycheeses) - Documentation & Maintenance

## License
This project is licensed under the GNU General Public License v3
